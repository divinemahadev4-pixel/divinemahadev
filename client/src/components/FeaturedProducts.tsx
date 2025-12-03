import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Star,
  Sparkles,
  Sun,
  Zap,
  Eye,
} from "lucide-react";
import { useWishlist } from "./WishlistContext";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { usePhoneVerification } from "@/hooks/usePhoneVerification";
import { usePaymentProcessing } from "@/hooks/usePaymentProcessing";
import PhoneVerificationModal from "@/components/PhoneVerificationModal";

const API_URL =
  import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";

interface ApiProduct {
  _id: string;
  Product_name: string;
  Product_price: number;
  discounted_price: number;
  Product_image: string[];
  Product_rating?: number;
  isNew?: boolean;
  Product_discription?: string;
  Product_description?: string;
  Product_available?: boolean;
  Product_category?: { category: string; slug?: string };
  Product_reviewCount?: number;
}

const currency = (n: number) => `₹${n.toLocaleString()}`;

// Spiritual Symbol Component
const SpiritualSymbol = () => (
  <div className="relative w-14 h-14 flex items-center justify-center">
    <motion.div
      className="absolute w-10 h-10 bg-orange-100/50 rounded-full"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    <Sun
      className="w-6 h-6 text-orange-400"
      fill="currentColor"
      fillOpacity="0.3"
    />
  </div>
);

const ProductCard: React.FC<{
  product: ApiProduct;
  onClick: (id: string) => void;
  onWishlistToggle: (e: React.MouseEvent, product: ApiProduct) => void;
  onAddToCart: (product: ApiProduct) => void;
  inWishlist: boolean;
  onDirectBuy: (product: ApiProduct) => void;
}> = React.memo(
  ({
    product,
    onClick,
    onWishlistToggle,
    inWishlist,
  }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    const hasDiscount = useMemo(() => {
      const mrp = product.discounted_price as any;
      const sellingPrice = product.Product_price;
      return (
        typeof mrp === "number" &&
        !isNaN(mrp) &&
        mrp > 0 &&
        mrp > sellingPrice
      );
    }, [product.Product_price, product.discounted_price]);

    const discountPercentage = useMemo(() => {
      if (!hasDiscount) return 0;
      const mrp = product.discounted_price as number;
      const sellingPrice = product.Product_price;
      return Math.round(((mrp - sellingPrice) / mrp) * 100);
    }, [hasDiscount, product.Product_price, product.discounted_price]);

    const sellingPrice = product.Product_price;

    const hasRating =
      typeof product.Product_rating === "number" &&
      !isNaN(product.Product_rating) &&
      product.Product_rating > 0;

    const hasReviewCount =
      typeof product.Product_reviewCount === "number" &&
      !isNaN(product.Product_reviewCount) &&
      product.Product_reviewCount > 0;

    const ratingValue = hasRating ? product.Product_rating! : 0;

    return (
      <motion.div
        layout
        onClick={() => onClick(product._id)}
        className="group relative flex flex-col h-full bg-[#FFFBF7] md:bg-white rounded-2xl border border-orange-100/60 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300 overflow-hidden cursor-pointer p-2.5 md:p-3"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        {/* Image Container - Rounded corners INSIDE the card */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50 mb-3">
          {product.Product_image?.[0] ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <SpiritualSymbol />
                </div>
              )}
              <img
                src={product.Product_image[0]}
                alt={product.Product_name}
                loading="lazy"
                className={`w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <SpiritualSymbol />
            </div>
          )}

          {/* New Badge */}
          {product.isNew && (
            <div className="absolute top-2 left-2 z-10">
              <Badge className="bg-green-600 text-white text-[10px] px-2 py-0.5 border-0 shadow-sm font-bold tracking-wide">
                NEW
              </Badge>
            </div>
          )}

          {/* Wishlist Button - Floating on top right */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onWishlistToggle(e, product);
            }}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-sm backdrop-blur-sm transition-colors ${
              inWishlist
                ? "bg-red-50 text-red-500"
                : "bg-white/80 text-gray-500 hover:text-orange-600"
            }`}
          >
            <Heart size={16} fill={inWishlist ? "currentColor" : "none"} />
          </motion.button>
        </div>

        {/* Content Section - Aligned to match reference */}
        <div className="flex flex-col flex-1 px-1">
          {/* Title - Bold and Dark */}
          <h3
            className="text-[13px] md:text-[15px] font-bold text-gray-900 line-clamp-2 break-words leading-snug mb-1.5"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {product.Product_name}
          </h3>

          {/* Rating - Orange Stars + Count */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className="w-3 h-3 md:w-3.5 md:h-3.5"
                  fill={ratingValue >= index + 1 ? "#F59E0B" : "transparent"}
                  stroke={ratingValue >= index + 1 ? "#F59E0B" : "#D1D5DB"}
                  strokeWidth={2}
                />
              ))}
            </div>
            <span className="text-[11px] text-gray-500 font-medium pt-0.5">
              {hasReviewCount ? `(${product.Product_reviewCount})` : "(0)"}
            </span>
          </div>

          {/* Price Section - Matched to Reference (Black Badge) */}
          <div className="mt-auto pt-1 flex items-center flex-wrap gap-x-2 gap-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-gray-500 font-medium">From</span>
              <span className="text-base md:text-lg font-extrabold text-gray-900">
                {currency(sellingPrice)}
              </span>
            </div>

            {product.discounted_price && product.discounted_price !== sellingPrice && (
              <span className="text-xs text-gray-400 line-through decoration-gray-400">
                {currency(product.discounted_price)}
              </span>
            )}

            {/* The Black Pill Badge from Reference */}
            {hasDiscount && discountPercentage > 0 && (
              <span className="bg-black text-white text-[10px] md:text-[11px] font-bold px-1.5 py-0.5 rounded-[4px]">
                {discountPercentage}% OFF
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  }
);

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<
    { _id: string; name: string; slug: string }[]
  >([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [directBuyProduct, setDirectBuyProduct] = useState<ApiProduct | null>(
    null
  );

  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const phoneVerification = usePhoneVerification();
  const { processPayment } = usePaymentProcessing();

  const initialLimit = 10;
  const loadMoreCount = 10;

  const getCurrentPrice = (p: ApiProduct) => {
    return p.Product_price;
  };

  const calculateAverageRating = (reviews: { rating: number }[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => {
      const value = typeof review.rating === "number" ? review.rating : 0;
      return sum + value;
    }, 0);
    return Math.round((total / reviews.length) * 10) / 10;
  };

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/getAllData`, {
        timeout: 10000,
      });
      if (Array.isArray(res.data?.data?.categories)) {
        setCategories(res.data.data.categories);
      }
    } catch (e) {
      console.error("Failed to fetch categories", e);
    }
  }, []);

  const fetchProducts = useCallback(
    async (
      limit: number,
      skip: number = 0,
      append: boolean = false,
      categorySlug: string = ""
    ) => {
      try {
        setLoadingMore(append);
        let url = `${API_URL}/api/getproducts?limit=${limit}&skip=${skip}`;
        if (categorySlug)
          url += `&category=${encodeURIComponent(categorySlug)}`;
        const res = await axios.get(url, { timeout: 10000 });
        const incoming: ApiProduct[] = res.data.products || [];

        const incomingWithReviews: ApiProduct[] = await Promise.all(
          incoming.map(async (product) => {
            try {
              const reviewRes = await axios.get(
                `${API_URL}/review/get/${product._id}`,
                { timeout: 10000 }
              );
              const reviews = reviewRes.data?.data || [];
              const averageRating = calculateAverageRating(reviews);

              return {
                ...product,
                Product_rating: averageRating,
                Product_reviewCount: Array.isArray(reviews)
                  ? reviews.length
                  : 0,
              };
            } catch (err) {
              return {
                ...product,
                Product_rating: product.Product_rating || 0,
                Product_reviewCount: product.Product_reviewCount || 0,
              };
            }
          })
        );

        setProducts(
          append
            ? (prev) => [...prev, ...incomingWithReviews]
            : incomingWithReviews
        );
        setTotalProducts(res.data.totalProducts || incoming.length);
        setHasMore(incoming.length === limit);
      } catch (err) {
        toast({
          title: "Divine Error",
          description: "Failed to load sacred products.",
          variant: "destructive",
        });
      } finally {
        setLoadingMore(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts(initialLimit, 0, false, selectedCategory);
  }, [fetchProducts, selectedCategory]);

  useEffect(() => {
    if (phoneVerification.phoneVerified && directBuyProduct) {
      handleDirectBuyPayment(directBuyProduct);
    }
  }, [phoneVerification.phoneVerified, directBuyProduct]);

  const handleLoadMore = useCallback(() => {
    fetchProducts(loadMoreCount, products.length, true, selectedCategory);
  }, [fetchProducts, loadMoreCount, products.length, selectedCategory]);

  const handleWishlistToggle = useCallback(
    (e: React.MouseEvent, product: ApiProduct) => {
      e.stopPropagation();
      if (!user) return navigate("/login");

      // Normalize product shape to match WishlistContext expectations
      const wishlistProduct = {
        _id: product._id,
        Product_name: product.Product_name,
        Product_price: product.Product_price,
        Product_image: product.Product_image,
        isNew: product.isNew,
        category: product.Product_category?.category,
        description:
          product.Product_description || product.Product_discription,
        Product_available: product.Product_available,
        Product_category: product.Product_category,
      };

      const wasInWishlist = isInWishlist(product._id);
      toggleWishlist(wishlistProduct);
      toast({
        title: wasInWishlist ? "Removed from collection" : "Added to collection",
        description: product.Product_name,
        duration: 1400,
      });
    },
    [isInWishlist, navigate, toggleWishlist, user]
  );

  const handleAddToCart = useCallback(
    (product: ApiProduct) => {
      if (!user) return navigate("/login");

      const currentPrice = getCurrentPrice(product);
      const originalPrice = product.Product_price;

      addToCart({
        id: parseInt(product._id.slice(-8), 16),
        _id: product._id,
        name: product.Product_name,
        price: currency(currentPrice),
        originalPrice: currency(originalPrice),
        image: product.Product_image[0] || "",
        isNew: product.isNew || false,
        quantity: 1,
      });
      toast({
        title: "Added to cart",
        description: product.Product_name,
        duration: 1600,
      });
    },
    [addToCart, navigate, user]
  );

  const handleDirectBuy = useCallback(
    (product: ApiProduct) => {
      if (!user) {
        toast({ title: "Please login", variant: "destructive" });
        navigate("/login");
        return;
      }
      setDirectBuyProduct(product);
      phoneVerification.setShowPhoneVerification(true);
    },
    [navigate, user, phoneVerification]
  );

  const handleDirectBuyPayment = async (product: ApiProduct) => {
    if (!phoneVerification.phoneVerified) return;

    const currentPrice = getCurrentPrice(product);
    const orderItems = [
      {
        productId: product._id,
        quantity: 1,
        price: currentPrice,
        originalPrice: product.Product_price,
        name: product.Product_name,
        image: product.Product_image[0] || "",
      },
    ];

    const shippingAddress = {
      fullName: user?.firstName || "Customer",
      address: "To be provided",
      city: "To be provided",
      state: "To be provided",
      pinCode: "000000",
      phone: phoneVerification.phoneNumber,
    };

    const success = await processPayment(
      orderItems,
      shippingAddress,
      "online",
      {
        itemsTotal: currentPrice,
        deliveryCharge: 0,
        totalAmount: currentPrice,
      },
      "cart"
    );

    if (success) {
      setDirectBuyProduct(null);
      phoneVerification.resetPhoneVerification();
      toast({
        title: "Order Placed Successfully!",
        description: product.Product_name,
        duration: 2000,
      });
    }
  };

  const handleProductClick = useCallback(
    (productId: string) => {
      navigate(`/product/${productId}`);
    },
    [navigate]
  );

  return (
    <>
      <section className="relative pt-2 md:pt-4 pb-0 md:pb-0 bg-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <motion.header
            className="mb-10 text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 mb-3 bg-orange-50 rounded-full px-3 py-1 border border-orange-100">
              <Sparkles className="w-3 h-3 text-orange-500" />
              <span className="text-xs font-medium text-orange-700 uppercase tracking-wide">
                Sacred Selections
              </span>
            </div>
            <h2
              className="text-2xl md:text-4xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Divine{" "}
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Products
              </span>
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Discover blessed malas, sacred murtis, and spiritual artifacts.
            </p>
          </motion.header>

          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide justify-start md:justify-center">
            <Button
              size="sm"
              variant={selectedCategory === "" ? "default" : "outline"}
              onClick={() => setSelectedCategory("")}
              className={`rounded-full whitespace-nowrap px-4 ${
                selectedCategory === ""
                  ? "bg-orange-600 hover:bg-orange-700 text-white border-0"
                  : "border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-700"
              }`}
            >
              All Items
            </Button>
            {categories.slice(0, 5).map((cat) => (
              <Button
                key={cat._id}
                size="sm"
                variant={selectedCategory === cat.slug ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.slug || "")}
                className={`rounded-full whitespace-nowrap px-4 ${
                  selectedCategory === cat.slug
                    ? "bg-orange-600 text-white"
                    : "border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-700"
                }`}
              >
                {cat.name}
              </Button>
            ))}
          </div>

          {/* Grid Layout - show message when no products for selected category */}
          {products.length === 0 ? (
            <div className="py-10 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6 text-orange-400" />
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                No products in this category yet
              </p>
              <p className="text-xs text-gray-500 max-w-sm">
                Please try a different category or check back soon for new divine additions.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6 mb-0 items-stretch">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onClick={handleProductClick}
                    onWishlistToggle={handleWishlistToggle}
                    onAddToCart={handleAddToCart}
                    onDirectBuy={handleDirectBuy}
                    inWishlist={isInWishlist(product._id)}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="rounded-full px-8 py-6 border-orange-200 text-orange-700 hover:bg-orange-50 hover:text-orange-800"
                  >
                    {loadingMore ? "Loading Blessings..." : "Load More"}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <PhoneVerificationModal
        showPhoneVerification={phoneVerification.showPhoneVerification}
        phoneNumber={phoneVerification.phoneNumber}
        setPhoneNumber={phoneVerification.setPhoneNumber}
        otp={phoneVerification.otp}
        setOtp={phoneVerification.setOtp}
        otpInputRefs={phoneVerification.otpInputRefs}
        otpTimer={phoneVerification.otpTimer}
        showOTPInput={phoneVerification.showOTPInput}
        setShowOTPInput={phoneVerification.setShowOTPInput}
        isVerifyingPhone={phoneVerification.isVerifyingPhone}
        isVerifyingOTP={phoneVerification.isVerifyingOTP}
        handlePhoneVerification={phoneVerification.handlePhoneVerification}
        handleOTPVerification={phoneVerification.handleOTPVerification}
        handleResendOTP={phoneVerification.handleResendOTP}
        resetPhoneVerification={phoneVerification.resetPhoneVerification}
      />
    </>
  );
};

export default FeaturedProducts;