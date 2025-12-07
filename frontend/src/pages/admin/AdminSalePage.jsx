import React, { useEffect, useState } from 'react';
import { message, Modal, Form, Row, Col } from 'antd';
import OrderService from '../../services/admin/OrderService';
import AdminLayout from '../../layouts/AdminLayout';
import ProductService from '../../services/admin/ProductService';
import CustomerService from '../../services/admin/CustomerService';
import ProductColorService from '../../services/admin/ProductColorService';
import ProductSizeService from '../../services/admin/ProductSizeService';
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
  
  // Staff assignment (for online orders)
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [allStaff, setAllStaff] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Modal states
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [createCustomerVisible, setCreateCustomerVisible] = useState(false);
  const [productSelectionVisible, setProductSelectionVisible] = useState(false);
  
  // Product selection states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productColors, setProductColors] = useState([]);
  const [productSizes, setProductSizes] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  
  // Form instances
  const [checkoutForm] = Form.useForm();
  const [customerForm] = Form.useForm();
  
  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('IN_STORE');

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

  // Search products
  const handleSearch = (value) => {
    setSearch(value);
    fetchProducts(value);
  };

  // Show product selection modal
  const showProductSelection = async (product) => {
    setSelectedProduct(product);
    setSelectedColor(null);
    setSelectedSize(null);
    setProductSizes([]);
    
    try {
      const colors = await ProductColorService.getColorsByProductId(product.productId);
      setProductColors(colors);
      setProductSelectionVisible(true);
    } catch (error) {
      message.error('Không thể tải màu sắc sản phẩm!');
    }
  };

  // Handle color selection
  const handleColorChange = async (colorId) => {
    setSelectedColor(colorId);
    setSelectedSize(null);
    
    try {
      const sizes = await ProductSizeService.findByProductColorId(colorId);
      setProductSizes(sizes);
    } catch (error) {
      message.error('Không thể tải size sản phẩm!');
      setProductSizes([]);
    }
  };

  // Add product with color and size to cart
  const handleAddToCartWithSelection = async () => {
    if (!selectedColor || !selectedSize) {
      message.warning('Vui lòng chọn màu sắc và size!');
      return;
    }

    const selectedColorObj = productColors.find(c => c.productColorId === selectedColor);
    const selectedSizeObj = productSizes.find(s => s.productSizeId === selectedSize);
    
    if (!selectedSizeObj || selectedSizeObj.stockQuantity <= 0) {
      message.error('Sản phẩm này đã hết hàng!');
      return;
    }
    
    const cartKey = `${selectedProduct.productId}-${selectedColor}-${selectedSize}`;
    const exist = cart.find((item) => item.cartKey === cartKey);
    
    try {
      if (exist) {
        if (exist.quantity >= selectedSizeObj.stockQuantity) {
          message.warning(`Chỉ còn ${selectedSizeObj.stockQuantity} sản phẩm trong kho!`);
          return;
        }
        
        const newStockQuantity = selectedSizeObj.stockQuantity - 1;
        await ProductSizeService.updateStock(selectedSize, newStockQuantity);
        
        setCart((prev) =>
          prev.map((item) =>
            item.cartKey === cartKey
              ? { ...item, quantity: item.quantity + 1, stockQuantity: newStockQuantity }
              : item
          )
        );
      } else {
        const newStockQuantity = selectedSizeObj.stockQuantity - 1;
        await ProductSizeService.updateStock(selectedSize, newStockQuantity);
        
        setCart((prev) => [...prev, { 
          ...selectedProduct,
          cartKey,
          productColorId: selectedColor,
          productSizeId: selectedSize,
          colorName: selectedColorObj?.colorName,
          sizeValue: selectedSizeObj?.sizeValue,
          stockQuantity: newStockQuantity,
          quantity: 1,
          unitPrice: calculateDiscountedPrice(
            selectedProduct.sellingPrice, 
            selectedProduct.discountPercentage
          ) || 0
        }]);
      }
      
      fetchProducts(search);
      setProductSelectionVisible(false);
      
    } catch (error) {
      message.error('Lỗi khi cập nhật tồn kho! Vui lòng thử lại.');
      console.error('Error adding to cart:', error);
    }
  };

  // Update quantity in cart
  const updateCartQuantity = async (cartKey, newQuantity) => {
    const currentItem = cart.find(item => item.cartKey === cartKey);
    if (!currentItem) return;
    
    const quantityDifference = newQuantity - currentItem.quantity;
    
    try {
      if (quantityDifference !== 0) {
        const newStockQuantity = currentItem.stockQuantity - quantityDifference;
        
        if (newStockQuantity < 0) {
          message.warning(`Không đủ hàng trong kho! Chỉ còn ${currentItem.stockQuantity + currentItem.quantity} sản phẩm.`);
          return;
        }
        
        await ProductSizeService.updateStock(currentItem.productSizeId, newStockQuantity);
        
        setCart((prev) =>
          prev.map((item) => {
            if (item.cartKey === cartKey) {
              return { ...item, quantity: newQuantity, stockQuantity: newStockQuantity };
            }
            return item;
          })
        );
        
        fetchProducts(search);
      }
    } catch (error) {
      message.error('Lỗi khi cập nhật số lượng!');
      console.error('Error updating quantity:', error);
    }
  };

  // Remove from cart
  const removeFromCart = (cartKey) => {
    const itemToRemove = cart.find(item => item.cartKey === cartKey);
    if (!itemToRemove) return;
    
    Modal.confirm({
      title: 'Xác nhận xóa sản phẩm',
      content: `Bạn có chắc chắn muốn xóa "${itemToRemove.productName}" (${itemToRemove.colorName} - ${itemToRemove.sizeValue}) khỏi giỏ hàng? Tồn kho sẽ được khôi phục ${itemToRemove.quantity} sản phẩm.`,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          const newStockQuantity = itemToRemove.stockQuantity + itemToRemove.quantity;
          await ProductSizeService.updateStock(itemToRemove.productSizeId, newStockQuantity);
          
          setCart((prev) => prev.filter((item) => item.cartKey !== cartKey));
          
          fetchProducts(search);
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

  // Clear cart and restore stock
  const clearCart = () => {
    if (cart.length === 0) return;
    
    Modal.confirm({
      title: 'Xác nhận làm trống giỏ hàng',
      content: `Bạn có chắc chắn muốn làm trống giỏ hàng? Tồn kho sẽ được khôi phục cho ${cart.length} sản phẩm.`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          let restoredItems = 0;
          for (const item of cart) {
            const newStockQuantity = item.stockQuantity + item.quantity;
            await ProductSizeService.updateStock(item.productSizeId, newStockQuantity);
            restoredItems++;
          }
          
          setCart([]);
          fetchProducts(search);
          message.success(`Đã làm trống giỏ hàng và khôi phục tồn kho cho ${restoredItems} sản phẩm!`);
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
          orderNote: paymentMethod === 'IN_STORE' ? 'Bán hàng tại quầy - Tiền mặt' : 'Bán hàng tại quầy - Mã QR',
          staffId: currentUser?.userId,
          staffName: currentUser?.fullName,
          skipStockReduction: true
        },
        orderItemDtos: cart.map((item) => ({
          productSizeId: item.productSizeId,
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
      
      await OrderService.createOrder(orderRequestData);
      message.success('Thanh toán thành công!');
      setCart([]);
      setCustomer(null);
      setPhone('');
      setAppliedVoucher(null);
      setVoucherCode('');
      setAvailableVouchers([]);
      setPaymentMethod('IN_STORE');
      setCheckoutVisible(false);
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
          productColors={productColors}
          productSizes={productSizes}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          onColorChange={handleColorChange}
          onSizeChange={setSelectedSize}
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