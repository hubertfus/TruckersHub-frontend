import OrderCard from "../../components/orderCard/OrderCard";
import { Order } from "../../types/order";

interface OrderListProps {
    orders: Order[];
    onAction: (action: string, value?: any) => void;
}

function OrderList({ orders, onAction }: OrderListProps) {
    if (orders.length === 0) {
        return <p className="text-gray-500">No orders available for this category.</p>;
    }

    return (
        <div className="flex flex-wrap flex-row gap-5 justify-center pt-16 p-4">
            {orders.map((order) => (
                <OrderCard key={order._id} {...order} role="dispatcher"  onAction={onAction}/>
            ))}
        </div>
    );
}

export default OrderList;
