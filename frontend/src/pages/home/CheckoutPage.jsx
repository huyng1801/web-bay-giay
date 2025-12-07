import React, { useEffect, useState } from "react";
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
} from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  MoneyCollectOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import CustomerLayout from "../../layouts/CustomerLayout";
import VoucherSelector from "../../components/voucher/VoucherSelector";
import { useNavigate } from "react-router-dom";
import {
  createOrder,
  createVNPayPayment,
  getProductById,
  getProductColorsByProductId,
  getSizesByProductColorId,
  getImagesByProductColorId,
  getCustomerByEmail,
  getAllActiveShippings,
  getShippingsByType,
} from "../../services/home/HomeService";
import { formatPrice } from "../../utils/formatters";
import {
  getProvinceOptions,
  findShippingTypeByProvince,
  filterShippingByType,
} from "../../utils/provinceUtils";
import { jwtDecode } from "jwt-decode";

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
  const [loading, setLoading] = useState(true);
  const [orderItems, setOrderItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [productDetails, setProductDetails] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [shippingFee, setShippingFee] = useState(0);

  useEffect(() => {
    const fetchInitialData = async () => {
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

      // Check authentication
      const token = localStorage.getItem("jwt");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          setIsLoggedIn(true);

          // Fetch customer details by email
          const customerData = await getCustomerByEmail(decodedToken.sub);
          if (customerData) {
            setCustomerId(customerData.customerId);
            form.setFieldsValue({
              fullName: customerData.fullName,
              email: customerData.email,
              phone: customerData.phone,
              address: customerData.address,
              address2: customerData.address2 || "",
              city: customerData.city,
            });
          }
        } catch (err) {
          console.error("Error fetching customer data:", err);
        }
      }

      try {
        const details = {};
        await Promise.all(
          cart.map(async (item) => {
            const [product, colors] = await Promise.all([
              getProductById(item.productId),
              getProductColorsByProductId(item.productId),
            ]);

            const selectedColor = colors.find(
              (color) => color.productColorId === item.colorId
            );

            const [sizes] = await Promise.all([
              getSizesByProductColorId(item.colorId),
     
            ]);

            const selectedSize = sizes.find(
              (size) => size.productSizeId === item.sizeId
            );

            details[item.productId] = {
              ...product,
              colorName: selectedColor?.colorName || "N/A",
              sizeValue: selectedSize?.sizeValue || "N/A",
              imageUrl: selectedColor.imageUrl,
            };
          })
        );

        setProductDetails(details);
        setOrderItems(cart);
        const total = cart.reduce(
          (acc, item) => acc + item.unitPrice * item.quantity,
          0
        );
        setTotalPrice(total);

        // Fetch shipping methods
        const shippings = await getAllActiveShippings();
        // Sort shipping methods by price (ascending - cheapest first)
        const sortedShippings = shippings.sort(
          (a, b) => a.shippingFee - b.shippingFee
        );

        if (sortedShippings.length > 0) {
          setSelectedShipping(sortedShippings[0]);
            
          setShippingFee(sortedShippings[0].shippingFee);
        }
        setShippingMethods(sortedShippings);
        // Auto-select cheapest shipping method if available

      } catch (error) {
        console.error("Error fetching order details:", error);
        message.error("Không thể tải thông tin đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [navigate, form]);

  const handleVoucherApplied = (voucher, discountAmount) => {
    setAppliedVoucher(voucher);
    setVoucherDiscount(discountAmount);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const orderData = {
        ...(isLoggedIn
          ? { customerId }
          : {
              guestDto: {
                fullName: values.fullName,
                email: values.email,
                phone: values.phone,
                address: values.address,
                address2: values.address2,
                city: values.city,
              },
            }),
        orderDto: {
          totalPrice: totalPrice + shippingFee - voucherDiscount,
          originalPrice: totalPrice,
          voucherDiscount: voucherDiscount,
          voucherCode: appliedVoucher?.code || null,
          isPaid: false,
          orderNote: values.orderNote,
          shippingId: selectedShipping?.shippingId || null,
        },
        orderItemDtos: orderItems.map((item) => ({
          productSizeId: item.sizeId,
          quantity: item.quantity,
          price: item.unitPrice,
        })),
      };

      const orderResponse = await createOrder(orderData);

      if (paymentMethod === "vnpay") {
        // Store order details temporarily for VNPay return handling
        localStorage.setItem(
          "pendingOrder",
          JSON.stringify({
            orderId: orderResponse.orderId,
            totalPrice: totalPrice,
          })
        );

        // Create VNPay payment URL and redirect
        const paymentUrl = await createVNPayPayment(
          orderResponse.orderId,
          totalPrice + shippingFee - voucherDiscount
        );
        window.location.href = paymentUrl;
      } else {
        // COD payment - order completed
        message.success("Đặt hàng thành công!");

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
      message.error("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
      console.error("Error creating order:", error);
    } finally {
      setLoading(false);
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
          <Spin size="large" />
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
                          label="Tỉnh / Thành phố"
                          name="city"
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
                            options={getProvinceOptions()}
                            disabled={isLoggedIn}
                            style={{ ...styles.select }}
                            onChange={async (selectedCity) => {
                              try {
                                // Get shipping type based on selected city
                                const shippingType =
                                  findShippingTypeByProvince(selectedCity);
                                console.log(
                                  "Selected city:",
                                  selectedCity,
                                  "Shipping type:",
                                  shippingType
                                );

                                let filteredShippings = [];

                                try {
                                  // Try backend filtering first
                                  filteredShippings = await getShippingsByType(
                                    shippingType
                                  );
                                } catch (error) {
                                  console.log(
                                    "Backend type filtering not available, using client-side filtering"
                                  );
                                  // Fallback to client-side filtering
                                  const allShippings =
                                    await getAllActiveShippings();
                                  filteredShippings = filterShippingByType(
                                    allShippings,
                                    shippingType
                                  );
                                }

                                // Sort filtered shipping methods by price (cheapest first)
                                const sortedFilteredShippings =
                                  filteredShippings.sort(
                                    (a, b) => a.shippingFee - b.shippingFee
                                  );
                                setShippingMethods(sortedFilteredShippings);

                                // Auto-select cheapest filtered shipping method if available
                                if (sortedFilteredShippings.length > 0) {
                                  setSelectedShipping(sortedFilteredShippings[0]);
                                  setShippingFee(
                                    sortedFilteredShippings[0].shippingFee
                                  );
                                } else {
                                  // Final fallback to all active shippings
                                  const allShippings =
                                    await getAllActiveShippings();
                                  const sortedAllShippings = allShippings.sort(
                                    (a, b) => a.shippingFee - b.shippingFee
                                  );

                                       if (sortedAllShippings.length > 0) {
                                    setSelectedShipping(sortedAllShippings[0]);
                                    setShippingFee(
                                      sortedAllShippings[0].shippingFee
                                    );
                                  }
                                  setShippingMethods(sortedAllShippings);
                             
                                }
                              } catch (error) {
                                console.error(
                                  "Error filtering shipping methods:",
                                  error
                                );
                                message.warning(
                                  "Không thể tải phương thức vận chuyển phù hợp."
                                );
                              }
                            }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

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

                    <Form.Item label="Địa chỉ bổ sung (tùy chọn)" name="address2">
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
                    <div style={styles.shippingMethodsContainer}>
                      {shippingMethods.map((shipping, idx) => {
                        // Xử lý delivery time để tính ngày dự kiến
                        const getDeliveryEstimate = (deliveryTime) => {
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
                                {getDeliveryEstimate(shipping.deliveryTime)}
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
                            <img
                              src={details.imageUrl || "placeholder.jpg"}
                              alt={details.productName}
                              style={styles.itemImage}
                            />
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
                  }}
                  onClick={() => form.submit()}
                  disabled={loading}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.30)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.20)';
                  }}
                >
                  <CreditCardOutlined />
                  {paymentMethod === "vnpay"
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
