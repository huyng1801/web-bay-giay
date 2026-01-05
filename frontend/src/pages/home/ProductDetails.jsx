import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductById,
  getDetailsByProductId,
  getProductImages,
  getAllProducts,
} from "../../services/home/HomeService";
import {
  calculateDiscountedPrice,
  getPriceDisplayInfo,
} from "../../utils/priceUtils";
import {
  Spin,
  Typography,
  Row,
  Col,
  Carousel,
  message,
  InputNumber,
} from "antd";
import {
  ShoppingCartOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import CustomerLayout from "../../layouts/CustomerLayout";
import ProductCard from "../../components/home/ProductCard";

const { Title, Text } = Typography;

const styles = {
  // Main wrapper


  // Carousel/Images - Premium presentation
  carousel: {
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    background: "#f4f6fb",
    border: "1px solid #eaeaea",
    position: "relative",
  },

  carouselImage: {
    width: "100%",
    height: "420px",
    objectFit: "cover",
    borderRadius: "12px",
    border: "none",
  },

  // Thumbnail Gallery
  thumbnailContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "16px",
    overflow: "hidden",
    paddingBottom: "8px",
    position: "relative",
  },

  thumbnailScroll: {
    display: "flex",
    gap: "10px",
    overflow: "auto",
    overflowY: "hidden",
    scrollBehavior: "smooth",
    flex: 1,
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    "&::-webkit-scrollbar": {
      display: "none"
    }
  },

  thumbnailNavButton: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "rgba(0,0,0,0.5)",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    transition: "all 0.3s ease",
    zIndex: 10,
  },

  thumbnailNavButtonHover: {
    background: "rgba(0,0,0,0.8)",
    transform: "translateY(-50%) scale(1.1)",
  },

  thumbnailNavPrev: {
    left: "-40px",
  },

  thumbnailNavNext: {
    right: "-40px",
  },

  thumbnail: {
    width: "80px",
    height: "80px",
    borderRadius: "8px",
    border: "2px solid #eaeaea",
    objectFit: "cover",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
    flexShrink: 0,
  },

  thumbnailActive: {
    borderColor: "#ff6b35",
    boxShadow: "0 2px 8px rgba(255, 107, 53, 0.2)",
  },

  thumbnailHover: {
    borderColor: "#ff6b35",
    boxShadow: "0 4px 12px rgba(255, 107, 53, 0.3)",
  },

  // Product info section
  productInfo: {
    paddingLeft: "0",
  },

  // Title & Meta - Enhanced typography
  title: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "16px",
    color: "#222",
    lineHeight: "1.2",
    letterSpacing: "-0.5px",
    textTransform: "uppercase",
    display: "inline-block",
    paddingBottom: "6px",
  },

  meta: {
    fontSize: "14px",
    color: "#999",
    marginBottom: "20px",
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },

  ratingMeta: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#faad14",
  },

  divider: {
    height: "1px",
    background: "#eaeaea",
    margin: "24px 0",
  },

  // Price Section - Premium styling
  priceSection: {
    marginBottom: "40px",
  },

  priceTag: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    marginBottom: "18px",
    flexWrap: "wrap",
  },

  salePrice: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#ff4d4f",
    lineHeight: "1",
    letterSpacing: "-0.5px",
  },

  originalPrice: {
    fontSize: "16px",
    color: "#999",
    textDecoration: "line-through",
    fontWeight: "500",
  },

  discount: {
    display: "inline-block",
    background: "#ff4d4f",
    color: "#fff",
    padding: "6px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "600",
    letterSpacing: "0.3px",
    boxShadow: "0 2px 8px rgba(255,77,79,0.08)",
  },

  stockStatus: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "15px",
    color: "#52c41a",
    marginTop: "12px",
    fontWeight: "500",
  },

  // Description section
  section: {
    marginBottom: "40px",
  },

  sectionTitle: {
    fontSize: "18px",
    fontWeight: "800",
    marginBottom: "18px",
    color: "#222",
    textTransform: "uppercase",
    letterSpacing: "1px",
    borderBottom: "3px solid #ff6b35",
    paddingBottom: "8px",
    display: "inline-block",
  },

  description: {
    marginTop: "16px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    lineHeight: "1.7",
    color: "#555",
    fontSize: "15px",
  },

  optionContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
  },

  colorButton: {
    height: "38px",
    minWidth: "60px",
    padding: "0 12px",
    borderRadius: "999px",
    border: "2px solid #ddd",
    background: "#fff",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "8px",
    marginBottom: "8px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
  },

  colorButtonSelected: {
    border: "2.5px solid #ff6b35",
    background: "#ff6b35",
    color: "#fff",
    boxShadow: "0 6px 20px rgba(255,107,53,0.10)",
    transform: "translateY(-2px)",
  },

  sizeButton: {
    height: "38px",
    minWidth: "60px",
    padding: "0 12px",
    borderRadius: "999px",
    border: "2px solid #ddd",
    background: "#fff",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
    marginRight: "8px",
    marginBottom: "8px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
  },

  sizeButtonSelected: {
    background: "#222",
    color: "#fff",
    border: "2.5px solid #222",
    boxShadow: "0 6px 20px rgba(34,34,34,0.10)",
    transform: "translateY(-2px)",
  },

  sizeButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },

  quantityContainer: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    marginBottom: "40px",
    padding: "20px 24px",
    background: "#f4f6fb",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    border: "1.5px solid #eaeaea",
  },

  quantityLabel: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#222",
  },

  quantityInput: {
    width: "100px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #ddd",
  },

  // Buttons - Premium styling
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  addToCartButton: {
    height: "44px",
    fontSize: "15px",
    fontWeight: "700",
    width: "100%",
    background: "#fff",
    color: "#222",
    border: "2px solid #222",
    borderRadius: "999px",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    letterSpacing: "0.3px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
  },

  addToCartButtonHover: {
    background: "#f0f0f0",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 20px rgba(34,34,34,0.10)",
  },

  buyNowButton: {
    height: "44px",
    fontSize: "15px",
    fontWeight: "700",
    width: "100%",
    background: "#ff6b35",
    color: "#fff",
    border: "none",
    borderRadius: "999px",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    letterSpacing: "0.3px",
    boxShadow: "0 1px 4px rgba(255,77,79,0.08)",
  },

  buyNowButtonHover: {
    background: "#ff4d4f",
    boxShadow: "0 8px 32px rgba(255, 77, 79, 0.18)",
    transform: "translateY(-2px)",
  },

  // Loading & Error
  spinner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "600px",
  },

  error: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#ff4d4f",
    background: "#fff2f0",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "500",
  },

  feedbackSection: {
    marginTop: "80px",
    paddingTop: "40px",
    borderTop: "2.5px solid #eaeaea",
    background: "#fff",
    borderRadius: "18px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.07)",
    padding: "48px 40px",
    marginBottom: "48px",
  },

  relatedSection: {
    marginTop: "80px",
    paddingTop: "60px",
    borderTop: "2.5px solid #eaeaea",
  },

  relatedTitle: {
    fontSize: "28px",
    fontWeight: "800",
    marginBottom: "36px",
    color: "#222",
    letterSpacing: "1px",
    borderBottom: "3px solid #ff6b35",
    paddingBottom: "12px",
    display: "inline-block",
  },

  productsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "24px",
    marginBottom: "48px",
  },
};

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const carouselRef = React.useRef(null);
  const thumbnailContainerRef = React.useRef(null);
  
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allProductDetails, setAllProductDetails] = useState([]); // All details for the product
  const [selectedDetailId, setSelectedDetailId] = useState(null); // Selected detail ID
  const [productImages, setProductImages] = useState([]);
  const [displayImages, setDisplayImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isBuyNowMode, setIsBuyNowMode] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    // Check if this is buy now mode from URL params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("buyNow") === "true") {
      setIsBuyNowMode(true);
    }
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        // Fetch main product information
        const product = await getProductById(productId);
        
        // Check if product is active
        if (!product.isActive) {
          setError("Sản phẩm này hiện không khả dụng.");
          return;
        }

        setProductDetails(product);

        // Fetch all product details (contains color, size, stock info)
        const details = await getDetailsByProductId(productId);
        setAllProductDetails(details);

        // Select first available detail by default
        if (details && details.length > 0) {
          setSelectedDetailId(details[0].productDetailsId);
        } else {
          setError("Sản phẩm này hiện không có chi tiết khả dụng.");
        }

        // Fetch product images
        const images = await getProductImages(productId);
        setProductImages(images);
        setDisplayImages(images);

        // Fetch related products from same sub-category
        if (product.subCategoryId) {
          try {
            const relatedProds = await getAllProducts(product.subCategoryId);
            // Filter out current product and limit to 6 items
            const filtered = relatedProds
              .filter((p) => p.productId !== productId && p.isActive === true)
              .slice(0, 6);
            setRelatedProducts(filtered);
          } catch (err) {
            console.error("Error fetching related products:", err);
          }
        }
      } catch (err) {
        setError("Không thể tải thông tin sản phẩm.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  // Auto-scroll thumbnail when carousel changes
  const scrollThumbnailToActive = (index) => {
    if (!thumbnailContainerRef.current) return;
    const scrollContainer = thumbnailContainerRef.current.querySelector('[data-scroll-container]');
    if (!scrollContainer) return;
    
    const thumbnail = scrollContainer.children[index];
    if (!thumbnail) return;
    
    // Scroll to center the active thumbnail
    const scrollLeft = thumbnail.offsetLeft - scrollContainer.offsetWidth / 2 + thumbnail.offsetWidth / 2;
    scrollContainer.scrollTo({
      left: Math.max(0, scrollLeft),
      behavior: 'smooth'
    });
  };

  // Handle thumbnail click to change main image
  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
    if (carouselRef.current) {
      carouselRef.current.goTo(index);
    }
    scrollThumbnailToActive(index);
  };

  // Handle thumbnail navigation buttons
  const scrollThumbnails = (direction) => {
    if (!thumbnailContainerRef.current) return;
    const scrollContainer = thumbnailContainerRef.current.querySelector('[data-scroll-container]');
    if (!scrollContainer) return;
    
    const scrollAmount = 100; // pixels to scroll
    scrollContainer.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  };

  // Scroll thumbnail when carousel changes
  useEffect(() => {
    scrollThumbnailToActive(currentImageIndex);
  }, [currentImageIndex]);

  // Get current selected detail object
  const getSelectedDetail = () => {
    if (!selectedDetailId || !allProductDetails.length) return null;
    return allProductDetails.find(d => d.productDetailsId === selectedDetailId);
  };

  const selectedDetail = getSelectedDetail();

  // Get unique colors from all product details
  const getUniqueColors = () => {
    const colorMap = new Map();
    allProductDetails.forEach(detail => {
      if (detail.color && !colorMap.has(detail.color.colorId)) {
        colorMap.set(detail.color.colorId, detail.color);
      }
    });
    return Array.from(colorMap.values());
  };

  // Get sizes for selected color
  const getAvailableSizesForColor = () => {
    if (!selectedDetail || !selectedDetail.color) return [];
    const colorId = selectedDetail.color.colorId;
    const detailsForColor = allProductDetails.filter(
      d => d.color?.colorId === colorId && d.isActive
    );
    // Get unique sizes
    const sizeMap = new Map();
    detailsForColor.forEach(detail => {
      if (detail.size && !sizeMap.has(detail.size.sizeId)) {
        sizeMap.set(detail.size.sizeId, detail.size);
      }
    });
    return Array.from(sizeMap.values());
  };

  // Handle color change - select first detail with that color
  const handleColorChange = (colorId) => {
    const firstDetailWithColor = allProductDetails.find(
      d => d.color?.colorId === colorId && d.isActive
    );
    if (firstDetailWithColor) {
      setSelectedDetailId(firstDetailWithColor.productDetailsId);
    }
  };

  // Handle size change - find and select the detail with this size and current color
  const handleSizeChange = (sizeId) => {
    const currentColor = selectedDetail?.color?.colorId;
    if (currentColor) {
      const detailWithSizeAndColor = allProductDetails.find(
        d => d.color?.colorId === currentColor && d.size?.sizeId === sizeId && d.isActive
      );
      if (detailWithSizeAndColor) {
        setSelectedDetailId(detailWithSizeAndColor.productDetailsId);
      }
    }
  };

  // Create list of images to display (main image + additional images)
  useEffect(() => {
    const imagesToDisplay = [];

    // Add main product image if available
    if (productDetails && productDetails.mainImageUrl) {
      imagesToDisplay.push({
        id: `main-${productId}`,
        imageUrl: productDetails.mainImageUrl,
        alt: `${productDetails.productName} - Ảnh chính`,
        isMainImage: true,
      });
    }

    // Add additional product images
    productImages.forEach((image) => {
      imagesToDisplay.push({
        id: image.productImageId,
        imageUrl: image.imageUrl,
        alt: `${productDetails?.productName} - Ảnh phụ`,
        isMainImage: false,
      });
    });

    setDisplayImages(imagesToDisplay);
  }, [productImages, productDetails, productId]);

  const handleAddToCart = () => {
    if (!selectedDetail || !selectedDetailId) {
      message.error("Vui lòng chọn chi tiết sản phẩm (màu và kích cỡ).");
      return;
    }

    if (selectedDetail.stockQuantity <= 0) {
      message.error("Sản phẩm này hiện đã hết hàng.");
      return;
    }

    const discountedPrice = calculateDiscountedPrice(
      productDetails.sellingPrice,
      productDetails.discountPercentage
    );

    const cartItem = {
      productId,
      productDetailsId: selectedDetailId,
      colorId: selectedDetail.color?.colorId,
      sizeId: selectedDetail.size?.sizeId,
      productName: productDetails.productName,
      colorName: selectedDetail.color?.colorName,
      sizeValue: selectedDetail.size?.sizeValue,
      imageUrl: productDetails.mainImageUrl,
      quantity,
      unitPrice: discountedPrice,
    };

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    // Check if product detail already in cart
    const existingIndex = cart.findIndex(
      (item) => item.productDetailsId === selectedDetailId
    );
    if (existingIndex !== -1) {
      // If exists, check total doesn't exceed stock
      const newTotalQuantity = cart[existingIndex].quantity + quantity;
      if (newTotalQuantity > selectedDetail.stockQuantity) {
        message.error(
          `Chỉ có thể mua tối đa ${selectedDetail.stockQuantity} sản phẩm này. Hiện tại đã có ${cart[existingIndex].quantity} trong giỏ.`
        );
        return;
      }
      cart[existingIndex].quantity = newTotalQuantity;
    } else {
      // If not exists, add new
      cart.push(cartItem);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    message.success({
      content: "Đã thêm sản phẩm vào giỏ hàng!",
      icon: <ShoppingCartOutlined />,
    });
  };

  const handleBuyNow = () => {
    if (!selectedDetail || !selectedDetailId) {
      message.error("Vui lòng chọn chi tiết sản phẩm (màu và kích cỡ).");
      return;
    }

    if (selectedDetail.stockQuantity <= 0) {
      message.error("Sản phẩm này hiện đã hết hàng.");
      return;
    }

    const discountedPrice = calculateDiscountedPrice(
      productDetails.sellingPrice,
      productDetails.discountPercentage
    );

    // Create item for buy now
    const buyNowItem = {
      productId,
      productDetailsId: selectedDetailId,
      colorId: selectedDetail.color?.colorId,
      sizeId: selectedDetail.size?.sizeId,
      productName: productDetails.productName,
      colorName: selectedDetail.color?.colorName,
      sizeValue: selectedDetail.size?.sizeValue,
      imageUrl: productDetails.mainImageUrl,
      quantity,
      unitPrice: discountedPrice,
    };

    // Save to localStorage with key for buy now
    localStorage.setItem("buyNowItem", JSON.stringify(buyNowItem));

    // Redirect to checkout with buy now flag
    navigate("/checkout?buyNow=true");
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div style={styles.spinner}>
          <Spin size="large" />
        </div>
      </CustomerLayout>
    );
  }

  if (error) {
    return (
      <CustomerLayout>
        <div style={styles.error}>{error}</div>
      </CustomerLayout>
    );
  }

  if (!productDetails) {
    return (
      <CustomerLayout>
        <div style={styles.error}>Không có thông tin sản phẩm.</div>
      </CustomerLayout>
    );
  }

  const uniqueColors = getUniqueColors();
  const availableSizesForColor = getAvailableSizesForColor();

  return (
    <CustomerLayout>
      <div style={styles.container}>
        <div style={styles.contentWrapper}>
          <Row gutter={[40, 40]}>
            {/* Image Carousel */}
            <Col xs={24} md={12}>
              <div style={styles.carousel}>
                <Carousel 
                  ref={carouselRef}
                  autoplay={{
                    delay: 4000
                  }}
                  dots={false}
                  onChange={(current) => setCurrentImageIndex(current)}
                >
                  {displayImages.length > 0 ? (
                    displayImages.map((image, idx) => (
                      <div key={idx}>
                        <img
                          src={image.imageUrl}
                          alt={image.alt || `Ảnh sản phẩm ${idx + 1}`}
                          style={styles.carouselImage}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling && (e.target.nextElementSibling.style.display = 'block');
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    <div
                      style={{
                        ...styles.carouselImage,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f5f5f5",
                        color: "#999",
                        fontSize: "16px",
                      }}
                    >
                      Không có hình ảnh
                    </div>
                  )}
                </Carousel>

                {/* Thumbnail Gallery */}
                {displayImages.length > 1 && (
                  <div ref={thumbnailContainerRef} style={styles.thumbnailContainer}>
                    <button
                      style={{
                        ...styles.thumbnailNavButton,
                        ...styles.thumbnailNavPrev,
                      }}
                      onMouseEnter={(e) => Object.assign(e.target.style, styles.thumbnailNavButtonHover)}
                      onMouseLeave={(e) => e.target.style.background = "rgba(0,0,0,0.5)"}
                      onClick={() => scrollThumbnails('prev')}
                      title="Ảnh trước"
                    >
                      &#8249;
                    </button>

                    <div data-scroll-container style={styles.thumbnailScroll}>
                      {displayImages.map((image, idx) => (
                        <img
                          key={idx}
                          src={image.imageUrl}
                          alt={`Thumbnail ${idx + 1}`}
                          style={{
                            ...styles.thumbnail,
                            ...(currentImageIndex === idx ? styles.thumbnailActive : {})
                          }}
                          onMouseEnter={(e) => {
                            if (currentImageIndex !== idx) {
                              e.target.style.borderColor = styles.thumbnailHover.borderColor;
                              e.target.style.boxShadow = styles.thumbnailHover.boxShadow;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currentImageIndex !== idx) {
                              e.target.style.borderColor = styles.thumbnail.border.split(" ")[2];
                              e.target.style.boxShadow = "none";
                            }
                          }}
                          onClick={() => handleThumbnailClick(idx)}
                        />
                      ))}
                    </div>

                    <button
                      style={{
                        ...styles.thumbnailNavButton,
                        ...styles.thumbnailNavNext,
                      }}
                      onMouseEnter={(e) => Object.assign(e.target.style, styles.thumbnailNavButtonHover)}
                      onMouseLeave={(e) => e.target.style.background = "rgba(0,0,0,0.5)"}
                      onClick={() => scrollThumbnails('next')}
                      title="Ảnh tiếp"
                    >
                      &#8250;
                    </button>
                  </div>
                )}
              </div>
            </Col>

            {/* Product Details */}
            <Col xs={24} md={12}>
              <div style={styles.productInfo}>
                {/* Title */}
                <Title level={1} style={styles.title}>
                  {productDetails.productName}
                </Title>

                {/* Price Section */}
                <div style={styles.priceSection}>
                  {(() => {
                    const priceInfo = getPriceDisplayInfo(productDetails);
                    return (
                      <>
                        <div style={styles.priceTag}>
                          <span style={styles.salePrice}>
                            {priceInfo.finalPrice.toLocaleString("vi-VN")}₫
                          </span>
                          {priceInfo.hasDiscount && (
                            <>
                              <span style={styles.originalPrice}>
                                {priceInfo.originalPrice.toLocaleString(
                                  "vi-VN"
                                )}
                                ₫
                              </span>
                              <span style={styles.discount}>
                                -{priceInfo.discountPercentage}%
                              </span>
                            </>
                          )}
                        </div>
                        {selectedDetail && selectedDetail.stockQuantity > 0 && (
                          <div style={styles.stockStatus}>
                            <CheckCircleOutlined />
                            <Text>
                              Còn {selectedDetail.stockQuantity} sản phẩm có sẵn
                            </Text>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>

                {/* Description */}
                {productDetails.description && (
                  <div style={styles.section}>
                    <Text style={styles.sectionTitle}>Mô Tả</Text>
                    <div
                      style={styles.description}
                      dangerouslySetInnerHTML={{
                        __html: productDetails.description,
                      }}
                    />
                  </div>
                )}

                {/* Colors */}
                <div style={styles.section}>
                  <Text style={styles.sectionTitle}>Màu Sắc</Text>
                  <div style={styles.optionContainer}>
                    {uniqueColors.map((color) => (
                      <button
                        key={color.colorId}
                        onClick={() => handleColorChange(color.colorId)}
                        style={{
                          ...styles.colorButton,
                          ...(selectedDetail?.color?.colorId === color.colorId
                            ? styles.colorButtonSelected
                            : {}),
                        }}
                        title={color.colorName}
                      >
                        {color.colorName}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div style={styles.section}>
                  <Text style={styles.sectionTitle}>Kích Cỡ</Text>
                  <div style={styles.optionContainer}>
                    {availableSizesForColor.map((size) => (
                      <button
                        key={size.sizeId}
                        onClick={() => handleSizeChange(size.sizeId)}
                        style={{
                          ...styles.sizeButton,
                          ...(selectedDetail?.size?.sizeId === size.sizeId
                            ? styles.sizeButtonSelected
                            : {}),
                          ...(size.stockQuantity === 0 ? styles.sizeButtonDisabled : {}),
                        }}
                        disabled={size.stockQuantity === 0}
                        title={`${size.sizeValue} - Còn: ${size.stockQuantity}`}
                      >
                        {size.sizeValue}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div style={styles.quantityContainer}>
                  <Text style={styles.quantityLabel}>Số Lượng:</Text>
                  <InputNumber
                    min={1}
                    max={selectedDetail ? selectedDetail.stockQuantity : 1}
                    value={quantity}
                    onChange={setQuantity}
                    style={styles.quantityInput}
                  />
                </div>

                {/* Action Buttons */}
                <div style={styles.buttonContainer}>
                  <button
                    style={styles.addToCartButton}
                    onClick={handleAddToCart}
                    onMouseEnter={(e) =>
                      (e.target.style.background = "#f0f0f0")
                    }
                    onMouseLeave={(e) => (e.target.style.background = "#fff")}
                  >
                    <ShoppingCartOutlined style={{ marginRight: "8px" }} />
                    Thêm vào giỏ hàng
                  </button>
                  <button
                    style={styles.buyNowButton}
                    onClick={handleBuyNow}
                    onMouseEnter={e => {
                      Object.assign(e.target.style, styles.buyNowButtonHover);
                    }}
                    onMouseLeave={e => {
                      Object.assign(e.target.style, styles.buyNowButton);
                    }}
                  >
                    <ThunderboltOutlined style={{ marginRight: "8px" }} />
                    {isBuyNowMode ? "MUA NGAY" : "Mua ngay"}
                  </button>
                </div>
              </div>
            </Col>
          </Row>

          {/* Product feedback feature has been removed for simplicity */}

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div style={styles.relatedSection}>
              <Title level={2} style={styles.relatedTitle}>
                Sản Phẩm Liên Quan
              </Title>
              <div style={styles.productsGrid}>
                {relatedProducts.map((product) => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
};

export default ProductDetails;
