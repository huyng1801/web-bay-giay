import React, { useEffect, useState, useCallback } from "react";
import {
  Typography,
  Row,
  Col,
  message,
  Steps,
  Spin,
  Form,
  Input,
  Select,
  Alert,
  notification,
} from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  MoneyCollectOutlined,
  WalletOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import CustomerLayout from "../../layouts/CustomerLayout";
import VoucherSelector from "../../components/voucher/VoucherSelector";
import { useNavigate } from "react-router-dom";
import { 
  createOrder, 
  getCustomerByEmail, 
  getCustomerAddresses,
  getAvailableVouchersForCustomer, 
  validateVoucher, 
  getProductById,
  getProductDetailsByProductId,
  getProductImages,
  createVNPayPayment,
  getGHNProvinces,
  getGHNDistricts,
  getGHNWards,
  calculateOptimalShippingFee
} from '../../services/home/HomeService';
import { formatPrice } from "../../utils/formatters";
import { jwtDecode } from "jwt-decode";

// API Error handling utility
const handleApiError = (error, defaultMessage = "Có lỗi xảy ra") => {
  console.error(error);
  const errorMessage = error?.response?.data?.message || error?.message || defaultMessage;
  message.error(errorMessage);
  return errorMessage;
};

const { Title, Text } = Typography;

const styles = {
  // Main wrapper
  container: {
    padding: '48px 0',
    minHeight: '100vh',
  },

  // Page Header
  pageHeader: {
    marginBottom: '48px',
    textAlign: 'center',
  },

  pageTitle: {
    fontSize: '42px',
    fontWeight: '800',
    color: '#222',
    marginBottom: '12px',
    letterSpacing: '-0.5px',
    textTransform: 'uppercase',
  },

  pageTitleUnderline: {
    height: '3px',
    width: '80px',
    background: '#ff6b35',
    margin: '0 auto 24px',
    borderRadius: '2px',
  },

  // Steps
  steps: {
    marginBottom: '48px',
    background: '#fff',
    padding: '24px',
    borderRadius: '14px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    border: '1px solid #eaeaea',
  },

  // Form Section
  formCard: {
    background: '#fff',
    borderRadius: '14px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
    border: '1px solid #eaeaea',
    padding: '32px 24px',
  },

  formTitle: {
    fontSize: '24px',
    fontWeight: '800',
    marginBottom: '32px',
    color: '#222',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '2px solid #ff6b35',
    paddingBottom: '12px',
    display: 'inline-block',
  },

  formSectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '16px',
    marginTop: '24px',
    color: '#222',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  formItem: {
    marginBottom: '20px',
  },

  formLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#222',
    marginBottom: '8px',
    display: 'block',
  },

  input: {
    height: '44px',
    borderRadius: '8px',
    border: '1.5px solid #eaeaea',
    fontSize: '15px',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
  },

  inputFocus: {
    borderColor: '#ff6b35',
    boxShadow: '0 0 0 3px rgba(255, 107, 53, 0.1)',
  },

  textArea: {
    borderRadius: '8px',
    border: '1.5px solid #eaeaea',
    fontSize: '14px',
    padding: '10px 12px',
    fontFamily: 'inherit',
  },

  textAreaFocus: {
    borderColor: '#ff6b35',
    boxShadow: '0 0 0 3px rgba(255, 107, 53, 0.1)',
  },

  select: {
    height: '44px',
    borderRadius: '8px',
    border: '1.5px solid #eaeaea !important',
  },

  // Summary Card
  summaryCard: {
    background: '#fff',
    borderRadius: '14px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
    border: '1px solid #eaeaea',
    padding: '28px 24px',
    position: 'sticky',
    top: '100px',
  },

  summaryTitle: {
    fontSize: '20px',
    fontWeight: '800',
    marginBottom: '24px',
    color: '#222',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '2px solid #ff6b35',
    paddingBottom: '12px',
    display: 'inline-block',
  },

  // Order items


  orderItem: {
    marginBottom: '16px',
    padding: '16px',
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
    border: '1px solid #f0f0f0',
  },

  orderItemLast: {
    marginBottom: 0,
  },

  itemImage: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '8px',
    background: '#f8f9fa',
  },

  itemName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#222',
    marginBottom: '8px',
    lineHeight: '1.3',
  },

  itemDetails: {
    color: '#666',
    fontSize: '14px',
    marginBottom: '4px',
  },

  itemLabel: {
    fontWeight: '600',
    color: '#222',
  },

  itemValue: {
    color: '#999',
  },

  // Price breakdown
  priceBreakdown: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    fontSize: '14px',
    padding: '12px 0',
    borderBottom: '1px solid #eaeaea',
  },

  priceLabel: {
    color: '#666',
    fontWeight: '500',
  },

  priceValue: {
    color: '#222',
    fontWeight: '600',
  },

  shippingFeeValue: {
    color: '#ff6b35',
    fontWeight: '600',
  },

  discountValue: {
    color: '#27ae60',
    fontWeight: '600',
  },

  totalBreakdown: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '18px',
    fontWeight: '700',
    padding: '16px 0',
    marginTop: '12px',
    borderTop: '2px solid #eaeaea',
  },

  totalLabel: {
    color: '#222',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  totalValue: {
    color: '#ff6b35',
    fontSize: '24px',
    letterSpacing: '-0.5px',
  },

  // Shipping methods
  shippingMethodsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
  },

  shippingMethod: {
    padding: '16px',
    borderRadius: '10px',
    border: '1.5px solid #eaeaea',
    background: '#fff',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  shippingMethodHover: {
    borderColor: '#ff6b35',
    background: '#fff9f6',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },

  shippingMethodSelected: {
    borderColor: '#ff6b35',
    background: '#fff9f6',
    boxShadow: '0 4px 16px rgba(255, 107, 53, 0.15)',
  },

  shippingMethodInfo: {
    flex: 1,
  },

  shippingMethodName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#222',
    marginBottom: '4px',
  },

  shippingMethodDelivery: {
    fontSize: '13px',
    color: '#666',
  },

  shippingMethodFee: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#ff6b35',
    textAlign: 'right',
  },

  // Payment methods
  paymentMethodContainer: {
    marginBottom: '20px',
  },

  paymentOption: {
    padding: '16px',
    marginBottom: '12px',
    borderRadius: '10px',
    border: '1.5px solid #eaeaea',
    background: '#fff',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  paymentOptionHover: {
    borderColor: '#ff6b35',
    background: '#fff9f6',
    transform: 'translateY(-2px)',
  },

  paymentOptionSelected: {
    borderColor: '#ff6b35',
    background: '#fff9f6',
    boxShadow: '0 4px 16px rgba(255, 107, 53, 0.15)',
  },

  paymentOptionIcon: {
    fontSize: '20px',
    color: '#ff6b35',
  },

  paymentOptionText: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#222',
  },

  // Buttons
  submitButton: {
    width: '100%',
    height: '48px',
    fontSize: '15px',
    fontWeight: '700',
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '999px',
    marginTop: '24px',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.20)',
    letterSpacing: '0.3px',
  },

  submitButtonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.30)',
    opacity: 0.95,
  },

  note: {
    fontSize: '13px',
    color: '#999',
    fontStyle: 'italic',
    marginTop: '12px',
    display: 'block',
  },

  // Loading
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '600px',
  },

};

const CheckoutPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  
  // Order data
  const [orderItems, setOrderItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [productDetails, setProductDetails] = useState({});
  const [imageErrors, setImageErrors] = useState({});
  
  // User authentication
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [customerAddresses, setCustomerAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  
  // Payment & Shipping
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [shippingFee, setShippingFee] = useState(0);
  
  // GHN Shipping data
  const [ghnProvinces, setGhnProvinces] = useState([]);
  const [ghnDistricts, setGhnDistricts] = useState([]);
  const [ghnWards, setGhnWards] = useState([]);
  const [ghnServices, setGhnServices] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  
  // Error states
  const [apiError, setApiError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleImageError = (productId) => {
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  // Load customer data with error handling
  const loadCustomerData = useCallback(async () => {
    const token = localStorage.getItem("jwt");
    if (!token) return;
    
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // Check if token is expired
      if (decodedToken.exp < currentTime) {
        message.warning("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        localStorage.removeItem("jwt");
        return;
      }
      
      setIsLoggedIn(true);
      
      // Fetch customer details by email with retry mechanism
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        try {
          const customerData = await getCustomerByEmail(decodedToken.sub);
          if (customerData) {
            setCustomerId(customerData.customerId);
            setCustomerData(customerData);
            form.setFieldsValue({
              fullName: customerData.fullName,
              email: customerData.email,
              phone: customerData.phone,
              address: customerData.address,
            });

            // Load customer addresses from database
            try {
              const addresses = await getCustomerAddresses(customerData.customerId);
              if (addresses && addresses.length > 0) {
                console.log("Customer addresses:", addresses);
                setCustomerAddresses(addresses);
                
                // Set default address as selected
                const defaultAddr = addresses.find(addr => addr.isDefault) || addresses[0];
                setSelectedAddress(defaultAddr);
                
                if (defaultAddr) {
                  // Set GHN fields from selected address
                  form.setFieldsValue({
                    provinceId: defaultAddr.ghnProvinceId,
                    districtId: defaultAddr.ghnDistrictId,
                    wardCode: defaultAddr.ghnWardCode,
                    address: defaultAddr.address,
                  });
                  // Set selected values for state
                  setSelectedProvince(defaultAddr.ghnProvinceId);
                  setSelectedDistrict(defaultAddr.ghnDistrictId);
                  setSelectedWard(defaultAddr.ghnWardCode);
                  
                  // Load districts and wards for the default address
                  try {
                    if (defaultAddr.ghnProvinceId) {
                      const districts = await getGHNDistricts(defaultAddr.ghnProvinceId);
                      setGhnDistricts(districts);
                    }
                    if (defaultAddr.ghnDistrictId) {
                      const wards = await getGHNWards(defaultAddr.ghnDistrictId);
                      setGhnWards(wards);
                      
                      // Tính phí vận chuyển với địa chỉ mặc định
                      await loadShippingMethods(defaultAddr.ghnDistrictId, defaultAddr.ghnWardCode);
                    }
                  } catch (ghnErr) {
                    console.warn("Could not load GHN data for default address:", ghnErr);
                  }
                }
              }
            } catch (addrErr) {
              console.warn("Could not load customer addresses:", addrErr);
              // Don't fail if addresses can't be loaded
            }
          }
          break; // Success, exit retry loop
        } catch (err) {
          attempts++;
          if (attempts === maxAttempts) {
            handleApiError(err, "Không thể tải thông tin khách hàng");
            setApiError("Không thể tải thông tin khách hàng. Vui lòng thử lại.");
          } else {
            console.warn(`Retry attempt ${attempts} for customer data`);
            await new Promise(resolve => setTimeout(resolve, 1000 * attempts)); // Exponential backoff
          }
        }
      }
    } catch (err) {
      handleApiError(err, "Lỗi xác thực người dùng");
      localStorage.removeItem("jwt");
      setIsLoggedIn(false);
    }
  }, [form]);
  
  // Load GHN provinces on component mount
  const loadGHNProvinces = useCallback(async () => {
    try {
      const provinces = await getGHNProvinces();
      setGhnProvinces(provinces);
    } catch (error) {
      console.error("Error loading GHN provinces:", error);
      message.warning("Không thể tải danh sách tỉnh/thành phố");
    }
  }, []);
  
  // Load product details with comprehensive error handling
  const loadProductDetails = useCallback(async (cartItems) => {
    setLoadingProducts(true);
    const details = {};
    const errors = [];
    
    try {
      const productPromises = cartItems.map(async (item) => {
        try {
          const [product, productDetailsArray, productImages] = await Promise.allSettled([
            getProductById(item.productId),
            getProductDetailsByProductId(item.productId),
            getProductImages(item.productId)
          ]);
          
          const productData = product.status === 'fulfilled' ? product.value : null;
          const productDetailsData = productDetailsArray.status === 'fulfilled' ? productDetailsArray.value : [];
          const productImagesData = productImages.status === 'fulfilled' ? productImages.value : [];
          
          // Find the specific product detail by productDetailsId (new structure)
          // Fallback to finding by colorId and sizeId (old structure)
          const selectedDetail = item.productDetailsId
            ? productDetailsData.find(detail => detail.productDetailsId === item.productDetailsId)
            : productDetailsData.find(detail => 
                detail.color?.colorId === item.colorId && detail.size?.sizeId === item.sizeId
              );
          
          if (!selectedDetail && productDetailsData.length > 0) {
            // If still not found, log warning and use first detail as fallback
            console.warn(`Could not find detail for item:`, item);
            console.warn(`Available details:`, productDetailsData.map(d => ({
              productDetailsId: d.productDetailsId,
              colorId: d.color?.colorId,
              sizeId: d.size?.sizeId,
              stockQuantity: d.stockQuantity
            })));
          }
          
          // Get main image or first image from product images
          let imageUrl = productData?.mainImageUrl || "/placeholder-image.jpg";
          if (productImagesData && productImagesData.length > 0) {
            const mainImage = productImagesData.find(img => img.isMainImage);
            imageUrl = mainImage?.imageUrl || productImagesData[0]?.imageUrl || "/placeholder-image.jpg";
          }
          
          if (productData) {
            // If selectedDetail not found, use cart item quantity as a fallback indicator
            const stock = selectedDetail?.stockQuantity || 0;
            const isAvailable = stock > 0;
            
            if (!selectedDetail && item.productDetailsId) {
              // Missing product detail - this is a critical issue
              console.error(`Missing product detail ${item.productDetailsId} for product ${item.productId}`);
              errors.push(`Chi tiết sản phẩm không tìm thấy: ${item.productName}`);
            }
            
            details[item.productId] = {
              ...productData,
              productDetailsId: item.productDetailsId,
              colorName: selectedDetail?.color?.colorName || 
                        selectedDetail?.color?.tenMau || 
                        item.colorName || 
                        "Không xác định",
              sizeValue: selectedDetail?.size?.sizeValue || 
                        selectedDetail?.size?.giaTri || 
                        item.sizeValue || 
                        "Không xác định",
              imageUrl: imageUrl,
              stock: stock,
              isAvailable: isAvailable,
            };
          } else {
            errors.push(`Không thể tải sản phẩm: ${item.productName || item.productId}`);
            // Fallback data
            details[item.productId] = {
              productName: item.productName || "Sản phẩm không xác định",
              productDetailsId: item.productDetailsId,
              colorName: item.colorName || "Không xác định",
              sizeValue: item.sizeValue || "Không xác định", 
              imageUrl: item.imageUrl || "/placeholder-image.jpg",
              stock: 0,
              isAvailable: false,
            };
          }
        } catch (error) {
          console.error(`Error fetching details for product ${item.productId}:`, error);
          errors.push(`Lỗi tải sản phẩm: ${item.productName || item.productId}`);
          // Fallback data
          details[item.productId] = {
            productName: item.productName || "Sản phẩm không xác định",
            colorName: item.colorName || "Không xác định",
            sizeValue: item.sizeValue || "Không xác định", 
            imageUrl: item.imageUrl || "/placeholder-image.jpg",
            stock: 0,
            isAvailable: false,
          };
        }
      });
      
      await Promise.all(productPromises);
      
      if (errors.length > 0) {
        notification.warning({
          message: "Một số sản phẩm không thể tải đầy đủ thông tin",
          description: errors.slice(0, 3).join(", ") + (errors.length > 3 ? "..." : ""),
          duration: 5,
        });
      }
      
      setProductDetails(details);
    } catch (error) {
      handleApiError(error, "Không thể tải thông tin sản phẩm");
      setApiError("Không thể tải thông tin sản phẩm. Vui lòng thử lại.");
    } finally {
      setLoadingProducts(false);
    }
  }, []);
  
  // Load shipping methods using GHN API
  const loadShippingMethods = useCallback(async (districtId = null, wardCode = null) => {
    if (!districtId || !wardCode) {
      // Không load shipping methods nếu chưa chọn district/ward
      setShippingMethods([]);
      return;
    }
    
    setLoadingShipping(true);
    
    try {
      // Calculate total weight: 1kg per pair of shoes
      let totalWeight = orderItems.reduce((sum, item) => sum + (1000 * item.quantity), 0);
      
      // Ensure minimum weight of 1000g (GHN requirement)
      if (totalWeight === 0 || totalWeight < 1000) {
        totalWeight = 1000;
      }
      
      console.log('Weight calculation:', { 
        orderItems: orderItems.map(item => ({ quantity: item.quantity })), 
        totalWeight 
      });
      
      // Calculate optimal shipping fee using new API
      try {
        const shippingResult = await calculateOptimalShippingFee({
          toDistrictId: districtId,
          toWardCode: wardCode,
          orderValue: totalPrice,
          weight: totalWeight // Dynamic weight: 1kg per shoe pair (minimum 1000g)
        });
        
        console.log('Shipping result:', shippingResult);
        
        if (shippingResult && shippingResult.success) {
          const shippingOption = {
            shippingId: shippingResult.serviceId,
            shippingName: shippingResult.serviceName,
            shippingFee: shippingResult.shippingFee,
            deliveryTime: shippingResult.estimatedTime,
            estimatedDays: shippingResult.estimatedTime,
            isGHN: true,
            ghnServiceId: shippingResult.serviceId,
            ghnData: {
              districtId,
              wardCode,
              leadtime: shippingResult.leadtime || 0
            }
          };
          
          setShippingMethods([shippingOption]); // Only one option now
          setSelectedShipping(shippingOption);
          setShippingFee(shippingOption.shippingFee);
        } else {
          const errorMessage = (shippingResult && shippingResult.message) 
            ? shippingResult.message 
            : "Không thể tính phí vận chuyển cho khu vực này. Vui lòng chọn địa chỉ khác.";
          message.warning(errorMessage);
          setShippingMethods([]);
          setSelectedShipping(null);
          setShippingFee(0);
        }
      } catch (error) {
        console.error('Error calculating optimal shipping fee:', error);
        message.warning("Không thể tính phí vận chuyển cho khu vực này. Vui lòng chọn địa chỉ khác.");
        setShippingMethods([]);
        setSelectedShipping(null);
        setShippingFee(0);
      }
      
    } catch (error) {
      handleApiError(error, "Không thể tính phí vận chuyển");
      setShippingMethods([]);
      setSelectedShipping(null);
      setShippingFee(0);
    } finally {
      setLoadingShipping(false);
    }
  }, [totalPrice, form]);
  
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setApiError(null);
      
      try {
        // Check if this is a "Buy Now" checkout or regular cart checkout
        const urlParams = new URLSearchParams(window.location.search);
        const isBuyNow = urlParams.get("buyNow") === "true";

        let cart = [];

        if (isBuyNow) {
          // Get buy now item from localStorage
          const buyNowItem = JSON.parse(localStorage.getItem("buyNowItem"));
          if (!buyNowItem) {
            message.warning("Không tìm thấy sản phẩm để mua");
            navigate("/");
            return;
          }
          cart = [buyNowItem];
        } else {
          // Get regular cart items
          cart = JSON.parse(localStorage.getItem("cart")) || [];
          if (cart.length === 0) {
            message.warning("Giỏ hàng của bạn đang trống");
            navigate("/cart");
            return;
          }
        }
        
        setOrderItems(cart);
        
        // Calculate total price
        const total = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
        setTotalPrice(total);
        
        // Load data concurrently
        // Note: loadShippingMethods() will be called when user selects a ward
        await Promise.all([
          loadCustomerData(),
          loadProductDetails(cart),
          loadGHNProvinces(),
        ]);
        
      } catch (error) {
        handleApiError(error, "Không thể tải thông tin đơn hàng");
        setApiError("Không thể tải thông tin đơn hàng. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

  }, [navigate, loadCustomerData, loadProductDetails, loadShippingMethods, loadGHNProvinces]);
  
  // Retry mechanism for API errors
  const retryLoadData = useCallback(() => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      setApiError(null);
      window.location.reload();
    } else {
      message.error("Đã thử lại nhiều lần. Vui lòng kiểm tra kết nối mạng và tải lại trang.");
    }
  }, [retryCount]);

  const handleVoucherApplied = (voucher, discountAmount) => {
    setAppliedVoucher(voucher);
    setVoucherDiscount(discountAmount);
  };

  const onFinish = async (values) => {
    // Validation before submit
    if (!selectedShipping) {
      message.error("Vui lòng chọn phương thức vận chuyển!");
      return;
    }
    
    if (orderItems.length === 0) {
      message.error("Giỏ hàng trống!");
      return;
    }
    
    // Check product availability
    const unavailableProducts = orderItems.filter(item => {
      const details = productDetails[item.productId];
      return details && (!details.isAvailable || details.stock < item.quantity);
    });
    
    if (unavailableProducts.length > 0) {
      const productNames = unavailableProducts.map(item => 
        productDetails[item.productId]?.productName || "Sản phẩm không xác định"
      ).join(", ");
      message.error(`Các sản phẩm sau không còn đủ hàng: ${productNames}`);
      return;
    }
    
    setSubmitting(true);
    
    try {
      const finalTotal = totalPrice + shippingFee - voucherDiscount;
      
      // Validate total amount
      if (finalTotal <= 0) {
        message.error("Tổng số tiền không hợp lệ!");
        return;
      }
      
      const orderData = {
        ...(isLoggedIn
          ? { customerId }
          : {
              guestDto: {
                fullName: values.fullName?.trim(),
                email: values.email?.trim().toLowerCase(),
                phone: values.phone?.trim(),
                address: values.address?.trim(),
              },
            }),
        orderDto: {
          totalPrice: finalTotal,
          originalPrice: totalPrice,
          voucherDiscount: voucherDiscount,
          voucherCode: appliedVoucher?.code || null,
          isPaid: paymentMethod === "vnpay",
          orderNote: values.orderNote?.trim() || null,
          shippingId: selectedShipping.shippingId,
          shippingFee: shippingFee,
          paymentMethod: paymentMethod === 'cod' ? 'CASH_ON_DELIVERY' : paymentMethod,
        },
        orderItemDtos: orderItems.map((item) => {
          if (!item.productDetailsId || !item.quantity || !item.unitPrice) {
            throw new Error(`Thông tin sản phẩm không hợp lệ: ${productDetails[item.productId]?.productName}`);
          }
          return {
            productDetailsId: item.productDetailsId,
            quantity: item.quantity,
            price: item.unitPrice,
          };
        }),
      };
      
      // Validate order data
      if (!orderData.orderDto.shippingId) {
        throw new Error("Thông tin vận chuyển không hợp lệ");
      }
      
      if (orderData.orderItemDtos.length === 0) {
        throw new Error("Đơn hàng không có sản phẩm nào");
      }
      
      // Show loading notification
      const loadingKey = 'order-creating';
      notification.open({
        key: loadingKey,
        message: 'Đang xử lý đơn hàng...',
        description: 'Vui lòng đợi trong giây lát',
        icon: <Spin />,
        duration: 0,
      });
      
      const orderResponse = await createOrder(orderData);
      
      // Close loading notification
      // notification.close(loadingKey);
      
      if (!orderResponse?.orderId) {
        throw new Error("Phản hồi từ server không hợp lệ");
      }

      if (paymentMethod === "vnpay") {
        try {
          // Store order details temporarily for VNPay return handling
          localStorage.setItem(
            "pendingOrder",
            JSON.stringify({
              orderId: orderResponse.orderId,
              totalPrice: finalTotal,
              timestamp: Date.now(),
            })
          );

          // Create VNPay payment URL and redirect
          const paymentUrl = await createVNPayPayment(
            orderResponse.orderId,
            finalTotal
          );
          
          if (!paymentUrl) {
            throw new Error("Không thể tạo liên kết thanh toán VNPay");
          }
          
          notification.success({
            message: 'Đơn hàng đã được tạo!',
            description: 'Đang chuyển hướng đến trang thanh toán VNPay...',
            duration: 2,
          });
          
          // Delay redirect to show success message
          setTimeout(() => {
            window.location.href = paymentUrl;
          }, 1000);
          
        } catch (paymentError) {
          handleApiError(paymentError, "Không thể tạo thanh toán VNPay");
          // Still navigate to success page as order was created
          navigate("/success", {
            state: {
              orderData: {
                orderId: orderResponse.orderId,
                ...orderData,
                paymentError: true,
              },
            },
          });
        }
      } else {
        // COD payment - order completed
        notification.success({
          message: "Đặt hàng thành công!",
          description: "Đơn hàng của bạn đã được xác nhận. Chúng tôi sẽ liên hệ với bạn sớm nhất.",
          duration: 4,
        });

        // Clear cart or buyNowItem based on checkout type
        const urlParams = new URLSearchParams(window.location.search);
        const isBuyNow = urlParams.get("buyNow") === "true";

        if (isBuyNow) {
          localStorage.removeItem("buyNowItem");
        } else {
          localStorage.removeItem("cart");
        }

        navigate("/success", {
          state: {
            orderData: {
              orderId: orderResponse.orderId,
              ...orderData,
            },
          },
        });
      }
    } catch (error) {
      // notification.close('order-creating');
      handleApiError(error, "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
      
      // Log detailed error for debugging
      console.error("Detailed order creation error:", {
        error,
        orderData: orderItems,
        customerData: isLoggedIn ? { customerId } : values,
        shipping: selectedShipping,
        voucher: appliedVoucher,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Auto-select first shipping method if none is selected
  useEffect(() => {
    const autoSelectShipping = () => {
      if (shippingMethods.length > 0 && !selectedShipping) {
        setSelectedShipping(shippingMethods[0]);
        setShippingFee(shippingMethods[0].shippingFee);
        // Set form value for validation
        form.setFieldValue('shippingMethod', shippingMethods[0].shippingId);
      }
    };

    // Check immediately
    autoSelectShipping();

    // Set interval to check every 500ms
    const interval = setInterval(autoSelectShipping, 500);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [shippingMethods, selectedShipping, form]);

  if (loading) {
    return (
      <CustomerLayout>
        <div style={styles.loadingContainer}>
          <Spin size="large" tip="Đang tải thông tin đơn hàng..." />
          {loadingProducts && (
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <Text type="secondary">Đang tải thông tin sản phẩm...</Text>
            </div>
          )}
        </div>
      </CustomerLayout>
    );
  }
  
  if (apiError) {
    return (
      <CustomerLayout>
        <div style={{ padding: '48px 0', textAlign: 'center' }}>
          <Alert
            message="Có lỗi xảy ra"
            description={apiError}
            type="error"
            showIcon
            action={
              <button
                onClick={retryLoadData}
                style={{
                  background: '#ff6b35',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Thử lại {retryCount > 0 && `(${retryCount}/3)`}
              </button>
            }
          />
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div style={styles.container}>

          {/* Page Header */}
          <div style={styles.pageHeader}>
            <Title level={1} style={styles.pageTitle}>Thanh Toán</Title>
            <div style={styles.pageTitleUnderline}></div>
          </div>

          {/* Steps */}
          <div style={styles.steps}>
            <Steps
              items={[
                {
                  title: "Giỏ hàng",
                  status: "finish",
                  icon: <ShoppingOutlined />,
                },
                {
                  title: "Vận chuyển",
                  status: "process",
                  icon: <UserOutlined />,
                },
                {
                  title: "Hoàn tất",
                  status: "wait",
                  icon: <CheckCircleOutlined />,
                },
              ]}
            />
          </div>

          <Row gutter={[32, 32]}>
            {/* Form Section */}
            <Col xs={24} lg={16}>
              <div style={styles.formCard}>
                <Title level={3} style={styles.formTitle}>
                  Thông Tin Đặt Hàng
                </Title>
                <Form 
                  form={form} 
                  layout="vertical" 
                  onFinish={onFinish}
                  initialValues={{
                    paymentMethod: "cod"
                  }}
                >
                  {/* Customer Info */}
                  <div style={{ marginBottom: '32px' }}>
                    <Text style={styles.formSectionTitle}>Thông Tin Cá Nhân</Text>
                    <Row gutter={16}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          label="Họ và tên"
                          name="fullName"
                          rules={[
                            { required: true, message: "Vui lòng nhập họ tên!" },
                          ]}
                        >
                          <Input
                            size="large"
                            style={styles.input}
                            disabled={isLoggedIn}
                            readOnly={isLoggedIn}
                            onFocus={(e) => {
                              if (!isLoggedIn) {
                                e.target.style.borderColor = '#ff6b35';
                                e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.1)';
                              }
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#eaeaea';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          label="Email"
                          name="email"
                          rules={[
                            { required: true, message: "Vui lòng nhập email!" },
                            { type: "email", message: "Email không hợp lệ!" },
                          ]}
                        >
                          <Input
                            size="large"
                            style={styles.input}
                            disabled={isLoggedIn}
                            readOnly={isLoggedIn}
                            onFocus={(e) => {
                              if (!isLoggedIn) {
                                e.target.style.borderColor = '#ff6b35';
                                e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.1)';
                              }
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#eaeaea';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    {!isLoggedIn && (
                      <Row gutter={16}>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label="Số điện thoại"
                            name="phone"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập số điện thoại!",
                              },
                            ]}
                          >
                            <Input
                              size="large"
                              style={styles.input}
                              onFocus={(e) => {
                                e.target.style.borderColor = '#ff6b35';
                                e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.1)';
                              }}
                              onBlur={(e) => {
                                e.target.style.borderColor = '#eaeaea';
                                e.target.style.boxShadow = 'none';
                              }}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label="Tỉnh / Thành phố"
                            name="province"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng chọn tỉnh/thành phố!",
                              },
                            ]}
                          >
                            <Select
                              size="large"
                              placeholder="Chọn tỉnh/thành phố"
                              showSearch
                              optionFilterProp="label"
                              filterOption={(input, option) =>
                                (option?.label ?? "")
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              }
                              options={ghnProvinces.map(province => ({
                                value: province.ProvinceID,
                                label: province.ProvinceName,
                              }))}
                              style={{ ...styles.select }}
                              onChange={async (selectedProvinceId) => {
                                if (!selectedProvinceId) return;
                                
                                const province = ghnProvinces.find(p => p.ProvinceID === selectedProvinceId);
                                setSelectedProvince(province);
                                
                                // Reset dependent fields
                                setSelectedDistrict(null);
                                setSelectedWard(null);
                                setGhnDistricts([]);
                                setGhnWards([]);
                                form.setFieldsValue({ district: undefined, ward: undefined });
                                
                                // Load districts
                                try {
                                  const districts = await getGHNDistricts(selectedProvinceId);
                                  setGhnDistricts(districts);
                                } catch (error) {
                                  handleApiError(error, "Không thể tải danh sách quận/huyện");
                                }
                              }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    )}

                    {!isLoggedIn && (
                      <Row gutter={16}>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label="Quận / Huyện"
                            name="district"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng chọn quận/huyện!",
                              },
                            ]}
                          >
                            <Select
                              size="large"
                              placeholder="Chọn quận/huyện"
                              showSearch
                              optionFilterProp="label"
                              filterOption={(input, option) =>
                                (option?.label ?? "")
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              }
                              options={ghnDistricts.map(district => ({
                                value: district.DistrictID,
                                label: district.DistrictName,
                              }))}
                              disabled={ghnDistricts.length === 0}
                              style={{ ...styles.select }}
                              onChange={async (selectedDistrictId) => {
                                if (!selectedDistrictId) return;
                                
                                const district = ghnDistricts.find(d => d.DistrictID === selectedDistrictId);
                                setSelectedDistrict(district);
                                
                                // Reset dependent fields
                                setSelectedWard(null);
                                setGhnWards([]);
                                form.setFieldsValue({ ward: undefined });
                                
                                // Load wards
                                try {
                                  const wards = await getGHNWards(selectedDistrictId);
                                  setGhnWards(wards);
                                } catch (error) {
                                  handleApiError(error, "Không thể tải danh sách phường/xã");
                                }
                              }}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            label="Phường / Xã"
                            name="ward"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng chọn phường/xã!",
                              },
                            ]}
                          >
                            <Select
                              size="large"
                              placeholder="Chọn phường/xã"
                              showSearch
                              optionFilterProp="label"
                              filterOption={(input, option) =>
                                (option?.label ?? "")
                                  .toLowerCase()
                                  .includes(input.toLowerCase())
                              }
                              options={ghnWards.map(ward => ({
                                value: ward.WardCode,
                                label: ward.WardName,
                              }))}
                              disabled={ghnWards.length === 0}
                              style={{ ...styles.select }}
                              onChange={async (selectedWardCode) => {
                                if (!selectedWardCode || !selectedDistrict) return;
                                
                                const ward = ghnWards.find(w => w.WardCode === selectedWardCode);
                                setSelectedWard(ward);
                                
                              // Calculate shipping fee
                              await loadShippingMethods(selectedDistrict.DistrictID, selectedWardCode);
                            }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    )}

                    {isLoggedIn && customerAddresses.length > 0 && (
                      <>
                        <Form.Item
                          label="Chọn địa chỉ đã lưu"
                          style={{ marginBottom: '20px' }}
                        >
                          <Select
                            size="large"
                            style={styles.select}
                            placeholder="Chọn địa chỉ giao hàng"
                            value={selectedAddress?.addressId}
                            onChange={async (value) => {
                              const address = customerAddresses.find(addr => addr.addressId === value);
                              if (address) {
                                console.log("Selected address:", address);
                                setSelectedAddress(address);
                                form.setFieldsValue({
                                  address: address.address,
                                  provinceId: address.ghnProvinceId,
                                  districtId: address.ghnDistrictId,
                                  wardCode: address.ghnWardCode,
                                });
                                setSelectedProvince(address.ghnProvinceId);
                                setSelectedDistrict(address.ghnDistrictId);
                                setSelectedWard(address.ghnWardCode);

                                // Load districts for the selected province
                                if (address.ghnProvinceId) {
                                  try {
                                    console.log("Loading districts for province:", address.ghnProvinceId);
                                    const districts = await getGHNDistricts(address.ghnProvinceId);
                                    console.log("Loaded districts:", districts);
                                    setGhnDistricts(districts);
                                  } catch (error) {
                                    console.error("Error loading districts for address:", error);
                                    message.error("Không thể tải danh sách quận/huyện");
                                  }
                                }
                                // Load wards for the selected district
                                if (address.ghnDistrictId) {
                                  try {
                                    console.log("Loading wards for district:", address.ghnDistrictId);
                                    const wards = await getGHNWards(address.ghnDistrictId);
                                    console.log("Loaded wards:", wards);
                                    setGhnWards(wards);
                                    
                                    // Tính lại phí vận chuyển với địa chỉ mới
                                    console.log("Calculating shipping for:", address.ghnDistrictId, address.ghnWardCode);
                                    await loadShippingMethods(address.ghnDistrictId, address.ghnWardCode);
                                  } catch (error) {
                                    console.error("Error loading wards/shipping for address:", error);
                                    message.error("Không thể tải thông tin vận chuyển cho địa chỉ này");
                                  }
                                }
                              }
                            }}
                          >
                            {customerAddresses.map((address) => (
                              <Select.Option key={address.addressId} value={address.addressId}>
                                <div style={{ lineHeight: 1.4 }}>
                                  <div style={{ fontWeight: 'bold', color: '#222' }}>
                                    {address.addressType === 'HOME' ? '🏠 Nhà riêng' : '🏢 Văn phòng'}
                                    {address.isDefault && <span style={{ color: '#ff6b35', marginLeft: '8px' }}>(Mặc định)</span>}
                                  </div>
                                  <div style={{ color: '#666', fontSize: '13px' }}>
                                    {address.address}
                                  </div>
                                </div>
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>

                        {selectedAddress && (
                          <div style={{
                            background: '#f8f9fa',
                            border: '1.5px solid #eaeaea',
                            borderRadius: '8px',
                            padding: '16px',
                            marginBottom: '20px',
                            lineHeight: '1.6',
                          }}>
                            <div style={{ marginBottom: '12px', fontWeight: 700, color: '#222', fontSize: '15px' }}>
                              📍 Thông tin địa chỉ giao hàng
                            </div>
                            <div style={{ color: '#666', fontSize: '14px' }}>
                              <div><strong>Địa chỉ:</strong> {selectedAddress.address}</div>
                              <div style={{ marginTop: '8px' }}>
                                <strong>Loại:</strong> {selectedAddress.addressType === 'HOME' ? 'Nhà riêng' : 'Văn phòng'}
                                {selectedAddress.isDefault && <span style={{ color: '#ff6b35', marginLeft: '8px', fontWeight: 'bold' }}>● Mặc định</span>}
                              </div>
                              <div style={{ marginTop: '8px' }}>
                                <strong>Khu vực:</strong> {
                                  (() => {
                                    const province = ghnProvinces.find(p => p.ProvinceID === selectedAddress.ghnProvinceId);
                                    const district = ghnDistricts.find(d => d.DistrictID === selectedAddress.ghnDistrictId);
                                    const ward = ghnWards.find(w => w.WardCode === selectedAddress.ghnWardCode);
                                    return [
                                      province ? province.ProvinceName : 'Không xác định',
                                      district ? district.DistrictName : 'Không xác định',
                                      ward ? ward.WardName : 'Không xác định'
                                    ].join(', ');
                                  })()
                                }
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {!isLoggedIn && (
                      <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[
                          { required: true, message: "Vui lòng nhập địa chỉ!" },
                        ]}
                      >
                        <Input
                          size="large"
                          style={styles.input}
                          placeholder="Nhập địa chỉ giao hàng (Số nhà, tên đường, ...)"
                          onFocus={(e) => {
                            e.target.style.borderColor = '#ff6b35';
                            e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#eaeaea';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </Form.Item>
                    )}

                    <Form.Item label="Ghi chú đơn hàng" name="orderNote">
                      <textarea 
                        rows="4" 
                        style={{...styles.textArea, width: '100%'}}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#ff6b35';
                          e.target.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#eaeaea';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </Form.Item>
                  </div>

                  {/* Shipping Methods */}
                  <div style={{ marginBottom: '32px' }}>
                    <Text style={styles.formSectionTitle}>Phương Thức Vận Chuyển</Text>
                    {loadingShipping && (
                      <div style={{ textAlign: 'center', margin: '16px 0' }}>
                        <Spin size="small" /> <Text type="secondary">Đang tính toán phí vận chuyển...</Text>
                      </div>
                    )}
                    <div style={styles.shippingMethodsContainer}>
                      {shippingMethods.map((shipping, idx) => {
                        // Xử lý delivery time để tính ngày dự kiến
                        const getDeliveryEstimate = (deliveryTime) => {
                          if (!deliveryTime || typeof deliveryTime !== 'string') {
                            return 'Giao hàng tiêu chuẩn (2-3 ngày)';
                          }
                          
                          // Check if it's the default message from backend
                          if (deliveryTime === 'Liên hệ để biết thời gian giao hàng') {
                            return 'Giao hàng tiêu chuẩn (2-3 ngày)';
                          }
                          
                          // Check if it's a date range format from backend
                          if (deliveryTime.includes('/')) {
                            return `Dự kiến: ${deliveryTime}`;
                          }
                          
                          const today = new Date();
                          const match = deliveryTime.match(/(\d+)[-–](\d+)/);
                          if (match) {
                            const minDays = parseInt(match[1]);
                            const maxDays = parseInt(match[2]);
                            const startDate = new Date(today);
                            startDate.setDate(today.getDate() + minDays);
                            const endDate = new Date(today);
                            endDate.setDate(today.getDate() + maxDays);
                            const formatDate = (date) =>
                              `${date.getDate()}/${date.getMonth() + 1}`;
                            return `${deliveryTime} (${formatDate(
                              startDate
                            )} - ${formatDate(endDate)})`;
                          }
                          return deliveryTime;
                        };

                        const isSelected = selectedShipping?.shippingId === shipping.shippingId;

                        return (
                          <div
                            key={shipping.shippingId}
                            onClick={() => {
                              setSelectedShipping(shipping);
                              setShippingFee(shipping.shippingFee);
                              form.setFieldValue('shippingMethod', shipping.shippingId);
                            }}
                            style={{
                              ...styles.shippingMethod,
                              ...(isSelected ? styles.shippingMethodSelected : {}),
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.borderColor = '#ff6b35';
                                e.currentTarget.style.background = '#fff9f6';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.borderColor = '#eaeaea';
                                e.currentTarget.style.background = '#fff';
                              }
                            }}
                          >
                            <div style={styles.shippingMethodInfo}>
                              <div style={styles.shippingMethodName}>
                                {shipping.shippingName}
                              </div>
                              <div style={styles.shippingMethodDelivery}>
                                {getDeliveryEstimate(shipping.deliveryTime || shipping.estimatedDays)}
                              </div>
                            </div>
                            <div style={styles.shippingMethodFee}>
                              {formatPrice(shipping.shippingFee)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div>
                    <Text style={styles.formSectionTitle}>Phương Thức Thanh Toán</Text>
                    <div style={styles.paymentMethodContainer}>
                      <label
                        style={{
                          ...styles.paymentOption,
                          ...(paymentMethod === 'cod' ? styles.paymentOptionSelected : {}),
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          if (paymentMethod !== 'cod') {
                            e.currentTarget.style.borderColor = '#ff6b35';
                            e.currentTarget.style.background = '#fff9f6';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (paymentMethod !== 'cod') {
                            e.currentTarget.style.borderColor = '#eaeaea';
                            e.currentTarget.style.background = '#fff';
                          }
                        }}
                      >
                        <input
                          type="radio"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          style={{ cursor: 'pointer' }}
                        />
                        <MoneyCollectOutlined style={styles.paymentOptionIcon} />
                        <span style={styles.paymentOptionText}>Thanh toán khi nhận hàng (COD)</span>
                      </label>

                      <label
                        style={{
                          ...styles.paymentOption,
                          ...(paymentMethod === 'vnpay' ? styles.paymentOptionSelected : {}),
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          if (paymentMethod !== 'vnpay') {
                            e.currentTarget.style.borderColor = '#ff6b35';
                            e.currentTarget.style.background = '#fff9f6';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (paymentMethod !== 'vnpay') {
                            e.currentTarget.style.borderColor = '#eaeaea';
                            e.currentTarget.style.background = '#fff';
                          }
                        }}
                      >
                        <input
                          type="radio"
                          value="vnpay"
                          checked={paymentMethod === 'vnpay'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          style={{ cursor: 'pointer' }}
                        />
                        <WalletOutlined style={styles.paymentOptionIcon} />
                        <span style={styles.paymentOptionText}>Thanh toán online qua VNPay</span>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button (Hidden - used in sidebar) */}
                  <input type="hidden" />
                </Form>
              </div>
            </Col>

            {/* Summary Section */}
            <Col xs={24} lg={8}>
              <div style={styles.summaryCard}>
                <Title level={4} style={styles.summaryTitle}>Đơn Hàng</Title>

                {/* Voucher Selector */}
                {isLoggedIn && customerId && (
                  <div style={styles.voucherSection}>
                    <VoucherSelector
                      customerId={customerId}
                      orderValue={totalPrice}
                      onVoucherApplied={handleVoucherApplied}
                      appliedVoucher={appliedVoucher}
                    />
                  </div>
                )}

                {/* Order Items */}
                <div style={styles.orderSummary}>
                  {orderItems.map((item, index) => {
                    const details = productDetails[item.productId] || {};
                    return (
                      <div 
                        key={index} 
                        style={{
                          ...styles.orderItem,
                          ...(index === orderItems.length - 1 ? styles.orderItemLast : {}),
                        }}
                      >
                        <Row gutter={12} align="middle">
                          <Col flex="100px">
                            {imageErrors[item.productId] ? (
                              <div style={{
                                ...styles.itemImage,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: '#f4f6fb'
                              }}>
                                <ShoppingCartOutlined style={{ fontSize: '32px', color: '#ccc' }} />
                              </div>
                            ) : (
                              <img
                                src={details.imageUrl || "placeholder.jpg"}
                                alt={details.productName}
                                style={styles.itemImage}
                                onError={() => handleImageError(item.productId)}
                              />
                            )}
                          </Col>
                          <Col flex="auto">
                            <div style={styles.itemName}>
                              {details.productName}
                            </div>
                            <div style={styles.itemDetails}>
                              <span style={styles.itemLabel}>Màu:</span> {details.colorName}
                            </div>
                            <div style={styles.itemDetails}>
                              <span style={styles.itemLabel}>Kích cỡ:</span> {details.sizeValue}
                            </div>
                            <div style={styles.itemDetails}>
                              <span style={styles.itemLabel}>Số lượng:</span> {item.quantity}
                            </div>
                            <div style={{ ...styles.itemDetails, fontWeight: '600', color: '#ff6b35', marginTop: '4px' }}>
                              {formatPrice(item.unitPrice)}
                            </div>
                          </Col>
                        </Row>
                      </div>
                    );
                  })}
                </div>

                {/* Price Breakdown */}
                <div style={{ marginTop: '20px' }}>
                  <div style={styles.priceBreakdown}>
                    <span style={styles.priceLabel}>Tạm tính:</span>
                    <span style={styles.priceValue}>{formatPrice(totalPrice)}</span>
                  </div>
                  <div style={styles.priceBreakdown}>
                    <span style={styles.priceLabel}>Phí vận chuyển:</span>
                    <span style={styles.shippingFeeValue}>{formatPrice(shippingFee)}</span>
                  </div>
                  {voucherDiscount > 0 && (
                    <div style={styles.priceBreakdown}>
                      <span style={styles.priceLabel}>Giảm giá:</span>
                      <span style={styles.discountValue}>-{formatPrice(voucherDiscount)}</span>
                    </div>
                  )}
                  
                  <div style={styles.totalBreakdown}>
                    <span style={styles.totalLabel}>Tổng cộng:</span>
                    <span style={styles.totalValue}>
                      {formatPrice(totalPrice + shippingFee - voucherDiscount)}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  style={{
                    ...styles.submitButton,
                    opacity: (submitting || loadingShipping) ? 0.7 : 1,
                    cursor: (submitting || loadingShipping) ? 'not-allowed' : 'pointer',
                  }}
                  onClick={() => {
                    if (!submitting && !loadingShipping) {
                      form.submit();
                    }
                  }}
                  disabled={submitting || loadingShipping}
                  onMouseEnter={(e) => {
                    if (!submitting && !loadingShipping) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.30)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!submitting && !loadingShipping) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.20)';
                    }
                  }}
                >
                  {submitting ? (
                    <Spin size="small" style={{ marginRight: '8px' }} />
                  ) : (
                    <CreditCardOutlined />
                  )}
                  {submitting
                    ? "Đang xử lý..."
                    : paymentMethod === "vnpay"
                    ? "Thanh toán VNPay"
                    : "Đặt hàng COD"}
                </button>

                <Text style={styles.note}>
                  {paymentMethod === "vnpay"
                    ? "* Bạn sẽ được chuyển đến trang thanh toán VNPay"
                    : "* Bạn sẽ thanh toán khi nhận hàng (COD)"}
                </Text>
              </div>
            </Col>
          </Row>
      
      </div>
    </CustomerLayout>
  );
};

export default CheckoutPage;
