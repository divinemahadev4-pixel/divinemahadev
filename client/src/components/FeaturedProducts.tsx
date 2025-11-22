import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Star,
  ShoppingCart,
  Eye,
  Sparkles,
  Sun,
  Zap,
  CreditCard,
} from "lucide-react";
import { useWishlist } from "./WishlistContext";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
// Import phone verification and payment processing
import { usePhoneVerification } from "@/hooks/usePhoneVerification";
import { usePaymentProcessing } from "@/hooks/usePaymentProcessing";
import PhoneVerificationModal from "@/components/PhoneVerificationModal";

const API_URL =
  import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";

interface ApiProduct {
  _id: string;
  Product_name: string;
  Product_price: number;
  discounted_price: number; // New field - this is the actual price
  Product_image: string[];
  Product_rating?: number;
  isNew?: boolean;
  Product_discription?: string;
  Product_description?: string;
  Product_available?: boolean;
  Product_category?: { category: string; slug?: string };
}



const currency = (n: number) => `₹${n.toLocaleString()}`;

// Spiritual Symbol Component with cleaner design
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
    onAddToCart,
    inWishlist,
    onDirectBuy,
  }) => {
    const [adding, setAdding] = useState(false);
    const [buying, setBuying] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // FIXED: Product_price is selling price, discounted_price is MRP (original/higher price)
    const hasDiscount = useMemo(() => {
      const mrp = product.discounted_price as any;
      const sellingPrice = product.Product_price;
      
      // Debug log for first few products
      if (product.Product_name.includes("Test")) {
        console.log(`🔍 Product: ${product.Product_name}`);
        console.log(`   Selling Price: ${sellingPrice}`);
        console.log(`   MRP (discounted_price): ${mrp}`);
        console.log(`   Has Discount: ${typeof mrp === "number" && !isNaN(mrp) && mrp > 0 && mrp > sellingPrice}`);
      }
      
      return (
        typeof mrp === "number" &&
        !isNaN(mrp) &&
        mrp > 0 &&
        mrp > sellingPrice // MRP should be higher than selling price
      );
    }, [product.Product_price, product.discounted_price, product.Product_name]);

    // Calculate discount percentage: (MRP - Selling Price) / MRP * 100
    const discountPercentage = useMemo(() => {
      if (!hasDiscount) return 0;
      const mrp = product.discounted_price as number;
      const sellingPrice = product.Product_price;
      return Math.round(((mrp - sellingPrice) / mrp) * 100);
    }, [hasDiscount, product.Product_price, product.discounted_price]);

    // Get prices - Product_price is selling price, discounted_price is MRP
    const sellingPrice = product.Product_price; // Current selling price (lower)
    const mrpPrice = hasDiscount
      ? (product.discounted_price as number)
      : product.Product_price; // MRP/Original price (higher)

    const handleAdd = () => {
      if (adding) return;
      setAdding(true);
      onAddToCart(product);
      setTimeout(() => setAdding(false), 700);
    };

    const handleDirectBuy = () => {
      if (buying) return;
      setBuying(true);
      onDirectBuy(product);
      setTimeout(() => setBuying(false), 700);
    };

    const description =
      product.Product_description ||
      product.Product_discription ||
      "Blessed spiritual item with divine energy.";

    return (
      <motion.div
        tabIndex={0}
        onClick={() => onClick(product._id)}
        className="group bg-white border border-orange-100/50 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col focus:outline-none focus:ring-1 focus:ring-orange-200 overflow-hidden"
        aria-label={product.Product_name}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ duration: 0.4 }}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-white">
          {product.Product_image?.[0] ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 bg-white flex items-center justify-center">
                  <SpiritualSymbol />
                </div>
              )}
              <img
                src={product.Product_image[0]}
                alt={product.Product_name}
                loading="lazy"
                className={`block w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-105 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            </>
          ) : (
            <div className="w-full h-full bg-white text-orange-700 flex items-center justify-center select-none">
              <SpiritualSymbol />
            </div>
          )}

          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/10" />

          {/* Product Status Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {product.isNew && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              >
                <Badge className="bg-gradient-to-r from-emerald-400 to-green-500 text-white font-semibold text-xs px-2 py-1 border-0 shadow-sm">
                  <Zap className="w-3 h-3 mr-1" />
                  NEW
                </Badge>
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <motion.button
            className={`absolute top-3 left-3 rounded-full p-1.5 bg-white/95 backdrop-blur-sm border border-orange-200/50 shadow-sm hover:bg-white transition-all duration-200 ${inWishlist
              ? "text-rose-500"
              : "text-orange-400 hover:text-rose-400"
              }`}
            onClick={(e) => {
              e.stopPropagation();
              onWishlistToggle(e, product);
            }}
            aria-pressed={inWishlist}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Heart size={14} fill={inWishlist ? "currentColor" : "none"} />
          </motion.button>

          <motion.button
            className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm shadow-sm border border-orange-200/50 rounded-full p-1.5 hover:bg-white transition-all duration-200 text-orange-500 hover:text-orange-600"
            onClick={(e) => {
              e.stopPropagation();
              onClick(product._id);
            }}
            aria-label="View product details"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye size={14} />
          </motion.button>
        </div>

        {/* Product Info - Clean white design - Mobile Optimized */}
        <div className="flex flex-col flex-1 p-2.5 sm:p-3 md:p-4 bg-white">
          <h3
            className="text-[11px] sm:text-xs md:text-sm font-semibold text-gray-900 line-clamp-2 mb-1 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {product.Product_name}
          </h3>
          <p
            className="text-[10px] sm:text-[11px] md:text-xs text-gray-600 line-clamp-2 mb-2 md:mb-3 leading-relaxed hidden md:block"
            title={description}
          >
            {description}
          </p>

          {typeof product.Product_rating === "number" && product.Product_rating > 0 && (
            <div className="flex items-center gap-1 mb-1.5 md:mb-2">
              <div className="flex items-center bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">
                <Star className="w-3 h-3 fill-amber-400 stroke-none" />
                <span className="text-[11px] font-semibold ml-0.5">
                  {product.Product_rating.toFixed(1)}
                </span>
              </div>
              <span className="text-[10px] text-gray-500">
                Top rated item
              </span>
            </div>
          )}

          <div className="mt-auto space-y-1.5 md:space-y-2.5">
            {/* Price Section with Discount - Mobile Optimized */}
            <div className="space-y-1">
              {/* Selling Price (Main Price) */}
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-[11px] md:text-xs text-gray-600 font-medium">
                  From
                </span>
                <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                  {currency(sellingPrice)}
                </span>

                {/* MRP with strikethrough - Show if discounted_price exists and is different */}
                {product.discounted_price && product.discounted_price !== sellingPrice && (
                  <span className="text-[11px] sm:text-xs md:text-sm text-gray-400 line-through">
                    {currency(product.discounted_price)}
                  </span>
                )}

                {hasDiscount && discountPercentage > 0 && (
                  <span className="ml-auto text-[10px] md:text-xs font-semibold text-white bg-gray-900 px-2 py-0.5 rounded-sm">
                    {discountPercentage}% OFF
                  </span>
                )}
              </div>
            </div>
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

  // Phone verification and payment processing hooks
  const phoneVerification = usePhoneVerification();
  const { processPayment } = usePaymentProcessing();

  const initialLimit = 10;
  const loadMoreCount = 10;

  // Helper to get selling price (Product_price is always the selling price)
  const getCurrentPrice = (p: ApiProduct) => {
    return p.Product_price; // Product_price is the selling price
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
        setProducts(append ? (prev) => [...prev, ...incoming] : incoming);
        setTotalProducts(res.data.totalProducts || incoming.length);
        setHasMore(incoming.length === limit);
      } catch (err) {
        toast({
          title: "Divine Error",
          description: "Failed to load sacred products. Please try again.",
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

  // Handle phone verification for direct buy
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
      toggleWishlist(product);
      toast({
        title: isInWishlist(product._id)
          ? "Removed from sacred collection"
          : "Added to sacred collection",
        description: product.Product_name,
        duration: 1400,
      });
    },
    [isInWishlist, navigate, toggleWishlist, user]
  );

  const handleAddToCart = useCallback(
    (product: ApiProduct) => {
      if (!user) return navigate("/login");

      // Determine current price safely
      const currentPrice = getCurrentPrice(product);
      const originalPrice = product.Product_price;

      addToCart({
        id: parseInt(product._id.slice(-8), 16),
        _id: product._id,
        name: product.Product_name,
        price: currency(currentPrice), // Current price (discounted_price if available)
        originalPrice: currency(originalPrice), // Original price (Product_price)
        image: product.Product_image[0] || "",
        isNew: product.isNew || false,
        quantity: 1,
      });
      toast({
        title: "Added to divine cart",
        description: `${product.Product_name} - Blessed with positive energy`,
        duration: 1600,
      });
    },
    [addToCart, navigate, user]
  );

  const handleDirectBuy = useCallback(
    (product: ApiProduct) => {
      if (!user) {
        toast({
          title: "Please login",
          description: "You need to be logged in to buy directly",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      setDirectBuyProduct(product);
      phoneVerification.setShowPhoneVerification(true);
    },
    [navigate, user, phoneVerification]
  );

  const handleDirectBuyPayment = async (product: ApiProduct) => {
    if (!phoneVerification.phoneVerified) {
      toast({
        title: "Phone Not Verified",
        description: "Please verify your phone number first",
        variant: "destructive",
      });
      return;
    }

    // Determine current price safely for payment
    const currentPrice = getCurrentPrice(product);

    const orderItems = [
      {
        productId: product._id,
        quantity: 1,
        price: currentPrice, // Use the current price (discounted_price if available)
        originalPrice: product.Product_price, // Include original price
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
      "online", // Default to online payment for direct buy
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
        description: `${product.Product_name} - Your divine item is on its way`,
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
      <section className="relative pt-12 pb-8 md:pt-20 md:pb-12 bg-white">
        <div className="relative max-w-7xl mx-auto px-2 sm:px-4">
          {/* Header Section */}
          <motion.header
            className="mb-10 text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
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
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
              Discover blessed malas, sacred murtis, and spiritual artifacts
              filled with divine energy
            </p>
            {totalProducts > 0 && (
              <p className="mt-2 text-gray-500 font-medium text-xs md:text-sm">
                Showing {products.length}
                {totalProducts > products.length
                  ? ` of ${totalProducts}`
                  : ""}{" "}
                blessed items
              </p>
            )}
          </motion.header>

          {/* Category Filters - Clean white design */}
          <div className="flex gap-2 mb-10 px-2 overflow-scroll">
            <Button
              size="sm"
              variant={selectedCategory === "" ? "default" : "outline"}
              onClick={() => setSelectedCategory("")}
              className="rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0 shadow-sm"
            >
              All Items
            </Button>
            {categories.slice(0, 4).map((cat) => (
              <Button
                key={cat._id}
                size="sm"
                variant={selectedCategory === cat.slug ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.slug || "")}
                className="rounded-full px-2.5 py-1.5 text-xs font-medium transition-all duration-200 border border-gray-200 text-gray-700 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700"
              >
                {cat.name}
              </Button>
            ))}
          </div>

          {/* Products Grid - Responsive columns */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-3 md:gap-4 mb-8 md:mb-10">
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

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center px-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="border border-gray-300 text-gray-700 px-6 md:px-10 py-3 md:py-4 rounded-full font-medium hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 transition-all duration-200 text-sm md:text-base shadow-sm hover:shadow w-full md:w-auto"
              >
                {loadingMore ? (
                  <div className="flex items-center gap-2 md:gap-2">
                    <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs md:text-sm">Loading...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="text-xs md:text-sm">
                      Load More Blessings
                    </span>
                  </div>
                )}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Phone Verification Modal for Direct Buy */}
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
