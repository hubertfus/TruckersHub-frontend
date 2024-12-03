import { useEffect, useState } from "react";
import { UserSearch, X, Truck, Check } from "lucide-react";
import { useUser } from "../../ctx/UserContext";

import axios from "axios";
import Tabs from "../tabs/Tabs";
import OrderList from "../orderList/OrderList";
import { Order } from "../../types/order";

function OrdersSection() {
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState<string>("all");
    const [data, setData] = useState<Order[]>([]); // Correctly typing the state as Order[]
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            return;
        }

        const fetchData = async () => {
            try {
                const response = await axios.get(`http://${import.meta.env.VITE_API_ADDRESS}/orders`, {
                    params: { role: user.role },
                });
                setData(response.data);
            } catch (err: any) {
                console.error("Error fetching orders:", err);
                setError(err.message || "Unknown error occurred");
            }
        };

        fetchData();
    }, [user]);

    const filteredOrders = (status: string) => {
        if (status === "all") return data;
        return data.filter((order: Order) => order.status === status);
    };

    const tabs = [
        { key: "all", label: "All" },
        { key: "created", label: "Created", icon: UserSearch },
        { key: "cancelled", label: "Cancelled", icon: X },
        { key: "in_progress", label: "In Progress", icon: Truck },
        { key: "completed", label: "Completed", icon: Check },
    ];

    async function handleAction(action: string, value?: any) {
        if (action === "complete") {
            try {
                await axios.post(`http://${import.meta.env.VITE_API_ADDRESS}/orders/complete`, {
                    userId: user?.id,
                    orderId: value,
                });

                const { data: updatedOrder } = await axios.get(
                    `http://${import.meta.env.VITE_API_ADDRESS}/orders/${value}`
                );
                setData((prev: Order[]) =>
                    prev.map((order) =>
                        order._id === value ? updatedOrder : order
                    )
                );
            } catch (error) {
                console.error(error);
            }
            return;
        }
        if (action === "delete") {
            try {
                await axios.delete(`http://${import.meta.env.VITE_API_ADDRESS}/orders/${value}`, {
                    data: {
                        userId: user?.id,  
                        orderId: value,     
                    }
                });
        
                setData((prev: Order[]) =>
                    prev.filter((order) => order._id !== value)
                );
            } catch (error) {
                console.error(error);
            }
            return;
        }
        
    }

    if (error) {
        return <p className="text-red-500">Error fetching orders: {error}</p>;
    }

    return (
        <div>
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            <OrderList orders={filteredOrders(activeTab)} onAction={handleAction} />
        </div>
    );
}

export default OrdersSection;
