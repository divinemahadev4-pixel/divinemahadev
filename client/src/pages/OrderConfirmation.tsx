import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Package, Truck, CreditCard, ArrowRight, ArrowLeft } from "lucide-react";

interface OrderConfirmationState {
  orderId?: string;
  paymentMethod?: "cod" | "online" | string;
  totalAmount?: number;
  cartType?: "cart" | "hamper" | string;
}

const OrderConfirmation = () => {
  const { orderId: paramId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const state = (location.state || {}) as OrderConfirmationState;

  const orderId = paramId || state.orderId || "";
  const paymentMethod = (state.paymentMethod || "").toLowerCase();
  const totalAmount = state.totalAmount;
  const cartType = state.cartType || "cart";

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/orders");
    }, 6000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-amber-50/40 via-orange-50/30 to-white">
        <div className="px-4 md:px-6 pt-20 pb-10">
          <div className="max-w-2xl mx-auto">
            <Card className="border-amber-100/70 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-3 border-b border-amber-100/70 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-emerald-300" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        Order Confirmed
                      </CardTitle>
                      <p className="text-xs text-amber-100">
                        Thank you for your divine purchase
                      </p>
                    </div>
                  </div>
                  {orderId && (
                    <Badge className="bg-white/10 text-[11px] px-2 py-0.5 border border-white/20">
                      #{orderId.slice(-6).toUpperCase()}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-5">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-orange-900">
                      Your order has been placed successfully.
                    </h2>
                    <p className="text-sm text-orange-700 mt-1">
                      We have sent a confirmation to your email and are preparing your
                      items with care. You will be redirected to <span className="font-semibold">My Orders</span> shortly.
                    </p>
                  </div>
                </div>

                <Separator className="bg-amber-100/80" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <p className="text-xs text-orange-600 font-semibold">Order Summary</p>
                    {totalAmount != null && (
                      <p className="text-2xl font-bold text-orange-900">
                        ₹{totalAmount.toFixed(2)}
                      </p>
                    )}
                    <p className="text-xs text-orange-700">
                      Payment Method:{" "}
                      <span className="font-semibold text-orange-700">
                        {paymentMethod === "cod"
                          ? "Cash on Delivery"
                          : paymentMethod === "online"
                          ? "Online Payment"
                          : "--"}
                      </span>
                    </p>
                    <p className="text-xs text-orange-600">
                      Source: {cartType === "hamper" ? "Custom Hamper" : "Cart / Product"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-orange-600 font-semibold">What happens next?</p>
                    <div className="flex items-center gap-2 text-orange-700">
                      <Package className="w-4 h-4" />
                      <span className="text-xs">We prepare your divine items for shipping.</span>
                    </div>
                    <div className="flex items-center gap-2 text-orange-700">
                      <Truck className="w-4 h-4" />
                      <span className="text-xs">Your order will be delivered within 3–5 days. Track live status in the My Orders page.</span>
                    </div>
                    <div className="flex items-center gap-2 text-orange-700">
                      <CreditCard className="w-4 h-4" />
                      <span className="text-xs">
                        For any issue, contact support with this order number.
                      </span>
                    </div>
                  </div>
                </div>

                <Separator className="bg-amber-100/80" />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-orange-700 hover:text-orange-800 hover:bg-orange-50 flex items-center gap-1"
                    onClick={() => navigate(-1)}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>

                  <div className="flex items-center gap-2 text-[11px] text-orange-600">
                    <span>Redirecting to My Orders in a few seconds...</span>
                  </div>

                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white flex items-center gap-1"
                    onClick={() => navigate("/orders")}
                  >
                    Go to My Orders
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;
