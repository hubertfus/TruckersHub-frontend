import OrderCard from "../../components/orderCard/OrderCard";
import { User } from "../../ctx/UserContext";
import { Order } from "../../types/order";

interface OrderListProps {
  orders: Order[];
  onAction: (action: string, value?: any) => void;
  role: Pick<User, "role">["role"]
}

function OrderList({ orders, onAction,role }: OrderListProps) {
  // if (orders) {
  //   return <p className="text-gray-500">No orders available for this category.</p>;
  // }
  return (
    <div className="flex flex-wrap flex-row gap-5 justify-center pt-16 p-4">
      {orders ? orders.map((order:Order) => (
        <OrderCard key={order._id} order={order} role={role} onAction={onAction} />
      )): <p className="text-gray-500">No orders available for this category.</p>}
    </div>
  );
}

export default OrderList;
