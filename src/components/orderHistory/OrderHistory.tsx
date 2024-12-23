import { History } from 'lucide-react';
import { OrderHistoryItem } from './OrderHistoryItem';
import { Order } from '../../pages/userDetails/UserDetails';

type OrderHistoryProps = {
  orders: Order[];
};

export function OrderHistory({ orders }: OrderHistoryProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-indigo-100 p-3 rounded-full">
          <History className="w-8 h-8 text-indigo-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">Order History</h3>
      </div>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderHistoryItem key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
}