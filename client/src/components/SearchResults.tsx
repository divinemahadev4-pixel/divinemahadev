import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  SortAsc, 
  Grid, 
  List, 
  ArrowLeft, 
  Star,
  Heart,
  ShoppingCart,
  Eye,
  Sparkles,
  Crown,
  Gem,
  CreditCard,
  Sun
} from 'lucide-react';
import Fuse from 'fuse.js';
import { motion } from 'framer-motion';

// Import phone verification and payment processing
import { usePhoneVerification } from "@/hooks/usePhoneVerification";
import { usePaymentProcessing } from "@/hooks/usePaymentProcessing";
import PhoneVerificationModal from "@/components/PhoneVerificationModal";

// Import contexts
import { useWishlist } from "@/components/WishlistContext";
import { useCart } from "@/components/CartContext";
import { useAuth } from "@/components/AuthContext";
import { toast } from "@/hooks/use-toast";

interface Product {
  _id: string;
  Product_name: string;
  Product_price: number;
  Product_image: string[];
  Product_category: {
    category: string;
  };
  Product_discription?: string;
  Product_available: boolean;
  isNew?: boolean;
  score?: number;
  matches?: readonly any[]; 
  deliveryCharge?: number;
}

// Spiritual Symbol Component
const SpiritualSymbol = () => (
  <div className="relative w-14 h-14 flex items-center justify-center">
    <motion.div
      className="absolute w-10 h-10 bg-amber-100/50 rounded-full"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    <Sun className="w-6 h-6 text-amber-500" fill="currentColor" fillOpacity="0.3" />
  </div>
);

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'relevance' | 'price-low' | 'price-high' | 'name'>('relevance');
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [directBuyProduct, setDirectBuyProduct] = useState<Product | null>(null);
  const [buyingProductId, setBuyingProductId] = useState<string | null>(null);

  // Context hooks
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

  const fuseOptions = useMemo(() => ({
    keys: [
      { name: "Product_name", weight: 0.7 },
      { name: "Product_category.category", weight: 0.2 },
      { name: "Product_discription", weight: 0.1 },
    ],
    threshold: 0.6,
    minMatchCharLength: 1,
    includeScore: true,
    includeMatches: true,
    ignoreLocation: true,
    findAllMatches: true,
    shouldSort: true,
    isCaseSensitive: false,
    distance: 100,
  }), []);

  const fuse = useMemo(() => {
    if (products.length === 0) return null;
    return new Fuse(products, fuseOptions);
  }, [products, fuseOptions]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";
        const response = await fetch(`${API_URL}/api/getproducts`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const productArray = data.products || [];
        
        setProducts(Array.isArray(productArray) ? productArray : []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!query || products.length === 0 || !fuse) {
      setSearchResults([]);
      return;
    }

    try {
      const searchResponse = fuse.search(query);

      if (searchResponse.length === 0) {
        const manualResults = products.filter(product => {
          const searchTerm = query.toLowerCase();
          return (
            (product.Product_name || '').toLowerCase().includes(searchTerm) ||
            (product.Product_discription || '').toLowerCase().includes(searchTerm) ||
            (product.Product_category?.category || '').toLowerCase().includes(searchTerm)
          );
        }).slice(0, 20);

        setSearchResults(manualResults.map(item => ({
          ...item,
          score: 0.5,
          matches: [],
        })));
      } else {
        const results = searchResponse.slice(0, 20).map((result) => ({
          ...result.item,
          score: result.score,
          matches: result.matches,
        }));
        setSearchResults(results);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    }
  }, [query, products, fuse]);

  const sortedResults = useMemo(() => {
    if (!searchResults.length) return [];

    const sorted = [...searchResults];
    
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => (a.Product_price || 0) - (b.Product_price || 0));
      case 'price-high':
        return sorted.sort((a, b) => (b.Product_price || 0) - (a.Product_price || 0));
      case 'name':
        return sorted.sort((a, b) => 
          (a.Product_name || '').localeCompare(b.Product_name || '')
        );
      case 'relevance':
      default:
        return sorted.sort((a, b) => (a.score || 0) - (b.score || 0));
    }
  }, [searchResults, sortBy]);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleWishlistToggle = (e: React.MouseEvent, product: Product): void => {
    e.stopPropagation();
    if (user) {
      const wishlistProduct = {
        _id: product._id,
        Product_name: product.Product_name,
        Product_price: product.Product_price,
        Product_image: product.Product_image,
        isNew: product.isNew,
        category: product.Product_category?.category,
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

    const perUnitDelivery = product.deliveryCharge ?? 0;
    const totalDelivery = perUnitDelivery * 1;

    const success = await processPayment(
      orderItems,
      shippingAddress,
      "online",
      {
        itemsTotal: product.Product_price,
        deliveryCharge: totalDelivery,
        totalAmount: product.Product_price + totalDelivery,
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

  const handleGoBack = () => {
    navigate(-1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen pt-20 px-4 flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #fef3e7 40%, #fed7aa 100%)",
        }}
      >
        <div className="text-center">
          <div className="relative mb-6">
            <SpiritualSymbol />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Searching Divine Collection...</h3>
          <p className="text-gray-600">Discovering blessed pieces for you</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen pt-20"
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #fef3e7 40%, #fed7aa 100%)",
      }}
    >
      <div className="container mx-auto px-4 lg:px-6 py-8">
        {/* Enhanced Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={handleGoBack}
          className="group flex items-center gap-3 text-gray-600 hover:text-amber-600 mb-8 transition-all duration-200 hover:bg-white px-4 py-2 rounded-lg hover:shadow-md"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Collections</span>
        </motion.button>

        {/* Premium Search Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg border border-amber-200 mb-4">
            <Search size={18} className="text-amber-600" />
            <span className="text-sm font-medium text-gray-600">Search Results for</span>
            <span className="font-bold text-amber-600">"{query}"</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            {sortedResults.length > 0 ? (
              <>Found {sortedResults.length} Divine Product{sortedResults.length !== 1 ? 's' : ''}</>
            ) : (
              'No Sacred Products Found'
            )}
          </h1>
          {sortedResults.length > 0 && (
            <p className="text-gray-600 flex items-center justify-center gap-2">
              <Crown size={16} className="text-amber-500" />
              Blessed selection from Divine Mahadev
            </p>
          )}
        </motion.div>

        {/* Premium Filters and Sort */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6 mb-8"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,.98) 0%, rgba(254,243,231,.98) 60%, rgba(254,215,170,.98) 100%)",
          }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">View:</span>
              <div className="flex items-center bg-amber-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-amber-600 shadow-sm'
                      : 'text-gray-600 hover:text-amber-600'
                  }`}
                >
                  <Grid size={16} />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-amber-600 shadow-sm'
                      : 'text-gray-600 hover:text-amber-600'
                  }`}
                >
                  <List size={16} />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <div className="relative">
                <SortAsc size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-amber-50 border border-amber-200 rounded-lg pl-10 pr-8 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent hover:bg-amber-100 transition-colors cursor-pointer"
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Results */}
        {sortedResults.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="bg-white rounded-3xl shadow-xl border border-amber-200 p-12 max-w-md mx-auto"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,.98) 0%, rgba(254,243,231,.98) 60%, rgba(254,215,170,.98) 100%)",
              }}
            >
              <div className="bg-amber-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                No sacred products found
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We couldn't find any divine products matching "<span className="font-semibold text-amber-600">{query}</span>". 
                Try different keywords or explore our blessed collections.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/')}
                  className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl"
                >
                  Browse All Collections
                </button>
                <button
                  onClick={handleGoBack}
                  className="w-full px-6 py-3 border border-amber-300 text-gray-700 rounded-xl hover:bg-amber-50 transition-all font-medium"
                >
                  Go Back
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6' 
                : 'space-y-6'
            }`}
          >
            {sortedResults.map((product, index) => {
              const isHovered = hoveredProduct === product._id;
              const inWishlist = isInWishlist(product._id);
              const isBuying = buyingProductId === product._id;

              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredProduct(product._id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  className="group rounded-xl border border-amber-200 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col hover:-translate-y-2 hover:scale-[1.02] bg-white"
                >
                  {/* Product Image */}
                  <div
                    className="relative aspect-square overflow-hidden cursor-pointer rounded-t-xl bg-gradient-to-br from-amber-50 to-orange-50"
                    onClick={() => handleProductClick(product._id)}
                  >
                    <img
                      src={product.Product_image?.[0] || "/api/placeholder/300/300"}
                      alt={product.Product_name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = "/api/placeholder/300/300";
                      }}
                    />
                    
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
                      <button
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
                      </button>
                      
                      <button
                        className={`w-8 h-8 rounded-full bg-white/80 backdrop-blur-md border-amber-200 text-amber-600 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-600 hover:text-white hover:border-amber-400/50 transition-all duration-300 shadow-lg ${
                          isHovered ? 'scale-110 shadow-xl' : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(product._id);
                        }}
                      >
                        <Eye size={13} />
                      </button>
                    </div>

                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1200 ease-out" />
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4 flex-grow flex flex-col bg-transparent">
                    <div className="mb-3">
                      <h3
                        className="font-bold text-sm text-gray-900 line-clamp-2 leading-tight cursor-pointer hover:text-amber-600 transition-colors mb-2 min-h-[40px]"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                        onClick={() => handleProductClick(product._id)}
                      >
                        {product.Product_name}
                      </h3>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {product.Product_discription || "Blessed spiritual item with divine energy"}
                      </p>
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
                        <button
                          className="w-full rounded-xl py-2 text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl border border-amber-600 backdrop-blur-sm"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart size={12} className="mr-1 group-hover:scale-110 transition-transform" />
                          Add to Cart
                        </button>

                        {/* Buy Now Button */}
                        <button
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
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Premium Results Summary */}
        {sortedResults.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg border border-amber-200">
              <Gem size={16} className="text-amber-500" />
              <span className="text-sm text-gray-600">
                Discovered {sortedResults.length} divine results for "{query}"
              </span>
            </div>
          </motion.div>
        )}
      </div>

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

export default SearchResults;