import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useAuth } from "@/components/AuthContext";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axiosConfig";
import { TokenManager } from "@/utils/tokenManager";
import { format, isValid } from "date-fns";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  CreditCard,
  Gift,
  User,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/* Types */
type OrderState = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "failed";
type PayState = "initiated" | "pending" | "paid" | "failed";

interface OrderItem {
  _id?: string;
  productId: string | {
    _id?: string;
    Product_name?: string;
    name?: string;
    Product_image?: string[];
    image?: string;
  };
  name?: string;
  quantity: number;
  price: number;
  image?: string;
}

interface BackendOrder {
  _id: string;
  createdAt: string;
  status: OrderState;
  paymentStatus: PayState;
  paymentMethod: string;
  totalAmount: number;
  itemsTotal?: number;
  deliveryCharge?: number;
  items: OrderItem[];
  shippingAddress: Record<string, string>;
  isCustomHamper?: boolean;
  trackingNumber?: string;
}

interface DisplayOrder {
  _id: string;
  createdAt: string;
  orderStatus: OrderState;
  paymentStatus: PayState;
  paymentMethod: string;
  totalAmount: number;
  itemsTotal: number;
  deliveryCharge: number;
  itemThumb: string;
  itemCount: number;
  isCustomHamper?: boolean;
  trackingNumber?: string;
}

/* Updated pastel theme configs */
const orderStatus = {
  pending: { 
    icon: Clock, 
    variant: "secondary" as const, 
    label: "Order Placed", 
    progress: 25,
    bgColor: "bg-orange-50/70",
    textColor: "text-orange-700",
    borderColor: "border-orange-200"
  },
  processing: { 
    icon: Package, 
    variant: "default" as const, 
    label: "Processing", 
    progress: 50,
    bgColor: "bg-orange-50/70",
    textColor: "text-orange-700", 
    borderColor: "border-orange-200"
  },
  shipped: { 
    icon: Truck, 
    variant: "outline" as const, 
    label: "Shipped", 
    progress: 75,
    bgColor: "bg-orange-50/70",
    textColor: "text-orange-700",
    borderColor: "border-orange-200"
  },
  delivered: { 
    icon: CheckCircle, 
    variant: "default" as const, 
    label: "Delivered", 
    progress: 100,
    bgColor: "bg-green-50/80",
    textColor: "text-green-700",
    borderColor: "border-green-200"
  },
  cancelled: { 
    icon: XCircle, 
    variant: "destructive" as const, 
    label: "Cancelled", 
    progress: 0,
    bgColor: "bg-red-50/80",
    textColor: "text-red-700",
    borderColor: "border-red-200"
  },
  failed: { 
    icon: XCircle, 
    variant: "destructive" as const, 
    label: "Failed", 
    progress: 0,
    bgColor: "bg-red-50/80",
    textColor: "text-red-700",
    borderColor: "border-red-200"
  },
};

const payStatus = {
  initiated: { variant: "secondary" as const, label: "Initiated", color: "bg-orange-500" },
  pending: { variant: "outline" as const, label: "Pending", color: "bg-orange-500" },
  paid: { variant: "default" as const, label: "Paid", color: "bg-green-500" },
  failed: { variant: "destructive" as const, label: "Failed", color: "bg-red-500" },
};

const PLACEHOLDER = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjMyIiBjeT0iMzIiIHI9IjgiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";

const Orders = () => {
  const { user } = useAuth();
  const userId = user?._id || user?.id;
  const { toast } = useToast();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<DisplayOrder[]>([]);
  const [backendOrders, setBackendOrders] = useState<BackendOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<BackendOrder | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return isValid(d) ? format(d, "MMM dd") : "—";
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return isValid(d) ? format(d, "h:mm a") : "";
  };

  /* Transform backend order to display format */
  const transformOrder = (o: BackendOrder): DisplayOrder => {
    const delivery = o.deliveryCharge ?? 80;
    const itemsTotal = o.itemsTotal ?? Math.max(0, o.totalAmount - delivery);
    
    const firstItem = o.items[0];
    let thumb = PLACEHOLDER;
    
    if (firstItem) {
      if (typeof firstItem.productId === "object" && firstItem.productId) {
        thumb = firstItem.productId.Product_image?.[0] || firstItem.productId.image || PLACEHOLDER;
      } else if (firstItem.image) {
        thumb = firstItem.image;
      }
    }

    return {
      _id: o._id,
      createdAt: o.createdAt,
      orderStatus: o.status,
      paymentStatus: o.paymentStatus,
      paymentMethod: o.paymentMethod,
      totalAmount: o.totalAmount,
      itemsTotal,
      deliveryCharge: delivery,
      itemThumb: thumb,
      itemCount: o.items.length,
      isCustomHamper: o.isCustomHamper,
      trackingNumber: o.trackingNumber,
    };
  };

  /* Fetch orders */
  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        if (!TokenManager.getToken("user")) throw new Error("Authentication required");
        
        // Updated to match backend RazorpayRoutes: GET /razorpay/my-orders/:userId
        const res = await axiosInstance.get(`/razorpay/my-orders/${userId}`);
        const list = res.data.orders as BackendOrder[];
        
        const display = list
          .map(transformOrder)
          .sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        setBackendOrders(list);
        setOrders(display);
      } catch (error: any) {
        toast({
          title: "Failed to load orders",
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId, toast]);

  const canCancelStatus = (status: OrderState) => {
    return status === "pending" || status === "processing";
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      setCancellingId(orderId);
      const res = await axiosInstance.patch(`/orders/${orderId}/cancel`);
      const updated = res.data?.order;

      if (updated) {
        setBackendOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: updated.status } : o))
        );
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, orderStatus: updated.status as OrderState } : o
          )
        );
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: updated.status });
        }
      }

      toast({
        title: "Order cancelled",
        description: "Your order has been cancelled successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Unable to cancel order",
        description:
          error?.response?.data?.message || error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setCancellingId(null);
    }
  };

  /* Loading state */
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-amber-50/40 via-orange-50/30 to-white">
          <div className="px-4 md:px-6 pt-20 pb-10">
            <div className="max-w-3xl mx-auto space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="animate-pulse border-orange-100/60">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg" />
                      <div className="flex-1 space-y-1">
                        <div className="h-3 bg-orange-100 rounded w-20" />
                        <div className="h-2 bg-orange-50 rounded w-24" />
                      </div>
                      <div className="h-5 bg-orange-100 rounded w-16" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-12 bg-orange-50 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  /* Not authenticated */
  if (!userId) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-amber-50/40 via-orange-50/30 to-white">
          <div className="px-4 md:px-6 pt-20 pb-10">
            <Card className="max-w-xs mx-auto text-center border-orange-100/60 bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-4 px-4">
                <User className="w-10 h-10 mx-auto mb-3 text-orange-400" />
                <h2 className="text-lg font-semibold mb-2 text-orange-900">Login Required</h2>
                <p className="text-orange-600 mb-4 text-sm">
                  Please log in to view orders.
                </p>
                <Button 
                  onClick={() => navigate("/login")} 
                  className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
                >
                  Go to Login
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      {/* Pastel gradient background */}
      <div className="min-h-screen bg-gradient-to-br from-amber-50/40 via-orange-50/30 to-white">
        <div className="px-4 md:px-6 pt-20 pb-10">
          <div className="max-w-5xl mx-auto">
            {/* Header - optimized for 320px */}
            <div className="mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/profile")}
                className="mb-3 -ml-2 text-orange-700 hover:text-orange-800 hover:bg-orange-50"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Profile
              </Button>
              
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-orange-700 to-amber-500 bg-clip-text text-transparent">
                    My Orders
                  </h1>
                  <p className="text-sm text-orange-700">
                    {orders.length} order{orders.length !== 1 ? "s" : ""}
                  </p>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                  disabled={loading}
                  className="border-orange-200 text-orange-700 hover:bg-orange-50"
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </div>

            {/* Empty state */}
            {orders.length === 0 ? (
              <Card className="text-center py-8 border-orange-100/60 bg-white/80 backdrop-blur-sm">
                <CardContent>
                  <Package className="w-12 h-12 mx-auto mb-3 text-orange-400" />
                  <h3 className="text-base font-semibold mb-2 text-orange-900">No Orders Yet</h3>
                  <p className="text-orange-600 mb-4 text-sm">
                    Start shopping to see orders here.
                  </p>
                  <Button 
                    onClick={() => navigate("/")} 
                    className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
                  >
                    Start Shopping
                  </Button>
                </CardContent>
              </Card>
            ) : (
              /* Orders list - Responsive grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orders.map((order, index) => {
                  const status = orderStatus[order.orderStatus];
                  const payment = payStatus[order.paymentStatus];
                  const StatusIcon = status.icon;

                  return (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card
                        className={`overflow-hidden border-orange-100/60 bg-white/90 backdrop-blur-sm ${status.borderColor} cursor-pointer`}
                        onClick={() => {
                          const full = backendOrders.find((o) => o._id === order._id);
                          if (full) {
                            setSelectedOrder(full);
                            setShowDetails(true);
                          }
                        }}
                      >
                        <CardHeader className="pb-2 px-3 pt-3">
                          <div className="flex items-center gap-2">
                            <div className={`flex-shrink-0 w-8 h-8 ${status.bgColor} rounded-lg flex items-center justify-center ${status.borderColor} border`}>
                              <StatusIcon className={`w-4 h-4 ${status.textColor}`} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1 mb-0.5">
                                <span className="font-semibold text-xs text-orange-900">
                                  #{order._id.slice(-6).toUpperCase()}
                                </span>
                                {order.isCustomHamper && (
                                  <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] px-1 py-0">
                                    <Gift className="w-2 h-2 mr-0.5" />
                                    Hamper
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-[10px] text-orange-600">
                                <span>{formatDate(order.createdAt)}</span>
                                <span>•</span>
                                <span>{formatTime(order.createdAt)}</span>
                              </div>
                            </div>
                            
                            <Badge 
                              variant={status.variant} 
                              className="text-[10px] px-2 py-0.5"
                            >
                              {status.label}
                            </Badge>
                          </div>
                        </CardHeader>

                        <CardContent className="px-3 pb-3 space-y-3">
                          {/* Order items preview */}
                          <div className="flex items-center gap-2">
                            <Avatar className="w-10 h-10 rounded-md border border-orange-100">
                              <AvatarImage 
                                src={order.itemThumb} 
                                className="object-cover"
                                onError={(e) => {
                                  const target = e.currentTarget as HTMLImageElement;
                                  target.src = PLACEHOLDER;
                                }}
                              />
                              <AvatarFallback className="rounded-md bg-orange-50">
                                <Package className="w-4 h-4 text-orange-500" />
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-orange-900">
                                {order.itemCount} item{order.itemCount > 1 ? "s" : ""}
                              </p>
                              <div className="text-[10px] text-orange-600">
                                Items ₹{order.itemsTotal.toFixed(2)} + Delivery ₹{order.deliveryCharge.toFixed(2)}
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <p className="font-bold text-sm bg-gradient-to-r from-orange-700 to-amber-500 bg-clip-text text-transparent">
                                ₹{order.totalAmount.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <Separator className="bg-orange-100/60" />

                          {/* Progress bar for active orders */}
                          {order.orderStatus !== "cancelled" && order.orderStatus !== "failed" && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] text-orange-700">
                                <span>Progress</span>
                                <span>{status.progress}%</span>
                              </div>
                              <Progress 
                                value={status.progress} 
                                className="h-1.5 bg-orange-100/60"
                              />
                            </div>
                          )}

                          {/* Payment info */}
                          <div className="flex items-center justify-between text-[10px]">
                            <div className="flex items-center gap-1 text-orange-700">
                              <CreditCard className="w-3 h-3" />
                              <span className="uppercase font-medium">
                                {order.paymentMethod}
                              </span>
                            </div>
                            
                            <Badge 
                              variant={payment.variant} 
                              className="text-[9px] px-1.5 py-0"
                            >
                              {payment.label}
                            </Badge>
                          </div>

                          {/* Tracking number */}
                          {order.trackingNumber && (
                            <div className="bg-orange-50/60 rounded-lg p-2 border border-orange-100/60">
                              <div className="flex items-center gap-1 text-[10px] text-orange-700">
                                <Truck className="w-3 h-3" />
                                <span className="font-medium">Tracking:</span>
                                <span className="font-mono text-[9px]">{order.trackingNumber}</span>
                              </div>
                            </div>
                          )}
                          {canCancelStatus(order.orderStatus) && (
                            <div className="pt-2 flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 px-3 text-[11px] border-red-500 text-red-600 hover:bg-red-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmCancelId(order._id);
                                }}
                              >
                                Cancel Order
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-3 md:px-4">
          <div className="w-full max-w-md md:max-w-lg bg-white rounded-2xl shadow-2xl border border-orange-100 overflow-hidden">
            <div className="px-5 py-4 bg-gradient-to-r from-orange-600 to-amber-500 text-white flex items-center justify-between">
              <div>
                <p className="text-xs opacity-80">Order</p>
                <p className="text-sm font-semibold">#{selectedOrder._id.slice(-6).toUpperCase()}</p>
              </div>
              <Badge className="bg-white/10 text-white text-[10px] px-2 py-0.5 border border-white/20">
                {selectedOrder.status}
              </Badge>
            </div>

            <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Status + amount */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-orange-600 font-medium">Placed on</p>
                  <p className="text-sm font-semibold text-orange-900">
                    {formatDate(selectedOrder.createdAt)} • {formatTime(selectedOrder.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-orange-600 font-medium">Total</p>
                  <p className="text-lg font-bold text-orange-800">₹{selectedOrder.totalAmount.toFixed(2)}</p>
                </div>
              </div>

              {/* Status progress */}
              {(() => {
                const st = orderStatus[selectedOrder.status];
                return (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-orange-700">
                      <span>Order Status</span>
                      <span>{st.label}</span>
                    </div>
                    <Progress value={st.progress} className="h-1.5 bg-orange-100/70" />
                  </div>
                );
              })()}

              {/* Shipping */}
              <div className="border border-orange-100 rounded-xl p-3 bg-orange-50/40">
                <p className="text-xs font-semibold text-orange-700 mb-1 flex items-center gap-1">
                  <Truck className="w-3 h-3" /> Shipping Address
                </p>
                <p className="text-[11px] text-orange-900">
                  {selectedOrder.shippingAddress?.street}
                </p>
                <p className="text-[11px] text-orange-900">
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}
                </p>
                <p className="text-[11px] text-orange-900">
                  {selectedOrder.shippingAddress?.pincode}, {selectedOrder.shippingAddress?.country}
                </p>
              </div>

              {/* Payment info */}
              <div className="border border-orange-100 rounded-xl p-3 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2 text-orange-700">
                  <CreditCard className="w-3 h-3" />
                  <div>
                    <p className="font-semibold uppercase">
                      {selectedOrder.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
                    </p>
                    <p className="text-[10px] text-orange-600">Payment status: {selectedOrder.paymentStatus}</p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs font-semibold text-orange-700 mb-2">Items ({selectedOrder.items.length})</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => {
                    let name = item.name;
                    if (!name && typeof item.productId === "object" && item.productId) {
                      name = item.productId.Product_name || item.productId.name;
                    }
                    const price = item.price;
                    const thumb =
                      typeof item.productId === "object" && item.productId
                        ? item.productId.Product_image?.[0] || item.productId.image
                        : item.image;

                    return (
                      <div
                        key={item._id || `${selectedOrder._id}-${idx}`}
                        className="flex items-center gap-3 border border-orange-100 rounded-lg p-2 bg-white"
                      >
                        <div className="w-12 h-12 rounded-md bg-orange-50 overflow-hidden flex items-center justify-center">
                          {thumb ? (
                            <img src={thumb} alt={name || "Item"} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-orange-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-orange-900 truncate">{name || "Item"}</p>
                          <p className="text-[11px] text-orange-600">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right text-xs text-orange-800 font-semibold">
                          ₹{(price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-orange-100 flex justify-end gap-2 bg-orange-50/60">
              <Button
                variant="outline"
                size="sm"
                className="border-orange-200 text-orange-700 hover:bg-orange-100"
                onClick={() => {
                  setShowDetails(false);
                  setSelectedOrder(null);
                }}
              >
                Close
              </Button>
              {canCancelStatus(selectedOrder.status as OrderState) && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setConfirmCancelId(selectedOrder._id)}
                >
                  Cancel Order
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {confirmCancelId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-orange-100 p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center border border-red-100">
                <XCircle className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-orange-900">Cancel this order?</h2>
                <p className="text-xs text-orange-700 mt-1">
                  This will cancel your order and it cannot be undone. You can place a new order anytime.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="border-orange-200 text-orange-700 hover:bg-orange-50"
                onClick={() => setConfirmCancelId(null)}
              >
                Keep Order
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={cancellingId === confirmCancelId}
                onClick={async () => {
                  if (confirmCancelId) {
                    await handleCancelOrder(confirmCancelId);
                    setConfirmCancelId(null);
                  }
                }}
              >
                {cancellingId === confirmCancelId ? "Cancelling..." : "Confirm Cancel"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Orders;