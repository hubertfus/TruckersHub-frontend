import { Package, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

type Order = {
  _id: string;
  order_number: string;
  load_details: {
    type: string;
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
  };
  pickup_address: {
    street: string;
    city: string;
    zip_code: string;
    country: string;
  };
  delivery_address: {
    street: string;
    city: string;
    zip_code: string;
    country: string;
  };
  status: string;
  created_at: string;
};

type OrderHistoryItemProps = {
  order: Order;
};

export function OrderHistoryItem({ order }: OrderHistoryItemProps) {
  const statusColor =
    order.status === "completed"
      ? "bg-success text-success-content"
      : "bg-error text-error-content";

  return (
    <Link to={`/order/${order._id}`}>
      <div className="border border-base-300 rounded-lg p-4 hover:shadow-md transition-shadow bg-base-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Package className="w-5 h-5" />
            <div>
              <p className="font-semibold text-base-content">
                {order.order_number}
              </p>
              <p className="text-sm">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm capitalize ${statusColor}`}
          >
            {order.status.replace("_", " ")}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm">
              <span className="font-semibold">Type:</span>{" "}
              {order.load_details.type}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Weight:</span>{" "}
              {order.load_details.weight}kg
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-info" />
              <p className="text-sm">
                {order.pickup_address.city}, {order.pickup_address.country}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-error" />
              <p className="text-sm">
                {order.delivery_address.city}, {order.delivery_address.country}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
