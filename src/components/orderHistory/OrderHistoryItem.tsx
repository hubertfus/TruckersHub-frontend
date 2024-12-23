import { Package, MapPin } from 'lucide-react';

type Order = {
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
  const statusColor = order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Package className="w-5 h-5 text-gray-500" />
          <div>
            <p className="font-semibold text-gray-800">{order.order_number}</p>
            <p className="text-sm text-gray-500">
              {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm capitalize ${statusColor}`}>
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Type:</span> {order.load_details.type}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Weight:</span> {order.load_details.weight}kg
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            <p className="text-sm text-gray-600">
              {order.pickup_address.city}, {order.pickup_address.country}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-red-500" />
            <p className="text-sm text-gray-600">
              {order.delivery_address.city}, {order.delivery_address.country}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}