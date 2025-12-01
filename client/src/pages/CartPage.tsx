import React, { useState, useEffect } from "react";
import { useCart } from "../components/CartContext";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axiosConfig";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, Truck, Lock, Sparkles, Sun, CreditCard } from "lucide-react";

import { usePhoneVerification } from "@/hooks/usePhoneVerification";
import { usePaymentProcessing } from "@/hooks/usePaymentProcessing";
import PhoneVerificationModal from "@/components/PhoneVerificationModal";

const CartPage = () => {
  const { cart, removeCart, clearCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const phoneVerification = usePhoneVerification();
  const { checkoutLoading, processPayment } = usePaymentProcessing();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"cod" | "online" | null>(null);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    phone: ""
  });

  const getProductId = (item: any) => item._id || item.id;
  const totalPrice = getCartTotal();

  const calculateOnlineDiscount = (amount: number) => amount * 0.15;
  const getOnlineDiscountedPrice = (amount: number) => amount - calculateOnlineDiscount(amount);

  useEffect(() => {
    if (phoneVerification.phoneVerified) {
      setShippingAddress(prev => ({
        ...prev,
        phone: phoneVerification.phoneNumber
      }));
      setIsCheckingOut(true);
    }
  }, [phoneVerification.phoneVerified, phoneVerification.phoneNumber]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };
  const handleQuantityChange = (productId: number | string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeCart(productId);
      toast({ title: "Item removed", description: "Item has been removed from your cart" });
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleProductClick = (productId: any) => {
    navigate(`/product/${productId}`);
  };

  const startCheckout = () => {
    if (!user) {
      toast({ title: "Please login", description: "You need to be logged in to checkout", variant: "destructive" });
      navigate("/login");
      return;
    }
    if (cart.length === 0) {
      toast({ title: "Cart is empty", description: "Add items to your cart before checkout", variant: "destructive" });
      return;
    }
    phoneVerification.setShowPhoneVerification(true);
  };

  const handlePaymentSelection = async (paymentMethod: "cod" | "online") => {
    const required = ["fullName", "address", "city", "state", "pinCode", "phone"];
    const missing = required.filter((field) => !shippingAddress[field].trim());

    if (missing.length > 0) {
      toast({ title: "Missing Information", description: "Please fill all fields", variant: "destructive" });
      return;
    }

    if (!phoneVerification.phoneVerified) {
      toast({ title: "Phone Not Verified", description: "Please verify your phone number", variant: "destructive" });
      return;
    }

    const orderItems = cart.map(item => ({
      productId: item._id || item.id,
      quantity: item.quantity || 1,
      price: parseFloat(String(item.price).replace(/[^0-9.-]+/g, "")),
      name: item.name || item.Product_name,
      image: item.image || (item.Product_image && item.Product_image[0]),
      // Optional color variant metadata for order display
      variantIndex: typeof item.variantIndex === "number" ? item.variantIndex : undefined,
      colorName: item.colorName,
      colorCode: item.colorCode,
    }));

    const deliveryCharge = 0;
    let finalAmount = totalPrice + deliveryCharge;
    let discountAmount = 0;

    if (paymentMethod === "online") {
      discountAmount = calculateOnlineDiscount(totalPrice);
      finalAmount = getOnlineDiscountedPrice(totalPrice);
    }

    const success = await processPayment(
      orderItems,
      shippingAddress,
      paymentMethod,
      {
        itemsTotal: totalPrice,
        deliveryCharge,
        totalAmount: finalAmount
      },
      "cart"
    );

    if (success) {
      clearCart();
      setIsCheckingOut(false);
      setSelectedPaymentMethod(null);
      phoneVerification.resetPhoneVerification();

      toast({
        title: "Order Placed Successfully!",
        description:
          paymentMethod === "online"
            ? `You saved ₹${discountAmount.toLocaleString()} with online payment!`
            : "Your divine items are on their way"
      });
    }
  };

  const getItemTotal = (item: any) => {
    const num = parseFloat(String(item.price).replace(/[^0-9.-]+/g, ""));
    return (isNaN(num) ? 0 : num) * (item.quantity || 1);
  };

  const getItemUnitPrice = (item: any) => {
    const num = parseFloat(String(item.price).replace(/[^0-9.-]+/g, ""));
    return isNaN(num) ? 0 : num;
  };

  return (
    <>
      {/* FIX ADDED HERE */}
      <AnimatePresence>
      <div
        className="min-h-screen pt-20 pb-6 px-4 overflow-x-hidden"
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #fef7f0 40%, #fffbeb 100%)",
        }}
      >

        {/* ---------------- MAIN PAGE CONTENT ---------------- */}
        <div className="container mx-auto max-w-6xl">

          {/* --- HEADER --- */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-50 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-orange-200">
              <Sparkles className="w-4 h-4" />
              Divine Mahakal Sacred Items
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-orange-900 mb-2">Divine Cart</h1>
            <p className="text-orange-600">Review your selected sacred items</p>
          </motion.div>

          {/* GRID: ITEMS + SUMMARY */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* CART ITEMS */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-4 flex flex-col sm:flex-row gap-4">

                    {/* IMAGE */}
                    <div
                      className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden cursor-pointer bg-gradient-to-br from-orange-50 to-white"
                      onClick={() => handleProductClick(getProductId(item))}
                    >
                      <img
                        src={item.image || (item.Product_image && item.Product_image[0]) || "/fallback.jpg"}
                        alt={item.name || item.Product_name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform"
                      />
                    </div>

                    {/* DETAILS */}
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3
                          className="font-semibold text-orange-900 cursor-pointer hover:text-orange-700 line-clamp-2"
                          onClick={() => handleProductClick(getProductId(item))}
                        >
                          {item.name || item.Product_name}
                        </h3>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCart(getProductId(item))}
                          className="h-8 w-8 rounded-full text-orange-400 hover:text-rose-500 hover:bg-rose-50"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>

                      {/* QUANTITY + PRICE */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-orange-200 rounded-lg overflow-hidden">
                          <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(getProductId(item), (item.quantity || 1) - 1)} className="h-8 w-8 text-orange-600 hover:bg-orange-100"><Minus size={14} /></Button>
                          <span className="px-3 py-1 bg-white text-sm font-semibold text-orange-900 min-w-[40px] text-center">{item.quantity || 1}</span>
                          <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(getProductId(item), (item.quantity || 1) + 1)} className="h-8 w-8 text-orange-600 hover:bg-orange-100"><Plus size={14} /></Button>
                        </div>

                        <div className="text-right ml-auto">
                          <div className="text-lg font-bold text-orange-900">₹{getItemTotal(item).toLocaleString()}</div>
                          <div className="text-sm text-orange-500">₹{getItemUnitPrice(item).toLocaleString()} each</div>
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ORDER SUMMARY CARD */}
            <div className="lg:col-span-1">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-white rounded-xl border border-orange-200 shadow-xl p-6 sticky top-24">

                <h2 className="text-xl font-bold text-orange-900 mb-4 flex items-center gap-2">
                  <Sun className="w-5 h-5 text-orange-600" /> Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-orange-600">Subtotal ({cart.reduce((sum, i) => sum + (i.quantity || 1), 0)} items)</span>
                    <span className="font-semibold">₹{totalPrice.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-orange-600">Delivery (3–5 Days)</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>

                  {/* DISCOUNT BOX */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex justify-between mb-1 text-xs text-green-700">
                      <div className="flex items-center gap-2"><CreditCard className="w-4 h-4" /> Extra 15% OFF (Online)</div>
                      <span>-₹{calculateOnlineDiscount(totalPrice).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-green-600">Save more with online payment</p>
                  </div>
                </div>

                <Button onClick={startCheckout} className="w-full h-11 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-semibold">
                  <Lock className="w-4 h-4 mr-2" /> Proceed to Checkout
                </Button>

              </motion.div>
            </div>
          </div>

          {/* SHIPPING FORM + PAYMENT BUTTONS */}
          <div className="bg-orange-50 rounded-xl p-4 mb-6 border border-orange-200 mt-6">

            <h3 className="font-semibold text-orange-900 mb-3 text-sm flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Order Summary ({cart.length} items)
            </h3>

            {/* SHIPPING INFO */}
            <div className="space-y-4 mt-4">
              <h3 className="font-semibold text-orange-900 text-lg">Shipping Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input name="fullName" value={shippingAddress.fullName} onChange={handleInputChange} />
                </div>

                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input disabled name="phone" value={shippingAddress.phone} />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label>Address</Label>
                  <Input name="address" value={shippingAddress.address} onChange={handleInputChange} />
                </div>

                <div className="space-y-2">
                  <Label>City</Label>
                  <Input name="city" value={shippingAddress.city} onChange={handleInputChange} />
                </div>

                <div className="space-y-2">
                  <Label>State</Label>
                  <Input name="state" value={shippingAddress.state} onChange={handleInputChange} />
                </div>

                <div className="space-y-2">
                  <Label>PIN Code</Label>
                  <Input name="pinCode" value={shippingAddress.pinCode} onChange={handleInputChange} />
                </div>
              </div>
            </div>

            {/* PAYMENT BUTTONS */}
            <div className="bg-white border-t border-orange-200 p-6 space-y-3 rounded-b-2xl mt-6">
              <Button onClick={() => handlePaymentSelection("online")} className="w-full h-12 bg-green-600 text-white rounded-xl">
                <CreditCard className="w-5 h-5" /> Pay Online & Save 15%
              </Button>

              <Button onClick={() => handlePaymentSelection("cod")} variant="outline" className="w-full h-12 border-orange-600 text-orange-700 rounded-xl">
                <Truck className="w-5 h-5" /> Cash on Delivery
              </Button>
            </div>

          </div>
        </div>
      </div>

      {/* THIS WAS THE SYNTAX FIX */}
      </AnimatePresence>

      {/* PHONE MODAL */}
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

export default CartPage;
