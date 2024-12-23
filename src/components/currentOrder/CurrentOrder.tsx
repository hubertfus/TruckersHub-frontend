import { Package, MapPin } from 'lucide-react';
import { Order } from '../../pages/userDetails/UserDetails';

export function CurrentOrder( order : Order) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-green-100 p-3 rounded-full">
          <Package className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Current Order</h3>
          <p className="text-sm text-gray-600">{order.order_number}</p>
        </div>
        <span className="ml-auto px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 capitalize">
          {order.status.replace('_', ' ')}
        </span>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Load Details</h4>
            <p className="text-gray-600">Type: {order.load_details.type}</p>
            <p className="text-gray-600">Weight: {order.load_details.weight}kg</p>
            <p className="text-gray-600">
              Dimensions: {order.load_details.dimensions.length}m × {order.load_details.dimensions.width}m × {order.load_details.dimensions.height}m
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              <h4 className="font-semibold text-gray-700">Pickup Location</h4>
            </div>
            <div className="pl-7">
              <p className="text-gray-600">{order.pickup_address.street}</p>
              <p className="text-gray-600">{order.pickup_address.city}, {order.pickup_address.zip_code}</p>
              <p className="text-gray-600">{order.pickup_address.country}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="w-5 h-5 text-red-500" />
              <h4 className="font-semibold text-gray-700">Delivery Location</h4>
            </div>
            <div className="pl-7">
              <p className="text-gray-600">{order.delivery_address.street}</p>
              <p className="text-gray-600">{order.delivery_address.city}, {order.delivery_address.zip_code}</p>
              <p className="text-gray-600">{order.delivery_address.country}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}