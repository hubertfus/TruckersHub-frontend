import { Package, MapPin } from "lucide-react";
import { Order } from "../../pages/userDetails/UserDetails";
import { Link } from "react-router-dom";

export function CurrentOrder(order: Order) {
  return (
    <Link
      to={`/order/${order._id}`}
      className="bg-base-100 rounded-lg shadow-lg p-6 mb-6"
    >
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-primary p-3 rounded-full">
          <Package className="w-8 h-8 text-primary-content" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-base-content">Current Order</h3>
          <p className="text-sm ">{order.order_number}</p>
        </div>
        <span className="ml-auto px-4 py-2 rounded-full bg-accent text-accent-content capitalize">
          {order.status.replace("_", " ")}
        </span>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-base-content mb-2">
              Load Details
            </h4>
            <p>Type: {order.load_details.type}</p>
            <p>Weight: {order.load_details.weight}kg</p>
            <p>
              Dimensions: {order.load_details.dimensions.length}m ×{" "}
              {order.load_details.dimensions.width}m ×{" "}
              {order.load_details.dimensions.height}m
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-5 h-5 text-info" />
              <h4 className="font-semibold text-base-content">
                Pickup Location
              </h4>
            </div>
            <div className="pl-7">
              <p>{order.pickup_address.street}</p>
              <p>
                {order.pickup_address.city}, {order.pickup_address.zip_code}
              </p>
              <p>{order.pickup_address.country}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-5 h-5 text-error" />
              <h4 className="font-semibold text-base-content">
                Delivery Location
              </h4>
            </div>
            <div className="pl-7">
              <p>{order.delivery_address.street}</p>
              <p>
                {order.delivery_address.city}, {order.delivery_address.zip_code}
              </p>
              <p>{order.delivery_address.country}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
