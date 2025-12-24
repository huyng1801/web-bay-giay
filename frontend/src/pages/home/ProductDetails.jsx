import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductById,
  getProductColorsByProductId,
  getSizesByProductColorId,
  getImagesByProductColorId,
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
import ProductFeedback from "../../components/home/ProductFeedback";
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
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [colors, setColors] = useState([]);
  const [selectedColorId, setSelectedColorId] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [images, setImages] = useState([]);
  const [displayImages, setDisplayImages] = useState([]);
  const [selectedSizeId, setSelectedSizeId] = useState(null);
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
        const product = await getProductById(productId);

        // Check if product is active
        if (!product.isActive) {
          setError("Sản phẩm này hiện không khả dụng.");
          return;
        }

        setProductDetails(product);

        const productColors = await getProductColorsByProductId(productId);
        // Filter for active colors only
        const activeColors = productColors.filter(
          (color) => color.isActive === true
        );
        setColors(activeColors);

        if (activeColors && activeColors.length > 0) {
          setSelectedColorId(activeColors[0].productColorId);
        } else {
          setError("Sản phẩm này hiện không có màu sắc khả dụng.");
        }

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

  useEffect(() => {
    const fetchColorDetails = async () => {
      if (selectedColorId) {
        try {
          const [fetchedSizes, fetchedImages] = await Promise.all([
            getSizesByProductColorId(selectedColorId),
            getImagesByProductColorId(selectedColorId),
          ]);
          // Filter for active sizes only
          const activeSizes = fetchedSizes.filter(
            (size) => size.isActive === true
          );
          setSizes(activeSizes);
          setImages(fetchedImages);
          setSelectedSizeId(null); // Reset size selection when color changes
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchColorDetails();
  }, [selectedColorId]);

  // Tạo danh sách ảnh để hiển thị (ảnh chính + ảnh phụ)
  useEffect(() => {
    if (selectedColorId && colors.length > 0) {
      const selectedColor = colors.find(
        (color) => color.productColorId === selectedColorId
      );
      const imagesToDisplay = [];

      // Thêm ảnh chính của màu vào đầu danh sách
      if (selectedColor && selectedColor.imageUrl) {
        imagesToDisplay.push({
          id: `main-${selectedColorId}`,
          imageUrl: selectedColor.imageUrl,
          alt: `${productDetails?.productName} - ${selectedColor.colorName}`,
          isMainImage: true,
        });
      }

      // Thêm các ảnh phụ từ ProductColorImage
      images.forEach((image) => {
        imagesToDisplay.push({
          id: image.productColorImageId,
          imageUrl: image.imageUrl,
          alt: productDetails?.productName,
          isMainImage: false,
        });
      });

      setDisplayImages(imagesToDisplay);
    }
  }, [selectedColorId, colors, images, productDetails]);

  const handleAddToCart = () => {
    if (!selectedSizeId) {
      message.error("Vui lòng chọn kích cỡ.");
      return;
    }

    const discountedPrice = calculateDiscountedPrice(
      productDetails.sellingPrice,
      productDetails.discountPercentage
    );

    const cartItem = {
      productId,
      productName: productDetails.productName,
      colorId: selectedColorId,
      sizeId: selectedSizeId,
      quantity,
      unitPrice: discountedPrice,
    };

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    // Kiểm tra sản phẩm đã có trong giỏ chưa (cùng productId, colorId, sizeId)
    const existingIndex = cart.findIndex(
      (item) =>
        item.productId === productId &&
        item.colorId === selectedColorId &&
        item.sizeId === selectedSizeId
    );
    if (existingIndex !== -1) {
      // Nếu đã có thì kiểm tra tổng số lượng không vượt quá kho
      const newTotalQuantity = cart[existingIndex].quantity + quantity;
      if (newTotalQuantity > selectedSize.stockQuantity) {
        message.error(
          `Chỉ có thể mua tối đa ${selectedSize.stockQuantity} sản phẩm này. Hiện tại đã có ${cart[existingIndex].quantity} trong giỏ.`
        );
        return;
      }
      cart[existingIndex].quantity = newTotalQuantity;
    } else {
      // Nếu chưa có thì thêm mới
      cart.push(cartItem);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    message.success({
      content: "Đã thêm sản phẩm vào giỏ hàng!",
      icon: <ShoppingCartOutlined />,
    });
  };

  const handleBuyNow = () => {
    if (!selectedSizeId) {
      message.error("Vui lòng chọn kích cỡ.");
      return;
    }

    const discountedPrice = calculateDiscountedPrice(
      productDetails.sellingPrice,
      productDetails.discountPercentage
    );

    // Tạo item để mua ngay
    const buyNowItem = {
      productId,
      productName: productDetails.productName,
      colorId: selectedColorId,
      sizeId: selectedSizeId,
      quantity,
      unitPrice: discountedPrice,
    };

    // Lưu vào localStorage với key riêng cho mua ngay
    localStorage.setItem("buyNowItem", JSON.stringify(buyNowItem));

    // Chuyển hướng đến trang thanh toán với flag mua ngay
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

  const selectedSize = sizes.find(
    (size) => size.productSizeId === selectedSizeId
  );

  return (
    <CustomerLayout>
      <div style={styles.container}>
        <div style={styles.contentWrapper}>
          <Row gutter={[40, 40]}>
            {/* Image Carousel */}
            <Col xs={24} md={12}>
              <div style={styles.carousel}>
                <Carousel autoplay>
                  {displayImages.length > 0 ? (
                    displayImages.map((image) => (
                      <div key={image.id}>
                        <img
                          src={image.imageUrl}
                          alt={image.alt}
                          style={styles.carouselImage}
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
                        {selectedSize && selectedSize.stockQuantity > 0 && (
                          <div style={styles.stockStatus}>
                            <CheckCircleOutlined />
                            <Text>
                              Còn {selectedSize.stockQuantity} sản phẩm có sẵn
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
                    {colors.map((color) => (
                      <button
                        key={color.productColorId}
                        onClick={() => setSelectedColorId(color.productColorId)}
                        style={{
                          ...styles.colorButton,
                          ...(selectedColorId === color.productColorId
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
                    {sizes.map((size) => (
                      <button
                        key={size.productSizeId}
                        onClick={() => setSelectedSizeId(size.productSizeId)}
                        disabled={size.stockQuantity === 0}
                        style={{
                          ...styles.sizeButton,
                          ...(selectedSizeId === size.productSizeId
                            ? styles.sizeButtonSelected
                            : {}),
                          opacity: size.stockQuantity === 0 ? 0.5 : 1,
                          cursor:
                            size.stockQuantity === 0
                              ? "not-allowed"
                              : "pointer",
                        }}
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
                    max={selectedSize ? selectedSize.stockQuantity : 1}
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

          {/* Product Feedback Section */}
          <ProductFeedback productId={productDetails?.productId} />

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
