import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { CalendarClock, Package, Truck, User } from "lucide-react";
import { Order } from "../../types/order";
import { LocationInfo } from "./LocationInfo";

function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const { data } = await axios.get(
          `http://${import.meta.env.VITE_API_ADDRESS}/orders/${id}`
        );
        setOrderData(data);
      } catch (err) {
        console.error("Error fetching order data:", err);
        setError("Failed to load order data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <p className="text-lg font-semibold text-base-content/70">
          Loading order details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <p className="text-lg font-semibold text-error">{error}</p>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <p className="text-lg font-semibold text-base-content/70">
          No order data available.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Order Details</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {orderData.order_number}
                </p>
              </div>
            </div>
            <span className="ml-auto px-4 py-2 rounded-full bg-accent text-accent-content capitalize">
              {orderData.status.replace("_", " ")}
            </span>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Load Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                <p className="font-medium mt-1">
                  {orderData.load_details.type}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Weight
                </p>
                <p className="font-medium mt-1">
                  {orderData.load_details.weight}kg
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Dimensions
                </p>
                <p className="font-medium mt-1">
                  {orderData.load_details.dimensions.length}m ×{" "}
                  {orderData.load_details.dimensions.width}m ×{" "}
                  {orderData.load_details.dimensions.height}m
                </p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200 dark:border-gray-700" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-6">
            <LocationInfo type="pickup" address={orderData.pickup_address} />
            <LocationInfo
              type="delivery"
              address={orderData.delivery_address}
            />
          </div>

          <hr className="border-gray-200 dark:border-gray-700" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6">
            <div className="flex items-start gap-3">
              <div className="text-gray-500 dark:text-gray-400 mt-0.5">
                <User className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Driver
                </p>
                <Link
                  to={`/users/${orderData.assigned_driver}`}
                  className="font-medium"
                >
                  {orderData.driver_info}
                </Link>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-gray-500 dark:text-gray-400 mt-0.5">
                <Truck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Vehicle
                </p>
                <p className="font-medium">{orderData.vehicle_info}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-gray-500 dark:text-gray-400 mt-0.5">
                <CalendarClock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Estimated Delivery
                </p>
                <p className="font-medium">
                  {orderData.estimated_delivery_time}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
