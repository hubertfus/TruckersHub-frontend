import { useEffect, useState } from "react";
import { Order } from "../../types/order.ts";
import axios from "axios";
import OrderCard from "../../components/orderCard/OrderCard.tsx";
import { X, Truck, UserSearch, Check } from "lucide-react";
import { useUser } from "../../ctx/UserContext";
import { useNavigate } from "react-router-dom";
import Tabs from "../../components/tabs/Tabs";
import ToastGroup from "../../components/toastGroup/ToastGroup.tsx";
import Toast from "../../components/toast/Toast.tsx";

function DispatcherViewPage() {
  const [data, setData] = useState<Order[]>([]);
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [toasts, setToasts] = useState<{ type: string; message: string }[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `http://${import.meta.env.VITE_API_ADDRESS}/orders`,
          {
            params: { role: user.role, driverId: user.id },
          }
        );
        setData(data.data);
        setToasts((prev) => [
          ...prev,
          { type: "success", message: data.message },
        ]);
      } catch (error: any) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchData();
  }, [user, navigate]);

  const filteredOrders = (status: string) => {
    if (status === "all") return data;
    return data.filter((order) => order.status === status);
  };

  const tabs = [
    { key: "all", label: "All" },
    { key: "created", label: "Created", icon: UserSearch },
    { key: "cancelled", label: "Cancelled", icon: X },
    { key: "in_progress", label: "In Progress", icon: Truck },
    { key: "completed", label: "Completed", icon: Check },
  ];

  async function handleAction(action: string, value?: any) {
    if (action === "accept") {
      try {
        const { data } = await axios.post(
          `http://${import.meta.env.VITE_API_ADDRESS}/orders/accept`,
          {
            userId: user?.id,
            orderId: value,
          }
        );
        setToasts((prev) => [
          ...prev,
          { type: "success", message: data.message },
        ]);

        const { data: updatedOrder } = await axios.get(
          `http://${import.meta.env.VITE_API_ADDRESS}/orders/${value}`
        );
        setData((prev: Order[]) =>
          prev.map((order) => (order._id === value ? updatedOrder : order))
        );
      } catch (error) {
        console.error(error);
      }
      return;
    }
    if (action === "cancel") {
      try {
        const { data } = await axios.post(
          `http://${import.meta.env.VITE_API_ADDRESS}/orders/cancel`,
          {
            userId: user?.id,
            orderId: value,
          }
        );
        setToasts((prev) => [
          ...prev,
          { type: "success", message: data.message },
        ]);

        const { data: updatedOrder } = await axios.get(
          `http://${import.meta.env.VITE_API_ADDRESS}/orders/${value}`
        );
        setData((prev: Order[]) =>
          prev.map((order) => (order._id === value ? updatedOrder : order))
        );
      } catch (error) {
        console.error(error);
      }
    }
  }

  const closeToastHandle = (index: number) => {
    setToasts((prev) => prev.filter((_, indx) => indx !== index));
  };

  return (
    <div className="p-5">
      <ToastGroup>
        {toasts?.map((toast, index) => (
          <Toast
            key={index}
            type={toast.type}
            message={toast.message}
            onClose={closeToastHandle}
            index={index}
          />
        ))}
      </ToastGroup>
      <h2 className="text-center">Available Orders</h2>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex flex-wrap flex-row gap-5 justify-center pt-16 p-4">
        {filteredOrders(activeTab).map((order) => (
          <OrderCard
            key={order._id}
            {...order}
            role={"driver"}
            onAction={handleAction}
          />
        ))}
        {filteredOrders(activeTab).length === 0 && (
          <p className="text-gray-500">
            No orders available for this category.
          </p>
        )}
      </div>
    </div>
  );
}

export default DispatcherViewPage;
