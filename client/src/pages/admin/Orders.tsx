import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";

const orderStatusColors: { [key: string]: string } = {
  pending: "bg-yellow-500",
  processing: "bg-blue-500",
  shipped: "bg-purple-500",
  outForDelivery: "bg-indigo-500",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
  failed: "bg-red-500",
};

const paymentStatusColors: { [key: string]: string } = {
  pending: "bg-yellow-500",
  paid: "bg-green-500",
  failed: "bg-red-500",
  initiated: "bg-blue-500",
};

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const adminToken = localStorage.getItem("admin_token");

      const res = await axios.get(`${API_URL}/orders/admin/all`, {
        withCredentials: true,
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
      });
      setOrders(res.data.orders || []);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const adminToken = localStorage.getItem("admin_token");
      await axios.patch(
        `${API_URL}/orders/admin/${orderId}/status`,
        { status },

        {
          withCredentials: true,
          headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
        }
      );

      setOrders(orders.map((order) =>
        order._id === orderId ? { ...order, status } : order
      ));

      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Orders Management</h1>

      {loading ? (
        <div className="text-center">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-500">No orders found</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => {
                  const customer = order.userId || order.user;
                  return (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer?.firstName || "Unknown"}<br />
                        <span className="text-xs">{customer?.email || "No email"}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {order.items?.map((item: any) => {
                          const itemName =
                            item.name ||
                            item.productId?.Product_name ||
                            item.productId?.name ||
                            "Item";
                          return (
                            <div
                              key={item._id || `${item.productId}-${item.quantity}`}
                              className="mb-1"
                            >
                              {itemName} x {item.quantity}
                            </div>
                          );
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ₹{order.totalAmount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(order.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-gray-600">
                            {order.paymentMethod === "cod"
                              ? "Cash on Delivery"
                              : "Online Payment"}
                          </span>
                          <Badge
                            className={`${paymentStatusColors[order.paymentStatus] || "bg-gray-400"}`}
                          >
                            {order.paymentStatus}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Select
                          value={order.status}
                          onValueChange={(value) => updateOrderStatus(order._id, value)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue>
                              <Badge
                                className={`${orderStatusColors[order.status] || "bg-gray-400"}`}
                              >
                                {order.status}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="outForDelivery">Out for delivery</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <button
                          className="px-3 py-1 text-xs rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowDetails(true);
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {showDetails && selectedOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">
                    Order #{selectedOrder._id?.slice(-6)?.toUpperCase()}
                  </h2>
                  <button
                    className="text-gray-500 hover:text-gray-700 text-sm"
                    onClick={() => {
                      setShowDetails(false);
                      setSelectedOrder(null);
                    }}
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-4 text-sm">
                  <div>
                    <p className="font-medium">Customer</p>
                    <p className="text-gray-700">
                      {(selectedOrder.userId || selectedOrder.user)?.firstName || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(selectedOrder.userId || selectedOrder.user)?.email || "No email"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Placed On</p>
                      <p className="text-gray-700">
                        {format(new Date(selectedOrder.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Total Amount</p>
                      <p className="text-gray-700">₹{selectedOrder.totalAmount}</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium mb-1">Payment</p>
                    <p className="text-xs text-gray-600">
                      {selectedOrder.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
                    </p>
                    <Badge
                      className={`${paymentStatusColors[selectedOrder.paymentStatus] || "bg-gray-400"} mt-1`}
                    >
                      {selectedOrder.paymentStatus}
                    </Badge>
                  </div>

                  {selectedOrder.shippingAddress && (
                    <div>
                      <p className="font-medium mb-1">Shipping Address</p>
                      <p className="text-xs text-gray-700">
                        {selectedOrder.shippingAddress.street}
                      </p>
                      <p className="text-xs text-gray-700">
                        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                      </p>
                      <p className="text-xs text-gray-700">
                        {selectedOrder.shippingAddress.pincode}, {selectedOrder.shippingAddress.country}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="font-medium mb-1">Items</p>
                    <div className="space-y-1">
                      {selectedOrder.items?.map((item: any) => {
                        const itemName =
                          item.name ||
                          item.productId?.Product_name ||
                          item.productId?.name ||
                          "Item";

                        return (
                          <div
                            key={item._id || `${item.productId}-${item.quantity}`}
                            className="flex items-center justify-between text-xs text-gray-700"
                          >
                            <span>
                              {itemName} x {item.quantity}
                            </span>
                            {item.price && (
                              <span>
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}