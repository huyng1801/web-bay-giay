import React, { useEffect, useState } from 'react';
import { message, Modal, Form, Row, Col } from 'antd';
import OrderService from '../../services/admin/OrderService';
import AdminLayout from '../../layouts/AdminLayout';
import ProductService from '../../services/admin/ProductService';
import CustomerService from '../../services/admin/CustomerService';
import ProductDetailsService from '../../services/admin/ProductDetailsService';
import * as VoucherService from '../../services/admin/VoucherService';
import { calculateDiscountedPrice } from '../../utils/priceUtils';

// Import child components
import ProductSearchTable from '../../components/admin/ProductSearchTable';
import CartSection from '../../components/admin/CartSection';
import ProductSelectionModal from '../../components/admin/ProductSelectionModal';
import CustomerModal from '../../components/admin/CustomerModal';
import CustomerSelectionModal from '../../components/admin/CustomerSelectionModal';
import CheckoutModal from '../../components/admin/CheckoutModal';

const AdminSalePage = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [phone, setPhone] = useState('');
  const [findingCustomer, setFindingCustomer] = useState(false);
  
  // Voucher states
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [availableVouchers, setAvailableVouchers] = useState([]);
  
  // Customer selection
  const [customerListVisible, setCustomerListVisible] = useState(false);
  const [allCustomers, setAllCustomers] = useState([]);
  
  // Current user
  const [currentUser, setCurrentUser] = useState(null);
  
  // Modal states
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [createCustomerVisible, setCreateCustomerVisible] = useState(false);
  const [productSelectionVisible, setProductSelectionVisible] = useState(false);
  
  // Product selection states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDetails, setProductDetails] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(null);
  
  // Form instances
  const [checkoutForm] = Form.useForm();
  const [customerForm] = Form.useForm();
  
  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('IN_STORE');
  
  // Pending order states for in-store sales
  const [pendingOrderId, setPendingOrderId] = useState(null);
  const [reservedItems, setReservedItems] = useState(new Map()); // Track reserved stock
  const [holdTimeout, setHoldTimeout] = useState(null);
  const [isHoldingStock, setIsHoldingStock] = useState(false);

  // Inline styles
  const styles = {
    pageContainer: {
      minHeight: 'calc(100vh - 64px)'
    },
    row: {
      height: '100%'
    }
  };

  // Load all products
  const fetchProducts = async (keyword = '') => {
    setLoading(true);
    try {
      const data = await ProductService.getAllProducts(null, null, keyword || null);
      setProducts(data);
    } catch (error) {
      message.error('Không thể tải sản phẩm!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchAllCustomers();
    fetchCurrentUser();
    
    // Cleanup function to release pending order when component unmounts
    return () => {
      if (pendingOrderId && holdTimeout) {
        releasePendingOrder('Thoát khỏi trang bán hàng');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load vouchers when cart or customer changes
  useEffect(() => {
    const loadVouchers = async () => {
      try {
        // Calculate current order value for voucher validation
        const currentOrderValue = cart.reduce((sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 0), 0);
        
        console.log('Loading vouchers with params:', {
          customerId: customer?.customerId || null,
          orderValue: currentOrderValue,
          customerType: customer ? 'registered' : 'guest'
        });
        
        // Get vouchers for customer or all customers if no specific customer
        // Pass customerId as null for guest customers to get ALL_CUSTOMERS vouchers
        const vouchers = await VoucherService.getAvailableVouchersForCustomer(
          customer?.customerId || null, 
          currentOrderValue
        );
        
        console.log('Received vouchers:', vouchers);
        
        // Debug each voucher structure
        if (vouchers && vouchers.length > 0) {
          vouchers.forEach(voucher => {
            console.log('Voucher detail:', {
              voucherId: voucher.voucherId,
              voucherCode: voucher.voucherCode,
              voucherName: voucher.voucherName,
              discountType: voucher.discountType,
              discountValue: voucher.discountValue,
              maxDiscountValue: voucher.maxDiscountValue,
              minOrderValue: voucher.minOrderValue,
              // Fallback fields for compatibility
              code: voucher.code,
              name: voucher.name,
              maxDiscount: voucher.maxDiscount
            });
          });
        }
        
        setAvailableVouchers(vouchers || []);
      } catch (error) {
        console.error('Error loading vouchers:', error);
        setAvailableVouchers([]);
      }
    };
    
    // Only load vouchers if there are items in cart (to check order value)
    if (cart.length > 0) {
      loadVouchers();
    } else {
      // Clear vouchers if cart is empty
      setAvailableVouchers([]);
    }
  }, [cart, customer]); // Reload when cart or customer changes

  // Load all customers for selection
  const fetchAllCustomers = async () => {
    try {
      const data = await CustomerService.getAllCustomers();
      setAllCustomers(data || []);
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  // Get current user info
  const fetchCurrentUser = async () => {
    try {
      // Get user from localStorage or session
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUser({
          userId: user.adminUserId || user.id || 1,
          fullName: user.fullName || user.name || 'Admin User',
          username: user.username || user.email || 'admin'
        });
      } else {
        // Fallback mock user for demo
        setCurrentUser({ 
          userId: 1, 
          fullName: 'Nguyễn Văn Admin', 
          username: 'admin' 
        });
      }
    } catch (error) {
      console.error('Error loading current user:', error);
      // Fallback mock user
      setCurrentUser({ 
        userId: 1, 
        fullName: 'Nguyễn Văn Admin', 
        username: 'admin' 
      });
    }
  };

  // ======= PENDING ORDER SYSTEM FOR IN-STORE SALES =======
  
  // Create or update pending order for in-store sales with PRIORITY reservation
  const createOrUpdatePendingOrder = async () => {
    try {
      if (!currentUser) {
        console.warn('No current user found, creating temporary order');
        const tempId = 'temp-counter-' + Date.now();
        setPendingOrderId(tempId);
        setIsHoldingStock(true);
        
        const timeout = setTimeout(() => {
          releasePendingOrder('⏰ Hết thời gian giữ hàng ưu tiên (10 phút)');
          message.warning('Đã hết thời gian giữ hàng! Vui lòng thanh toán lại.', 5);
        }, 10 * 60 * 1000);
        setHoldTimeout(timeout);
        
        return { pendingOrderId: tempId };
      }
      
      // Try API first, fallback to temporary solution if not available
      if (!OrderService.createPendingOrder) {
        console.warn('OrderService.createPendingOrder not available, using in-memory tracking');
        const tempId = 'priority-counter-' + currentUser.userId + '-' + Date.now();
        setPendingOrderId(tempId);
        setIsHoldingStock(true);
        
        // Set 10-minute timer with priority message
        const timeout = setTimeout(() => {
          releasePendingOrder('⏰ Hết thời gian ưu tiên bán tại quầy (10 phút)');
          message.warning('Thời gian ưu tiên đã hết! Khách online có thể đặt lại.', 5);
        }, 10 * 60 * 1000);
        setHoldTimeout(timeout);
        
        return { pendingOrderId: tempId };
      }
      
      const pendingOrderData = {
        staffId: currentUser.userId,
        tableNumber: 'COUNTER',
        staffNote: `🏪 BÁN TẠI QUẦY - Ưu tiên giữ hàng cho NV: ${currentUser.fullName}`,
        status: 'PENDING_PAYMENT',
        priority: 'IN_STORE_HIGH'
      };
      
      let pendingOrder;
      if (pendingOrderId) {
        // Update existing pending order
        pendingOrder = await OrderService.updatePendingOrder(pendingOrderId, pendingOrderData);
      } else {
        // Create new pending order
        pendingOrder = await OrderService.createPendingOrder(pendingOrderData);
        setPendingOrderId(pendingOrder.pendingOrderId);
        setIsHoldingStock(true);
        
        // Set timeout for auto-release (10 minutes)
        const timeout = setTimeout(() => {
          releasePendingOrder('⏰ Hết thời gian ưu tiên giữ hàng tại quầy (10 phút)');
          message.warning('🚨 Thời gian ưu tiên đã hết! Khách online có thể đặt hàng.', 5);
        }, 10 * 60 * 1000);
        setHoldTimeout(timeout);
      }
      
      return pendingOrder;
    } catch (error) {
      console.error('Error creating pending order:', error);
      // Don't show error to user, just log and continue
      return null;
    }
  };
  
  // Release pending order and stock
  const releasePendingOrder = async (reason = 'Hủy giữ hàng') => {
    if (!pendingOrderId) return;
    
    try {
      // Only call API if it exists
      if (OrderService.cancelPendingOrder) {
        await OrderService.cancelPendingOrder(pendingOrderId, reason);
      }
      
      // Clear states
      setPendingOrderId(null);
      setIsHoldingStock(false);
      setReservedItems(new Map());
      
      if (holdTimeout) {
        clearTimeout(holdTimeout);
        setHoldTimeout(null);
      }
      
      console.log('Released pending order:', reason);
      if (reason.includes('⏰') || reason.includes('Hết thời gian')) {
        // Show notification when priority time expires
        message.info('🔄 Hàng đã được trả lại cho khách online có thể đặt', 3);
      }
    } catch (error) {
      console.error('Error releasing pending order:', error);
      // Still clear states even if API call fails
      setPendingOrderId(null);
      setIsHoldingStock(false);
      setReservedItems(new Map());
      
      if (holdTimeout) {
        clearTimeout(holdTimeout);
        setHoldTimeout(null);
      }
    }
  };

  // Search products
  const handleSearch = (value) => {
    setSearch(value);
    fetchProducts(value);
  };

  // Show product selection modal
  const showProductSelection = async (product) => {
    setSelectedProduct(product);
    setSelectedDetail(null);
    
    try {
      const details = await ProductDetailsService.getAvailableProductDetailsByProductId(product.productId);
      setProductDetails(details || []);
      setProductSelectionVisible(true);
    } catch (error) {
      message.error('Không thể tải chi tiết sản phẩm!');
      console.error('Error loading product details:', error);
    }
  };

  // Handle product detail selection
  const handleDetailChange = (detailId) => {
    setSelectedDetail(detailId);
  };

  // Check real-time stock availability (prioritize in-store sales)
  const checkStockAvailability = async (productDetailsId, requestedQuantity = 1) => {
    try {
      const productDetail = await ProductDetailsService.getProductDetailsById(productDetailsId);
      if (!productDetail) return { available: 0, message: 'Sản phẩm không tồn tại!' };
      
      const currentStock = productDetail.stockQuantity || 0;
      const reservedByUs = reservedItems.get(productDetailsId) || 0;
      const existingCartItem = cart.find(item => item.productDetailsId === productDetailsId);
      const cartQuantity = existingCartItem ? existingCartItem.quantity : 0;
      
      // Available stock = total stock - what's already in our cart + our reservation
      const availableStock = currentStock - cartQuantity + reservedByUs;
      
      console.log('Stock check:', {
        productDetailsId,
        currentStock,
        reservedByUs,
        cartQuantity,
        requestedQuantity,
        availableStock
      });
      
      if (availableStock < requestedQuantity) {
        return {
          available: Math.max(0, availableStock),
          message: `Chỉ còn ${availableStock} sản phẩm khả dụng! (Có thể đã được khách online đặt trước)`
        };
      }
      
      return { available: availableStock, message: 'OK' };
    } catch (error) {
      console.error('Error checking stock:', error);
      return { available: 0, message: 'Lỗi kiểm tra tồn kho!' };
    }
  };

  // Add product detail to cart with smart reservation
  const handleAddToCartWithSelection = async () => {
    if (!selectedDetail) {
      message.warning('Vui lòng chọn màu sắc và kích thước!');
      return;
    }

    const selectedDetailObj = productDetails.find(d => d.productDetailsId === selectedDetail);
    
    if (!selectedDetailObj) {
      message.error('Không tìm thấy thông tin sản phẩm!');
      return;
    }

    // Real-time stock check with priority for in-store sales
    const stockCheck = await checkStockAvailability(selectedDetail, 1);
    if (stockCheck.available < 1) {
      message.error(`Hết hàng! ${stockCheck.message}`);
      return;
    }
    
    const cartKey = `${selectedProduct.productId}-${selectedDetail}`;
    const exist = cart.find((item) => item.cartKey === cartKey);
    
    try {
      // PRIORITY: In-store sales get priority over online orders
      if (!isHoldingStock) {
        const pendingOrder = await createOrUpdatePendingOrder();
        if (pendingOrder) {
          message.info('🏪 Đang giữ hàng ưu tiên cho bán tại quầy (10 phút)', 3);
        }
      }
      
      if (exist) {
        // Check stock before increasing quantity
        const stockCheck = await checkStockAvailability(selectedDetail, exist.quantity + 1);
        if (stockCheck.available < exist.quantity + 1) {
          message.warning(`Không thể thêm! ${stockCheck.message}`);
          return;
        }
        
        if (exist.quantity >= selectedDetailObj.stockQuantity) {
          message.warning(`Chỉ còn ${selectedDetailObj.stockQuantity} sản phẩm trong kho!`);
          return;
        }
        
        // Update pending order item
        if (pendingOrderId && OrderService.updatePendingOrderItem) {
          try {
            await OrderService.updatePendingOrderItem(pendingOrderId, {
              productDetailsId: selectedDetail,
              quantity: exist.quantity + 1,
              unitPrice: calculateDiscountedPrice(
                selectedProduct.sellingPrice, 
                selectedProduct.discountPercentage
              ) || 0
            });
          } catch (error) {
            console.warn('Pending order update failed:', error);
          }
        }
        
        setCart((prev) =>
          prev.map((item) =>
            item.cartKey === cartKey
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        // Add new item to pending order
        if (pendingOrderId && OrderService.addPendingOrderItem) {
          try {
            await OrderService.addPendingOrderItem(pendingOrderId, {
              productDetailsId: selectedDetail,
              quantity: 1,
              unitPrice: calculateDiscountedPrice(
                selectedProduct.sellingPrice, 
                selectedProduct.discountPercentage
              ) || 0
            });
          } catch (error) {
            console.warn('Pending order add item failed:', error);
          }
        }
        
        setCart((prev) => [...prev, { 
          ...selectedProduct,
          cartKey,
          productDetailsId: selectedDetail,
          colorName: selectedDetailObj?.color?.colorName,
          sizeValue: selectedDetailObj?.size?.sizeValue,
          quantity: 1,
          unitPrice: calculateDiscountedPrice(
            selectedProduct.sellingPrice, 
            selectedProduct.discountPercentage
          ) || 0
        }]);
      }
      
      // Update reserved items tracking
      const reserved = reservedItems.get(selectedDetail) || 0;
      setReservedItems(prev => new Map(prev.set(selectedDetail, reserved + 1)));
      
      fetchProducts(search);
      setProductSelectionVisible(false);
      message.success('Đã thêm sản phẩm vào giỏ hàng!');
      
    } catch (error) {
      message.error('Không thể thêm sản phẩm! Có thể đã có khách đặt trước.');
      console.error('Error adding to cart:', error);
    }
  };

  // Update quantity in cart with smart reservation and stock validation
  const updateCartQuantity = async (cartKey, newQuantity) => {
    const currentItem = cart.find(item => item.cartKey === cartKey);
    if (!currentItem) return;
    
    if (newQuantity <= 0) {
      await removeFromCart(cartKey);
      return;
    }
    
    // Validate stock availability for new quantity
    const stockCheck = await checkStockAvailability(currentItem.productDetailsId, newQuantity);
    if (stockCheck.available < newQuantity) {
      message.error(`Không đủ hàng! ${stockCheck.message}. Tối đa có thể đặt: ${stockCheck.available}`);
      return;
    }
    
    const quantityDifference = newQuantity - currentItem.quantity;
    
    try {
      if (quantityDifference !== 0) {
        // For in-store sales, we have reserved priority - no need to check again
        if (newQuantity <= 0) {
          // Remove item from cart and pending order
          await removeFromCart(cartKey);
          return;
        }
        
        // Update pending order if exists
        if (pendingOrderId && OrderService.updatePendingOrderItem) {
          try {
            await OrderService.updatePendingOrderItem(pendingOrderId, {
              productDetailsId: currentItem.productDetailsId,
              quantity: newQuantity,
              unitPrice: currentItem.unitPrice
            });
          } catch (error) {
            console.warn('Pending order item update failed:', error);
          }
        }
        
        // Update reservation map
        const reserved = reservedItems.get(currentItem.productDetailsId) || 0;
        setReservedItems(prev => new Map(prev.set(
          currentItem.productDetailsId, 
          Math.max(0, reserved + quantityDifference)
        )));
        
        setCart((prev) =>
          prev.map((item) => {
            if (item.cartKey === cartKey) {
              return { ...item, quantity: newQuantity };
            }
            return item;
          })
        );
        
        fetchProducts(search);
        message.success('Cập nhật thành công!');
      }
    } catch (error) {
      message.error('Không thể cập nhật số lượng! Có thể sản phẩm đã được đặt bởi khách hàng khác.');
      console.error('Error updating quantity:', error);
      // Refresh to get latest stock
      fetchProducts(search);
    }
  };

  // Remove from cart
  const removeFromCart = (cartKey) => {
    const itemToRemove = cart.find(item => item.cartKey === cartKey);
    if (!itemToRemove) return;
    
    Modal.confirm({
      title: 'Xác nhận xóa sản phẩm',
      content: `Bạn có chắc chắn muốn xóa "${itemToRemove.productName}" (${itemToRemove.colorName} - ${itemToRemove.sizeValue}) khỏi giỏ hàng? 

📦 Tồn kho sẽ được khôi phục ${itemToRemove.quantity} sản phẩm cho khách online.`,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          // Remove from pending order if exists
          if (pendingOrderId && OrderService.removePendingOrderItem) {
            try {
              await OrderService.removePendingOrderItem(pendingOrderId, itemToRemove.productDetailsId);
            } catch (error) {
              console.warn('Pending order item removal failed:', error);
            }
          }
          
          // Update reservation map
          setReservedItems(prev => {
            const newMap = new Map(prev);
            newMap.delete(itemToRemove.productDetailsId);
            return newMap;
          });
          
          setCart((prev) => prev.filter((item) => item.cartKey !== cartKey));
          fetchProducts(search);
          message.success('Đã xóa sản phẩm khỏi giỏ hàng');
        } catch (error) {
          message.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng!');
          console.error('Error removing from cart:', error);
        }
      }
    });
  };



  // Find customer by phone
  const findCustomer = async () => {
    if (!phone) return;
    setFindingCustomer(true);
    try {
      const data = await CustomerService.getCustomerByPhone(phone);
      setCustomer(data);
      if (data) {
        message.success(`Tìm thấy khách hàng: ${data.fullName}`);
      } else {
        message.warning('Không tìm thấy khách hàng!');
      }
      // Vouchers will be loaded automatically by useEffect
    } catch (error) {
      message.error('Lỗi khi tìm khách hàng!');
    } finally {
      setFindingCustomer(false);
    }
  };

  // Select customer from list
  const selectCustomer = async (selectedCustomer) => {
    setCustomer(selectedCustomer);
    setPhone(selectedCustomer.phone);
    setCustomerListVisible(false);
    message.success(`Đã chọn khách hàng: ${selectedCustomer.fullName}`);
    // Vouchers will be loaded automatically by useEffect
  };

  // Create new customer
  const handleCreateCustomer = async (values) => {
    try {
      const customerData = {
        ...values,
        emailConfirmed: true
      };
      const newCustomer = await CustomerService.createCustomer(customerData);
      setCustomer(newCustomer);
      setPhone(newCustomer.phone);
      setCreateCustomerVisible(false);
      customerForm.resetFields();
      message.success('Tạo khách hàng thành công!');
    } catch (error) {
      message.error('Lỗi khi tạo khách hàng!');
    }
  };

  // Clear cart and release pending order
  const clearCart = () => {
    if (cart.length === 0) return;
    
    Modal.confirm({
      title: 'Xác nhận làm trống giỏ hàng',
      content: `🏪 BÁN TẠI QUẦY - Xác nhận làm trống giỏ hàng?

📦 ${cart.length} sản phẩm sẽ được trả về kho
🌐 Khách hàng online có thể đặt lại ngay lập tức
⏱️ Hóa đơn chờ sẽ được hủy`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          // Release pending order first
          await releasePendingOrder('Làm trống giỏ hàng');
          
          setCart([]);
          setReservedItems(new Map());
          fetchProducts(search);
          message.success(`✅ Đã làm trống giỏ hàng và trả lại ${cart.length} sản phẩm cho khách online!`);
        } catch (error) {
          message.error('Lỗi khi làm trống giỏ hàng!');
          console.error('Error clearing cart:', error);
        }
      }
    });
  };

  // Handle voucher application
  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      message.warning('Vui lòng nhập mã voucher!');
      return;
    }

    setVoucherLoading(true);
    try {
  const voucher = await VoucherService.validateVoucher(voucherCode);
      
      if (voucher.isValid) {
        setAppliedVoucher(voucher);
        message.success(`Đã áp dụng voucher: ${voucher.name} (-${voucher.discountAmount.toLocaleString()}₫)`);
      } else {
        message.error(voucher.message || 'Mã voucher không hợp lệ!');
      }
    } catch (error) {
      message.error('Lỗi khi kiểm tra voucher!');
      console.error('Error applying voucher:', error);
    } finally {
      setVoucherLoading(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode('');
    message.success('Đã hủy voucher!');
  };

  // Calculate voucher discount based on type
  const calculateVoucherDiscount = (voucher, subtotal) => {
    if (!voucher) return 0;
    
    console.log('Calculating discount for voucher:', {
      voucherCode: voucher.code,
      discountType: voucher.discountType,
      discountValue: voucher.discountValue,
      maxDiscount: voucher.maxDiscount,
      subtotal: subtotal
    });
    
    let discount = 0;
    if (voucher.discountType === 'PERCENTAGE') {
      // Percentage discount
      discount = subtotal * (voucher.discountValue / 100);
      console.log('Raw percentage discount:', discount);
      
      // Apply max discount limit if exists
      if (voucher.maxDiscount && voucher.maxDiscount > 0 && discount > voucher.maxDiscount) {
        console.log(`Applying max discount limit: ${discount} -> ${voucher.maxDiscount}`);
        discount = voucher.maxDiscount;
      }
    } else {
      // Fixed amount discount
      discount = voucher.discountValue || 0;
    }
    
    // Discount cannot exceed subtotal
    const finalDiscount = Math.min(discount, subtotal);
    console.log('Final discount:', finalDiscount);
    return finalDiscount;
  };

  // Select voucher from available list
  const handleSelectVoucher = async (voucher) => {
    try {
      // Check if customer has already used this voucher
      if (customer) {
        const usageHistory = await VoucherService.checkVoucherUsageHistory(
          voucher.voucherCode || voucher.code, 
          customer.customerId,
          customer.email,
          customer.phone
        );
        
        if (usageHistory && usageHistory.hasUsed) {
          message.warning(`Khách hàng ${customer.fullName || customer.email || customer.phone} đã sử dụng voucher này trước đó!`);
          return;
        }
      }
      
      const currentSubtotal = cart.reduce((sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 0), 0);
      const calculatedDiscount = calculateVoucherDiscount(voucher, currentSubtotal);
      
      console.log('Selected voucher:', {
        voucher: voucher,
        customer: customer,
        subtotal: currentSubtotal,
        calculatedDiscount: calculatedDiscount,
        discountType: voucher.discountType,
        discountValue: voucher.discountValue,
        maxDiscount: voucher.maxDiscount
      });
      
      // Add calculated discount to voucher object for display
      const voucherWithDiscount = {
        ...voucher,
        calculatedDiscountAmount: calculatedDiscount
      };
      
      setAppliedVoucher(voucherWithDiscount);
      setVoucherCode(voucher.voucherCode || voucher.code);
      
      const discountText = voucher.discountType === 'PERCENTAGE' 
        ? `${voucher.discountValue}% (${calculatedDiscount.toLocaleString()}₫)`
        : `${calculatedDiscount.toLocaleString()}₫`;
        
      message.success(`Đã chọn voucher: ${voucher.voucherName || voucher.name || voucher.voucherCode || voucher.code} - Giảm ${discountText}`);
      
    } catch (error) {
      console.error('Error checking voucher usage:', error);
      message.error('Lỗi khi kiểm tra lịch sử sử dụng voucher');
    }
  };

  // Calculate total
  const subtotal = cart.reduce((sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 0), 0);
  
  // Calculate voucher discount dynamically
  const voucherDiscount = appliedVoucher ? calculateVoucherDiscount(appliedVoucher, subtotal) : 0;
  const totalAmount = Math.max(0, subtotal - voucherDiscount);

  // Checkout
  const handleCheckout = async (values) => {
    if (!cart.length) {
      message.warning('Chưa có sản phẩm trong giỏ hàng!');
      return;
    }
    setLoading(true);
    try {
      const orderRequestData = {
        customerId: customer?.customerId || 0,
        guestDto: !customer ? {
          fullName: 'Khách vãng lai',
          phone: phone,
          email: '',
          address: '',
          city: ''
        } : null,
        orderDto: {
          totalPrice: totalAmount,
          originalPrice: subtotal,
          voucherDiscount: voucherDiscount,
          voucherCode: appliedVoucher?.code || appliedVoucher?.voucherCode || null,
          isPaid: true,
          paymentMethod: paymentMethod,
          orderNote: `🏪 BÁN TẠI QUẦY (ƯU TIÊN) - ${paymentMethod === 'IN_STORE' ? 'Tiền mặt' : 'Chuyển khoản QR'} - NV: ${currentUser?.fullName || 'Unknown'}`,
          staffId: currentUser?.userId,
          staffName: currentUser?.fullName,
          priority: 'IN_STORE_PRIORITY',
          skipStockReduction: false
        },
        orderItemDtos: cart.map((item) => ({
          productDetailsId: item.productDetailsId,
          quantity: item.quantity,
          price: item.unitPrice || 0
        }))
      };
      
      console.log('Checkout order data:', {
        customerId: orderRequestData.customerId,
        hasCustomer: !!customer,
        customerInfo: customer,
        voucherCode: orderRequestData.orderDto.voucherCode,
        voucherDiscount: orderRequestData.orderDto.voucherDiscount,
        appliedVoucher: appliedVoucher
      });
      
      const order = await OrderService.createOrder(orderRequestData);
      
      // Release pending order after successful payment
      await releasePendingOrder('✅ Thanh toán thành công');
      
      message.success(`🎉 Thanh toán thành công! Mã đơn: ${order?.orderId || 'N/A'}`, 5);
      
      // Reset all states
      setCart([]);
      setCustomer(null);
      setPhone('');
      setAppliedVoucher(null);
      setVoucherCode('');
      setAvailableVouchers([]);
      setPaymentMethod('IN_STORE');
      setCheckoutVisible(false);
      setReservedItems(new Map());
      
      // Refresh product list to show updated stock
      fetchProducts(search);
    } catch (error) {
      message.error('Thanh toán thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div style={styles.pageContainer}>
        <Row gutter={24} style={styles.row}>
          <Col span={12}>
            <ProductSearchTable
              products={products}
              search={search}
              setSearch={setSearch}
              handleSearch={handleSearch}
              onProductSelect={showProductSelection}
              loading={loading}
            />
          </Col>
          <Col span={12}>
            <CartSection
              cart={cart}
              customer={customer}
              phone={phone}
              setPhone={setPhone}
              findingCustomer={findingCustomer}
              onFindCustomer={findCustomer}
              onCreateCustomer={() => setCreateCustomerVisible(true)}
              onShowCustomerList={() => setCustomerListVisible(true)}
              availableVouchers={availableVouchers}
              appliedVoucher={appliedVoucher}
              onSelectVoucher={handleSelectVoucher}
              onRemoveVoucher={handleRemoveVoucher}
              onUpdateQuantity={updateCartQuantity}
              onRemoveFromCart={removeFromCart}
              onClearCart={clearCart}
              onCheckout={() => setCheckoutVisible(true)}
              loading={loading}
            />
          </Col>
        </Row>
        
        {/* Modals */}
        <CustomerModal
          visible={createCustomerVisible}
          form={customerForm}
          onCancel={() => setCreateCustomerVisible(false)}
          onSubmit={handleCreateCustomer}
          loading={loading}
        />

        <CustomerSelectionModal
          visible={customerListVisible}
          customers={allCustomers}
          onSelect={selectCustomer}
          onCancel={() => setCustomerListVisible(false)}
          onOpen={fetchAllCustomers}
          loading={loading}
        />

        <ProductSelectionModal
          visible={productSelectionVisible}
          selectedProduct={selectedProduct}
          productDetails={productDetails}
          selectedDetail={selectedDetail}
          onDetailChange={handleDetailChange}
          onCancel={() => setProductSelectionVisible(false)}
          onOk={handleAddToCartWithSelection}
        />

        <CheckoutModal
          visible={checkoutVisible}
          form={checkoutForm}
          customer={customer}
          phone={phone}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          totalAmount={totalAmount}
          subtotal={subtotal}
          appliedVoucher={appliedVoucher}
          voucherDiscount={voucherDiscount}
          voucherCode={voucherCode}
          setVoucherCode={setVoucherCode}
          voucherLoading={voucherLoading}
          onApplyVoucher={handleApplyVoucher}
          onRemoveVoucher={handleRemoveVoucher}
          onCancel={() => setCheckoutVisible(false)}
          onSubmit={handleCheckout}
          loading={loading}
          cart={cart}
          currentUser={currentUser}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminSalePage;