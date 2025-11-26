// src/pages/ProductDetailPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosConfig";
import {
  Heart,
  ChevronRight,
  X,
  ZoomIn,
  Check,
  ShoppingCart,
  Minus,
  Plus,
  Star,
  Sparkles,
  Gem,
  Crown,
  Sun,
  CreditCard,
  Truck,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useCart } from "@/components/CartContext";
import { useWishlist } from "@/components/WishlistContext";
import { useAuth } from "@/components/AuthContext";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

// Import phone verification and payment processing
import { usePhoneVerification } from "@/hooks/usePhoneVerification";
import { usePaymentProcessing } from "@/hooks/usePaymentProcessing";
import PhoneVerificationModal from "@/components/PhoneVerificationModal";

interface Product {
  _id: string;
  Product_name: string;
  Product_discription: string;
  Product_price: number;
  discounted_price?: number;
  Product_image: string[];
  Product_category: {
    category: string;
    slug: string;
  };
  Product_available?: boolean;
  Product_rating?: number;
  isNew?: boolean;
}

interface Review {
  _id?: string;
  name: string;
  review: string;
  rating: number;
  product_id: string;
  createdAt?: string;
}

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  phone: string;
}

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");
  const [showImageModal, setShowImageModal] = useState(false);
  const [buying, setBuying] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.firstName || "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    phone: "",
  });

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(false);

  // Calculate average rating from reviews
  const calculateAverageRating = (reviews: Review[]): number => {
    if (reviews.length === 0) return 0;

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = totalRating / reviews.length;

    // Round to 1 decimal place
    return Math.round(average * 10) / 10;
  };

  // Calculate rating distribution
  const calculateRatingDistribution = (reviews: Review[]) => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating as keyof typeof distribution]++;
      }
    });

    return distribution;
  };

  // Get current product rating (from reviews or fallback to product rating)
  const currentProductRating =
    reviews.length > 0 ? calculateAverageRating(reviews) : product?.Product_rating || 0;

  // Get rating distribution
  const ratingDistribution = calculateRatingDistribution(reviews);

  // Add review form state
  const [nameInput, setNameInput] = useState<string>(user?.firstName || "");
  const [reviewText, setReviewText] = useState<string>("");
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Phone verification and payment processing hooks
  const phoneVerification = usePhoneVerification();
  const { checkoutLoading, processPayment } = usePaymentProcessing();
  const [directBuyProduct, setDirectBuyProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (user && user.firstName) setNameInput(user.firstName);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    try {
      const key = `shipping_address_${user._id}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<ShippingAddress>;
        setShippingAddress((prev) => ({
          ...prev,
          ...parsed,
        }));
      }
    } catch (e) {
      console.error("Failed to load saved shipping address", e);
    }
  }, [user]);

  // fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/api/getproductbyid?id=${productId?.trim()}`);
        if (res.data?.product) {
          setProduct(res.data.product);
          setSelectedImage(res.data.product.Product_image[0]);
          // fetch related products
          try {
            const relatedRes = await axiosInstance.get(
              `/api/getproducts?category=${res.data.product.Product_category.slug}&limit=8`
            );
            const filtered = relatedRes.data.products?.filter(
              (p: Product) => p._id !== res.data.product._id
            ) || [];
            setRelatedProducts(filtered.slice(0, 6));
          } catch (relatedError) {
            console.error("Failed to load related products:", relatedError);
            setRelatedProducts([]);
          }
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Failed to load product:", error);
        setProduct(null);
        toast({
          title: "Divine Error",
          description: "Failed to load sacred product details. Please try again.",
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, toast]);

  // fetch reviews whenever product loads or changes
  useEffect(() => {
    const loadReviews = async () => {
      if (!product?._id) return;
      setReviewsLoading(true);
      try {
        const res = await axiosInstance.get(`/review/get/${product._id}`);
        if (res.data?.data) {
          setReviews(res.data.data);
        } else {
          setReviews([]);
        }
      } catch (err) {
        console.error("Failed to load reviews:", err);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    loadReviews();
  }, [product?._id]);

  // Handle phone verification for direct buy
  useEffect(() => {
    if (phoneVerification.phoneVerified) {
      setShippingAddress((prev) => ({
        ...prev,
        phone: phoneVerification.phoneNumber,
      }));
      setIsCheckingOut(true);
    }
  }, [phoneVerification.phoneVerified, phoneVerification.phoneNumber]);

  // Utilities (wishlist/cart transforms)
  const transformProductForWishlist = (prod: Product) => ({
    _id: prod._id,
    Product_name: prod.Product_name,
    Product_price: prod.Product_price,
    Product_image: prod.Product_image,
    category: prod.Product_category?.category,
    description: prod.Product_discription,
    Product_available: prod.Product_available,
  });

  const transformProductForCart = (prod: Product, qty: number = 1) => {
    // FIXED: Product_price is selling price, discounted_price is MRP
    return {
      id: parseInt(prod._id.slice(-8), 16),
      _id: prod._id,
      name: prod.Product_name,
      Product_name: prod.Product_name,
      price: `₹${prod.Product_price}`, // Selling price
      Product_price: prod.Product_price, // Selling price
      originalPrice: prod.discounted_price && prod.discounted_price > prod.Product_price
        ? `₹${prod.discounted_price}`
        : `₹${prod.Product_price}`, // MRP (higher price)
      image: prod.Product_image[0] || "",
      Product_image: prod.Product_image,
      isNew: prod.isNew || false,
      quantity: qty,
      Product_available: prod.Product_available,
    };
  };

  // cart / wishlist / buy handlers (unchanged)
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product) return;

    if (user) {
      const wasInWishlist = isInWishlist(product._id);
      const transformedProduct = transformProductForWishlist(product);
      toggleWishlist(transformedProduct);

      toast({
        title: wasInWishlist ? "Removed from sacred collection" : "Added to sacred collection",
        description: wasInWishlist
          ? `${product.Product_name} removed from your sacred collection`
          : `${product.Product_name} added to your sacred collection`,
        duration: 2000,
      });
    } else {
      navigate("/login");
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cartProduct = transformProductForCart(product, quantity);
    addToCart(cartProduct);

    toast({
      title: "Added to divine cart",
      description: `${quantity} × ${product.Product_name} added to your cart with blessings`,
      duration: 2000,
    });
  };

  const handleShippingInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const fieldName = name as keyof ShippingAddress;
    setShippingAddress((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleDirectBuy = () => {
    if (!product) return;

    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to buy directly",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }

    setBuying(true);
    setDirectBuyProduct(product);
    phoneVerification.setShowPhoneVerification(true);
    setTimeout(() => setBuying(false), 700);
  };

  const handleDirectBuyPayment = async (
    product: Product,
    paymentMethod: "cod" | "online"
  ) => {
    if (!phoneVerification.phoneVerified) {
      toast({
        title: "Phone Not Verified",
        description: "Please verify your phone number first",
        variant: "destructive"
      });
      return;
    }

    const requiredFields: (keyof ShippingAddress)[] = [
      "fullName",
      "address",
      "city",
      "state",
      "pinCode",
      "phone",
    ];

    const missingFields = requiredFields.filter(
      (field) => !shippingAddress[field].trim()
    );

    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all shipping address fields",
        variant: "destructive",
      });
      return;
    }

    if (user?._id) {
      try {
        const key = `shipping_address_${user._id}`;
        localStorage.setItem(key, JSON.stringify(shippingAddress));
      } catch (e) {
        console.error("Failed to save shipping address", e);
      }
    }

    // FIXED: Use Product_price as selling price for payment
    const sellingPriceForPayment = product.Product_price;

    const orderItems = [
      {
        productId: product._id,
        quantity: quantity,
        price: sellingPriceForPayment, // Selling price
        name: product.Product_name,
        image: product.Product_image[0] || "",
      },
    ];

    // Dedicated COD flow: create order and navigate explicitly
    if (paymentMethod === "cod") {
      try {
        const orderData = {
          userId: user?._id,
          items: orderItems,
          shippingAddress: {
            street: shippingAddress.address,
            city: shippingAddress.city,
            state: shippingAddress.state,
            pincode: shippingAddress.pinCode,
            country: "India",
          },
          itemsTotal: sellingPriceForPayment * quantity,
          deliveryCharge: 0,
          totalAmount: sellingPriceForPayment * quantity,
          paymentMethod: "cod",
          Contact_number: shippingAddress.phone,
          user_email: user?.email,
          isCustomHamper: false,
        };

        const res = await axiosInstance.post("/razorpay/create-order", orderData);

        if (!res.data?.success) {
          throw new Error(res.data?.message || "Failed to place COD order");
        }

        const orderId = res.data.orderId || res.data.order?._id;

        toast({
          title: "Order Placed Successfully!",
          description: "Your order has been placed. You will be redirected shortly.",
        });

        setDirectBuyProduct(null);
        setIsCheckingOut(false);
        phoneVerification.resetPhoneVerification();

        if (orderId) {
          navigate(`/order-confirmation/${orderId}`, {
            state: {
              orderId,
              paymentMethod: "cod",
              totalAmount: sellingPriceForPayment * quantity,
              cartType: "cart",
            },
          });
        } else {
          navigate("/orders");
        }
      } catch (err: any) {
        console.error("Direct COD error:", err);
        toast({
          title: "Unable to place order",
          description:
            err?.response?.data?.message || err.message || "Something went wrong",
          variant: "destructive",
        });
      }
      return;
    }

    // Online payment still uses shared Razorpay-based hook
    const success = await processPayment(
      orderItems,
      shippingAddress,
      paymentMethod,
      {
        itemsTotal: sellingPriceForPayment * quantity,
        deliveryCharge: 0,
        totalAmount: sellingPriceForPayment * quantity,
      },
      "cart"
    );

    if (success) {
      setDirectBuyProduct(null);
      setIsCheckingOut(false);
      phoneVerification.resetPhoneVerification();
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  // --- Reviews: submit handler ---
  const submitReview = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!product) {
      toast({ title: "Error", description: "Product is not loaded yet", variant: "destructive" });
      return;
    }
    if (!user) {
      toast({ title: "Please login", description: "You must be logged in to add a review", variant: "destructive" });
      navigate("/login");
      return;
    }
    if (!nameInput?.trim() || !reviewText?.trim() || !ratingInput) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }

    const payload = {
      name: nameInput.trim(),
      review: reviewText.trim(),
      rating: ratingInput,
      product_id: product._id
    };

    try {
      setSubmittingReview(true);
      const res = await axiosInstance.post("/review/add", payload);
      if (res.status === 201 || res.data?.message) {
        const newReview: Review = {
          ...payload,
          _id: res.data?.review?._id || `${Date.now()}`,
          createdAt: new Date().toISOString()
        };
        setReviews(prev => [newReview, ...prev]);
        setReviewText("");
        setRatingInput(5);
        toast({ title: "Review added", description: "Thank you for your feedback" });
      } else {
        throw new Error(res.data?.message || "Failed to add review");
      }
    } catch (err: any) {
      console.error("Add review error:", err);
      toast({ title: "Failed to add review", description: err?.response?.data?.message || err.message || "Try again", variant: "destructive" });
    } finally {
      setSubmittingReview(false);
    }
  };

  // small helper to render star input
  const StarInput = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const starIndex = i + 1;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(starIndex)}
            className={`p-1 rounded ${starIndex <= value ? "text-amber-500" : "text-amber-200"}`}
            aria-label={`Rate ${starIndex}`}
          >
            <Star size={18} />
          </button>
        );
      })}
      <span className="text-sm text-amber-600 ml-2 font-semibold">{value}.0</span>
    </div>
  );

  // Helper to render star rating display
  const renderStarRating = (rating: number, size: number = 16) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={`${i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "fill-amber-200 text-amber-200"} ${i === Math.floor(rating) && rating % 1 > 0 ? "text-amber-400" : ""
              }`}
          />
        ))}
      </div>
    );
  };

  // FIXED: Product_price is selling price, discounted_price is MRP (original/higher price)
  const hasDiscount = product?.discounted_price && product.discounted_price > product.Product_price;
  const sellingPrice = product?.Product_price || 0; // Selling price (lower)
  const displayPrice = sellingPrice; // Display selling price
  const mrpPrice = hasDiscount ? product.discounted_price! : sellingPrice; // MRP (higher)
  const discountPercentage = hasDiscount
    ? Math.round(((product.discounted_price! - product.Product_price) / product.discounted_price!) * 100)
    : 0;
  const savings = hasDiscount ? product.discounted_price! - product.Product_price : 0;

  // ---- Render ----
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-amber-50 to-orange-100">
        <div className="text-center space-y-4 px-4">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <motion.div
              className="absolute w-10 h-10 bg-amber-100/50 rounded-full"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <Sun className="w-6 h-6 text-amber-500" />
          </div>
          <p className="text-amber-600 font-medium text-lg">Loading Divine Product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-amber-50 to-orange-100 p-4">
        <Card className="p-8 text-center max-w-md w-full shadow-2xl border border-amber-200 bg-white/95 backdrop-blur-sm">
          <CardContent className="space-y-6">
            <div className="w-20 h-20 mx-auto bg-amber-50 rounded-full flex items-center justify-center">
              <X className="text-amber-400 w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Divine Product Not Found</h2>
            <p className="text-gray-600">The sacred product you're seeking doesn't exist or has been removed.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={() => navigate("/")} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white">Browse Sacred Collections</Button>
              <Button variant="outline" onClick={() => navigate(-1)} className="flex-1">Go Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen overflow-x-hidden" style={{ background: "linear-gradient(135deg, #ffffff 0%, #fef3e7 40%, #fed7aa 100%)" }}>
        {/* Image Modal */}
        <AnimatePresence>
          {showImageModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={() => setShowImageModal(false)}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-6xl max-h-full" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setShowImageModal(false)} className="absolute -top-16 right-0 text-white hover:text-amber-300 transition-colors bg-black/50 rounded-full p-3 z-10">
                  <X size={24} />
                </button>
                <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
                  <img src={selectedImage!} alt="Product zoom view" className="w-full max-h-[80vh] object-contain" onError={(e) => (e.currentTarget.src = "/fallback.jpg")} />
                </div>
                <div className="flex justify-center mt-6 space-x-3 max-w-full overflow-x-auto px-2">
                  {product.Product_image.map((img, idx) => (
                    <button key={idx} onClick={() => setSelectedImage(img)} className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-3 transition-all ${selectedImage === img ? "border-amber-400 ring-4 ring-amber-300/50" : "border-white/50 hover:border-amber-300"}`}>
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "/fallback.jpg")} />
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center space-x-2 text-sm text-amber-600 mb-8 flex-wrap">
            <Link to="/" className="hover:text-amber-700 transition-colors font-medium">Home</Link>
            <ChevronRight size={16} />
            <Link to={`/category/${product.Product_category.slug}`} className="hover:text-amber-700 transition-colors font-medium">{product.Product_category.category}</Link>
            <ChevronRight size={16} />
            <span className="text-gray-900 font-semibold truncate max-w-[200px] sm:max-w-none">{product.Product_name}</span>
          </motion.nav>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Left: Images */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <Card className="overflow-hidden border border-amber-200 shadow-lg bg-white">
                <div className="relative group aspect-square bg-gradient-to-br from-white via-amber-50 to-amber-100">
                  <motion.img src={selectedImage!} alt={product.Product_name} className="w-full h-full object-cover cursor-zoom-in" onError={(e) => (e.currentTarget.src = "/fallback.jpg")} onClick={() => setShowImageModal(true)} whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }} />
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {hasDiscount && <Badge className="mb-3 bg-amber-100 text-amber-800 border-0 font-semibold">{discountPercentage}% OFF</Badge>}
                    {product.isNew && <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold px-2 py-1 text-xs shadow-lg border-0"><Sparkles size={10} className="mr-1" />NEW</Badge>}
                    <Badge className={`font-semibold px-2 py-1 text-xs shadow-lg border-0 ${product.Product_available ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white" : "bg-gradient-to-r from-amber-500 to-orange-500 text-white"}`}><Check size={10} className="mr-1" />{product.Product_available ? "In Stock" : "Out of Stock"}</Badge>
                  </div>
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <Button variant="ghost" size="icon" onClick={handleWishlistToggle} className={`w-8 h-8 rounded-full backdrop-blur-sm ${isInWishlist(product._id) ? "bg-rose-50 text-rose-500 hover:bg-rose-100" : "bg-white/90 text-amber-600 hover:bg-white"}`}>
                      <Heart size={16} fill={isInWishlist(product._id) ? "currentColor" : "none"} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setShowImageModal(true)} className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-amber-600 hover:bg-white">
                      <ZoomIn size={16} />
                    </Button>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-4 gap-3">
                {product.Product_image.map((img, idx) => (
                  <Card key={idx} className={`overflow-hidden cursor-pointer border-2 transition-all duration-300 hover:scale-105 ${selectedImage === img ? "border-amber-400 ring-2 ring-amber-200 shadow-lg" : "border-amber-200 hover:border-amber-300"}`} onClick={() => setSelectedImage(img)}>
                    <div className="aspect-square bg-gradient-to-br from-amber-50 to-amber-100">
                      <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "/fallback.jpg")} />
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Right: Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <Card className="p-6 border border-amber-200 shadow-xl bg-white">
                <CardContent className="p-0 space-y-6">
                  <div>
                    <Badge className="mb-3 bg-amber-100 text-amber-800 border-0 font-semibold">{product.Product_category.category}</Badge>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-4">{product.Product_name}</h1>
                    <div className="flex items-center gap-1 mb-2">
                      {renderStarRating(currentProductRating, 16)}
                      <span className="text-sm text-amber-600 ml-2">{currentProductRating.toFixed(1)}</span>
                      <span className="text-sm text-amber-400">•</span>
                      <span className="text-sm text-amber-400">{reviews.length} Divine Reviews</span>
                    </div>
                  </div>

                  <div className="space-y-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100">
                    {/* FIXED: Product_price is selling price, discounted_price is MRP */}
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <span className="text-3xl font-bold text-gray-900">₹{displayPrice.toLocaleString()}</span>
                      {hasDiscount && (
                        <>
                          <span className="text-lg text-gray-400 line-through">₹{mrpPrice.toLocaleString()}</span>
                          <Badge className="bg-emerald-100 text-emerald-800 font-semibold text-sm">Save ₹{savings.toLocaleString()}</Badge>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Inclusive of all taxes • Free shipping • Blessed packaging</p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-700">Quantity:</span>
                      <div className="flex items-center border-2 border-amber-200 rounded-xl overflow-hidden">
                        <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700" disabled={quantity <= 1}><Minus size={16} /></button>
                        <span className="px-4 py-2 bg-white border-x-2 border-amber-200 font-semibold min-w-[50px] text-center text-gray-900">{quantity}</span>
                        <button onClick={() => setQuantity((q) => Math.min(10, q + 1))} className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700" disabled={quantity >= 10}><Plus size={16} /></button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button onClick={handleAddToCart} disabled={!product.Product_available} className="flex-1 h-12 text-sm font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white"> <ShoppingCart className="mr-2" size={18} /> Add to Cart</Button>
                      <Button onClick={handleDirectBuy} disabled={!product.Product_available || buying} className="flex-1 h-12 text-sm font-semibold bg-gradient-to-r from-amber-600 to-orange-600 text-white">
                        {buying ? (<motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Sparkles className="w-4 h-4" /></motion.div>) : (<><CreditCard size={16} className="mr-2" /> Buy Now</>)}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Tabs Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border border-amber-200 shadow-xl bg-white overflow-hidden mb-8">
              <div className="border-b border-amber-200 overflow-x-auto">
                <div className="flex min-w-max">
                  {[
                    { key: "description", label: "Divine Description" },
                    { key: "specifications", label: "Details & Blessings" }
                  ].map((tab) => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-6 py-4 font-semibold text-sm transition-all duration-300 relative flex-shrink-0 ${activeTab === tab.key ? "text-amber-600 bg-amber-50 border-b-2 border-amber-500" : "text-gray-600 hover:text-amber-600 hover:bg-amber-50/50"}`}>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <CardContent className="p-6">
                {activeTab === "description" && (
                  <div className="prose prose-stone max-w-none">
                    <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">{product.Product_discription}</p>
                    <div className="mt-6 p-4 bg-amber-50 rounded-2xl border-l-4 border-amber-400">
                      <div className="flex items-start gap-3">
                        <Crown className="text-amber-600 mt-1 flex-shrink-0" size={18} />
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2 text-base">Divine Quality Guarantee</h4>
                          <p className="text-gray-800 text-sm">Every sacred piece is meticulously crafted with spiritual energy and undergoes rigorous quality checks.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "specifications" && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 text-base">Product Details</h4>
                      <div className="space-y-3">
                        {[
                          { label: "Category", value: product.Product_category.category },
                          { label: "Material", value: "Sacred Materials" },
                          { label: "Warranty", value: "2 Years" },
                          { label: "Return Policy", value: "30 Days" }
                        ].map((spec, idx) => (
                          <div key={idx} className="flex justify-between py-2 border-b border-amber-100">
                            <span className="font-medium text-gray-600 text-sm">{spec.label}</span>
                            <span className="font-semibold text-gray-900 text-sm">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 text-base">Care & Blessings</h4>
                      <div className="space-y-3 text-gray-700 text-sm">
                        <p>• Store in sacred space when not in use</p>
                        <p>• Clean with soft, dry cloth regularly</p>
                        <p>• Avoid exposure to negative energy</p>
                        <p>• Regular prayers enhance divine energy</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Reviews Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-16">
            <Card className="border border-amber-200 shadow-xl bg-white overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <Star className="w-6 h-6" fill="currentColor" />
                  Divine Reviews & Experiences
                </h2>
                <p className="text-amber-100 mt-2">See what our spiritual community says about this sacred product</p>
              </div>

              <CardContent className="p-6">
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Review Stats */}
                  <div className="lg:col-span-1">
                    <div className="bg-amber-50 rounded-2xl p-4 sm:p-6 border border-amber-200">
                      <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-4">Review Summary</h3>
                      <div className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <span className="text-3xl sm:text-4xl font-bold text-amber-600">
                            {currentProductRating.toFixed(1)}
                          </span>
                          <div className="flex-shrink-0">
                            {renderStarRating(currentProductRating, 20)}
                          </div>
                        </div>

                        <div className="text-center">
                          <p className="text-gray-600 text-sm">Based on</p>
                          <p className="font-semibold text-gray-900">{reviews.length} Divine Reviews</p>
                        </div>

                        {/* Rating Distribution */}
                        {reviews.length > 0 && (
                          <div className="space-y-2 mt-4">
                            {[5, 4, 3, 2, 1].map((rating) => {
                              const count = ratingDistribution[rating as keyof typeof ratingDistribution];
                              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;

                              return (
                                <div
                                  key={rating}
                                  className="flex items-center gap-2 text-xs sm:text-sm w-full min-w-0"
                                >
                                  <span className="w-4 text-gray-600 flex-shrink-0">{rating}</span>
                                  <Star size={12} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                                  <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div
                                      className="bg-amber-500 h-2 rounded-full"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                  <span className="w-6 text-right text-gray-600 text-[10px] sm:text-xs flex-shrink-0">
                                    {count}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Add Review Form */}
                    <div className="mt-6 p-6 border border-amber-100 rounded-2xl bg-white">
                      <h4 className="font-semibold text-gray-900 mb-4">Share Your Experience</h4>
                      <form onSubmit={submitReview} className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Your Name</label>
                          <input
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            className="mt-2 w-full border border-amber-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Your Rating</label>
                          <div className="mt-2">
                            <StarInput value={ratingInput} onChange={(v) => setRatingInput(v)} />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Your Review</label>
                          <textarea
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            rows={4}
                            className="mt-2 w-full border border-amber-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            placeholder="Share your divine experience with this product..."
                          />
                        </div>
                        <Button
                          type="submit"
                          disabled={submittingReview}
                          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                        >
                          {submittingReview ? "Submitting..." : "Submit Your Review"}
                        </Button>
                      </form>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl">
                      <h3 className="font-bold text-gray-900 text-lg mb-6">Community Reviews ({reviews.length})</h3>

                      {reviewsLoading ? (
                        <div className="text-center py-12">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
                          <p className="text-gray-500 mt-4">Loading divine reviews...</p>
                        </div>
                      ) : reviews.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-amber-200 rounded-2xl">
                          <Star className="w-12 h-12 text-amber-300 mx-auto mb-4" />
                          <h4 className="font-semibold text-gray-900 mb-2">No Reviews Yet</h4>
                          <p className="text-gray-600 text-sm mb-4">Be the first to share your divine experience!</p>
                        </div>
                      ) : (
                        <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4">
                          {reviews.map((r, idx) => (
                            <div key={r._id || idx} className="border border-amber-100 rounded-2xl p-6 bg-amber-50/30 hover:bg-amber-50/50 transition-colors">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 flex items-center justify-center font-semibold text-white text-lg">
                                    {r.name?.charAt(0)?.toUpperCase() || "U"}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-gray-900 break-words max-w-[220px] sm:max-w-xs">
                                      {r.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                      }) : "Recently"}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-amber-200 self-start">
                                  {renderStarRating(r.rating, 16)}
                                  <span className="ml-2 text-sm font-semibold text-amber-600">{r.rating}.0</span>
                                </div>
                              </div>

                              <div className="text-gray-700 leading-relaxed whitespace-pre-line bg-white p-4 rounded-lg border border-amber-100">
                                {r.review}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-16">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Your Spiritual Collection</h2>
                <p className="text-gray-600 text-base max-w-2xl mx-auto">Discover more divine pieces that complement your spiritual journey</p>
              </div>

              <div className="relative">
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {relatedProducts.map((relatedProduct) => {
                    const relatedHasDiscount = relatedProduct.discounted_price && relatedProduct.discounted_price > relatedProduct.Product_price;
                    const relatedDisplayPrice = relatedProduct.Product_price; // Selling price
                    const relatedMrpPrice = relatedHasDiscount ? relatedProduct.discounted_price! : relatedProduct.Product_price;
                    const relatedDiscountPercentage = relatedHasDiscount
                      ? Math.round(((relatedProduct.discounted_price! - relatedProduct.Product_price) / relatedProduct.discounted_price!) * 100)
                      : 0;

                    return (
                      <div key={relatedProduct._id} className="flex-shrink-0 w-full cursor-pointer" onClick={() => navigate(`/product/${relatedProduct._id}`)}>
                        <Card className="h-full border border-amber-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-white">
                          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-white via-amber-50 to-amber-100">
                            <img src={relatedProduct.Product_image[0] || "/fallback.jpg"} alt={relatedProduct.Product_name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" onError={(e) => (e.currentTarget.src = "/fallback.jpg")} />
                            <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/30 to-white/80" />
                            <Button variant="ghost" size="icon" className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-md backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); if (user) toggleWishlist(transformProductForWishlist(relatedProduct)); else navigate("/login"); }}>
                              <Heart size={14} className={`${isInWishlist(relatedProduct._id) ? "fill-rose-500 text-rose-500" : "text-amber-400"}`} />
                            </Button>
                            {relatedProduct.isNew && <Badge className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 font-semibold text-xs"> <Sparkles size={10} className="mr-1" /> NEW</Badge>}
                            {relatedHasDiscount && <Badge className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 font-semibold text-xs">{relatedDiscountPercentage}% OFF</Badge>}
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 leading-tight text-sm">{relatedProduct.Product_name}</h3>
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="font-bold text-amber-600 text-base">₹{relatedDisplayPrice.toLocaleString()}</span>
                                {relatedHasDiscount && (
                                  <span className="text-xs text-gray-400 line-through">₹{relatedMrpPrice.toLocaleString()}</span>
                                )}
                              </div>
                              {relatedHasDiscount && (
                                <Badge className="bg-amber-100 text-amber-800 border-0 text-xs font-semibold">
                                  {relatedDiscountPercentage}% OFF
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="text-center mt-6">
                <Button variant="outline" onClick={() => navigate(`/category/${product.Product_category.slug}`)} className="border-amber-300 text-amber-700 hover:bg-amber-50 px-6 py-2 text-sm">
                  Explore {product.Product_category.category} Collection
                  <ChevronRight size={16} className="ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckingOut && (
        <AnimatePresence>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md max-h-full bg-white rounded-2xl overflow-hidden shadow-2xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Address</h2>
              <form className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                  <Input
                    type="text"
                    name="fullName"
                    value={shippingAddress.fullName}
                    onChange={handleShippingInputChange}
                    className="mt-2 w-full border border-amber-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Address</Label>
                  <Input
                    type="text"
                    name="address"
                    value={shippingAddress.address}
                    onChange={handleShippingInputChange}
                    className="mt-2 w-full border border-amber-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">City</Label>
                  <Input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleShippingInputChange}
                    className="mt-2 w-full border border-amber-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">State</Label>
                  <Input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleShippingInputChange}
                    className="mt-2 w-full border border-amber-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Pin Code</Label>
                  <Input
                    type="text"
                    name="pinCode"
                    value={shippingAddress.pinCode}
                    onChange={handleShippingInputChange}
                    className="mt-2 w-full border border-amber-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={() => handleDirectBuyPayment(directBuyProduct!, "cod")} className="flex-1 h-12 text-sm font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    <Truck size={16} className="mr-2" /> Cash on Delivery
                  </Button>
                  <Button onClick={() => handleDirectBuyPayment(directBuyProduct!, "online")} className="flex-1 h-12 text-sm font-semibold bg-gradient-to-r from-amber-600 to-orange-600 text-white">
                    <Lock size={16} className="mr-2" /> Online Payment
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Phone Verification Modal */}
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

export default ProductDetailPage;