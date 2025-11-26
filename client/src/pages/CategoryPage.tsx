import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosConfig";
import { Sparkles, Search, SortAsc, Heart, ShoppingCart, Eye, Crown, CreditCard, Star } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceHighlights from "@/components/serviceHighlight";

import { Button } from "@/components/ui/button";
import { useWishlist } from "@/components/WishlistContext";
import { useCart } from "@/components/CartContext";
import { useAuth } from "@/components/AuthContext";
import { toast } from "@/hooks/use-toast";

// Import phone verification and payment processing
import { usePhoneVerification } from "@/hooks/usePhoneVerification";
import { usePaymentProcessing } from "@/hooks/usePaymentProcessing";
import PhoneVerificationModal from "@/components/PhoneVerificationModal";

interface Product {
  _id: string;
  Product_name: string;
  Product_price: number;
  Product_discription: string;
  Product_category: string;
  Product_image: string[];
  isNew?: boolean;
  Product_available?: boolean;
  Product_rating?: number;
  Product_reviewCount?: number;
}

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high'>('name');
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [directBuyProduct, setDirectBuyProduct] = useState<Product | null>(null);
  const [buyingProductId, setBuyingProductId] = useState<string | null>(null);

  const navigate = useNavigate();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  // Phone verification and payment processing hooks
  const phoneVerification = usePhoneVerification();
  const { checkoutLoading, processPayment } = usePaymentProcessing();

  // Handle phone verification for direct buy
  useEffect(() => {
    if (phoneVerification.phoneVerified && directBuyProduct) {
      handleDirectBuyPayment(directBuyProduct);
    }
  }, [phoneVerification.phoneVerified, directBuyProduct]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryName) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const res = await axiosInstance.get(
          `/api/getproductsbycategory?category=${categoryName}`
        );
        
        const productsData = res.data.product || res.data.products || [];
        setProducts(productsData);
        
        if (productsData.length === 0) {
          console.warn('No products found for category:', categoryName);
        }
        
      } catch (error: any) {
        console.error("Failed to load products for category:", categoryName, error);
        
        const errorMessage = error.response?.status === 404 
          ? `No products found in ${categoryName} category`
          : `Failed to load ${categoryName} products. Please try again.`;
          
        toast({
          title: "Error loading products",
          description: errorMessage,
          duration: 3000,
        });
        
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName, toast]);

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.Product_price - b.Product_price;
      case 'price-high':
        return b.Product_price - a.Product_price;
      case 'name':
      default:
        return a.Product_name.localeCompare(b.Product_name);
    }
  });

  const handleWishlistToggle = (e: React.MouseEvent, product: Product): void => {
    e.stopPropagation();
    if (user) {
      const wishlistProduct = {
        _id: product._id,
        Product_name: product.Product_name,
        Product_price: product.Product_price,
        Product_image: product.Product_image,
        isNew: product.isNew,
        category: product.Product_category,
        description: product.Product_discription
      };
      
      const wasInWishlist = isInWishlist(product._id);
      toggleWishlist(wishlistProduct);
      
      toast({ 
        title: wasInWishlist ? "Removed from sacred collection" : "Added to sacred collection",
        description: wasInWishlist 
          ? `${product.Product_name} removed from your sacred collection` 
          : `${product.Product_name} added to your sacred collection`,
        duration: 2000 
      });
    } else {
      navigate("/login");
    }
  };

  const handleAddToCart = (product: Product): void => {
    if (user) {
      try {
        const cartProduct = {
          id: parseInt(product._id.slice(-8), 16),
          _id: product._id,
          name: product.Product_name,
          price: `₹${product.Product_price}`,
          originalPrice: `₹${product.Product_price}`,
          image: product.Product_image[0] || '',
          rating: product.Product_rating || 4.5,
          isNew: product.isNew || false,
          quantity: 1,
          Product_name: product.Product_name,
          Product_price: product.Product_price,
          Product_image: product.Product_image,
          Product_available: product.Product_available
        };
        
        addToCart(cartProduct);
        toast({ 
          title: "Added to divine cart", 
          description: `${product.Product_name} has been added to your cart with blessings`,
          duration: 3000 
        });
      } catch (error) {
        console.error('Error adding to cart:', error);
        toast({
          title: "Divine Error",
          description: "Failed to add to cart. Please try again.",
          duration: 2000,
        });
      }
    } else {
      navigate("/login");
    }
  };

  const handleDirectBuy = (product: Product): void => {
    if (!user) {
      toast({ 
        title: "Please login", 
        description: "You need to be logged in to buy directly", 
        variant: "destructive" 
      });
      navigate("/login");
      return;
    }
    
    setBuyingProductId(product._id);
    setDirectBuyProduct(product);
    phoneVerification.setShowPhoneVerification(true);
    
    // Reset buying state after a delay
    setTimeout(() => setBuyingProductId(null), 700);
  };

  const handleDirectBuyPayment = async (product: Product) => {
    if (!phoneVerification.phoneVerified) {
      toast({ 
        title: "Phone Not Verified", 
        description: "Please verify your phone number first", 
        variant: "destructive" 
      });
      return;
    }

    const orderItems = [{
      productId: product._id,
      quantity: 1,
      price: product.Product_price,
      name: product.Product_name,
      image: product.Product_image[0] || ""
    }];

    const shippingAddress = {
      fullName: user?.firstName || "",
      address: "",
      city: "",
      state: "",
      pinCode: "",
      phone: phoneVerification.phoneNumber
    };

    const success = await processPayment(
      orderItems,
      shippingAddress,
      "online",
      {
        itemsTotal: product.Product_price,
        deliveryCharge: 0,
        totalAmount: product.Product_price
      }
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

  const handleProductClick = (productId: string): void => {
    navigate(`/product/${productId}`);
  };

  const SkeletonCard = () => (
    <div 
      className="bg-white rounded-xl border border-amber-200 shadow-lg overflow-hidden animate-pulse"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,.98) 0%, rgba(254,243,231,.98) 60%, rgba(254,215,170,.98) 100%)",
      }}
    >
      <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-50"></div>
      <div className="p-4">
        <div className="h-4 bg-amber-200 rounded mb-2"></div>
        <div className="h-6 bg-gradient-to-r from-amber-200 to-amber-100 rounded mb-3"></div>
        <div className="h-10 bg-amber-200 rounded-lg"></div>
      </div>
    </div>
  );

  return (
    <div 
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #fef3e7 40%, #fed7aa 100%)",
      }}
    >
      <AnnouncementBar />
      <Header />
      
      {/* Premium Hero Section */}
      <div className="pt-24 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-400/5 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-100/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-4 lg:px-6 relative">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-50 text-amber-700 px-5 py-2 rounded-full text-sm font-semibold mb-6 border border-amber-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Crown className="w-4 h-4" />
              Divine Mahadev Premium
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-amber-800 via-amber-700 to-orange-900 bg-clip-text text-transparent mb-6 capitalize leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {categoryName} Collection
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-amber-600 mb-8 leading-relaxed font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Discover our blessed selection of sacred {categoryName} pieces, meticulously crafted with divine energy and spiritual blessings
            </motion.p>
            
            {!loading && products.length > 0 && (
              <motion.div 
                className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-sm border border-amber-200 rounded-full px-6 py-3 text-sm shadow-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <span className="text-amber-800 font-bold">
                  {products.length} Divine Product{products.length !== 1 ? 's' : ''}
                </span>
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                <span className="text-amber-600 font-medium">
                  Blessed Quality
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Controls Section */}
      {!loading && products.length > 0 && (
        <div className="bg-white/90 backdrop-blur-md border-y border-amber-200 sticky top-0 z-30 shadow-sm">
          <div className="container mx-auto px-4 lg:px-6 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-amber-700 font-semibold">
                  {products.length} Sacred Items
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <SortAsc className="w-4 h-4 text-amber-600" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white border-2 border-amber-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all duration-300 shadow-sm hover:shadow-md w-full sm:min-w-[160px]"
                >
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-6 py-8 lg:py-12">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 lg:py-24">
            <div 
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-12 max-w-md mx-auto shadow-xl border border-amber-200"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,.98) 0%, rgba(254,243,231,.98) 60%, rgba(254,215,170,.98) 100%)",
              }}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-amber-200 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-amber-600" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-amber-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Sacred Collection Empty
              </h3>
              <p className="text-base text-amber-600 mb-6 leading-relaxed">
                We're blessing the perfect {categoryName} collection for you. Check back soon for divine additions!
              </p>
              <Button
                variant="outline"
                className="rounded-full px-8 py-3 border-2 border-amber-300 text-amber-700 hover:bg-amber-50 font-semibold"
                onClick={() => window.history.back()}
              >
                ← Return to Collections
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Premium Products Grid */}
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, staggerChildren: 0.1 }}
            >
              {sortedProducts.map((product, index) => {
                const isHovered = hoveredProduct === product._id;
                const inWishlist = isInWishlist(product._id);
                const isBuying = buyingProductId === product._id;

                return (
                  <motion.div
                    key={product._id}
                    className="group rounded-xl border border-amber-200 shadow-lg hover:shadow-2xl hover:shadow-amber-300/20 transition-all duration-500 overflow-hidden flex flex-col hover:-translate-y-2 hover:scale-[1.02] bg-white h-full"

                    onMouseEnter={() => setHoveredProduct(product._id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    {/* Product Image */}
                    <div
                      className="relative aspect-square overflow-hidden cursor-pointer rounded-t-xl bg-gradient-to-br from-amber-50 to-orange-50"
                      onClick={() => handleProductClick(product._id)}
                    >
                      <img
                        src={product.Product_image[0]}
                        alt={product.Product_name}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      
                      {/* Overlay effects */}
                      <div className="absolute inset-0 bg-gradient-to-t from-amber-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Premium Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        {product.isNew && (
                          <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg backdrop-blur-sm border border-white/20">
                            <Sparkles size={8} className="inline mr-1" />
                            NEW
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute top-3 right-3 flex flex-col gap-1">
                        <Button
                          variant="secondary"
                          size="icon"
                          className={`w-8 h-8 rounded-full backdrop-blur-md border transition-all duration-300 ${
                            inWishlist
                              ? "bg-gradient-to-r from-rose-500 to-pink-500 border-rose-400/50 text-white hover:from-rose-600 hover:to-pink-600 shadow-lg shadow-rose-300/40"
                              : "bg-white/80 border-amber-200 text-amber-600 hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 hover:border-rose-400/50 hover:text-white"
                          } ${isHovered ? 'scale-110 shadow-xl' : 'shadow-lg'}`}
                          onClick={(e) => handleWishlistToggle(e, product)}
                        >
                          <Heart
                            size={13}
                            fill={inWishlist ? "currentColor" : "none"}
                          />
                        </Button>
                        
                        <Button
                          variant="secondary"
                          size="icon"
                          className={`w-8 h-8 rounded-full bg-white/80 backdrop-blur-md border-amber-200 text-amber-600 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-600 hover:text-white hover:border-amber-400/50 transition-all duration-300 shadow-lg ${
                            isHovered ? 'scale-110 shadow-xl' : ''
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(product._id);
                          }}
                        >
                          <Eye size={13} />
                        </Button>
                      </div>

                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1200 ease-out" />
                    </div>

                    {/* Product Info */}
                    <div className="p-4 flex-grow flex flex-col bg-transparent">
                      <div className="mb-3">
                        <h3
                          className="font-bold text-sm text-gray-900 line-clamp-2 leading-tight cursor-pointer hover:text-amber-600 transition-colors mb-1 min-h-[40px]"
                          style={{ fontFamily: "'Playfair Display', serif" }}
                          onClick={() => handleProductClick(product._id)}
                        >
                          {product.Product_name}
                        </h3>

                        {typeof product.Product_rating === "number" && product.Product_rating > 0 && (
                          <div className="flex items-center gap-1">
                            <div className="flex items-center bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">
                              <Star className="w-3 h-3 fill-amber-400 stroke-none" />
                              <span className="text-[11px] font-semibold ml-0.5">
                                {product.Product_rating.toFixed(1)}
                              </span>
                            </div>
                            {typeof product.Product_reviewCount === "number" && product.Product_reviewCount > 0 && (
                              <span className="text-[10px] text-gray-500">
                                ({product.Product_reviewCount.toLocaleString()} reviews)
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="mt-auto">
                        {/* Price Section */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-base font-bold text-amber-600">
                            ₹{product.Product_price.toLocaleString()}
                          </span>
                        </div>

                        {/* Action Buttons - Column Layout */}
                        <div className="space-y-2">
                          {/* Add to Cart Button */}
                          <Button
                            className="w-full rounded-xl py-2 text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border border-amber-600 backdrop-blur-sm"
                            onClick={() => handleAddToCart(product)}
                          >
                            <ShoppingCart size={12} className="mr-1 group-hover:scale-110 transition-transform" />
                            Add to Cart
                          </Button>

                          {/* Buy Now Button */}
                          <Button
                            className="w-full rounded-xl py-2 text-xs font-semibold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border border-amber-700 backdrop-blur-sm"
                            onClick={() => handleDirectBuy(product)}
                            disabled={isBuying}
                          >
                            {isBuying ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <Sparkles className="w-3 h-3" />
                              </motion.div>
                            ) : (
                              <>
                                <CreditCard size={12} className="mr-1" />
                                Buy Now
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Premium Results Summary */}
            <motion.div 
              className="text-center mt-16 pt-8 border-t border-amber-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-100 to-orange-50 text-amber-700 px-8 py-4 rounded-full text-sm font-bold shadow-lg border border-amber-200">
                <Crown className="w-5 h-5" />
                Discovered {products.length} divine product{products.length !== 1 ? 's' : ''} in {categoryName}
              </div>
            </motion.div>
          </>
        )}
      </div>

      <ServiceHighlights />
      <Footer />

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
    </div>
  );
};

export default CategoryPage;