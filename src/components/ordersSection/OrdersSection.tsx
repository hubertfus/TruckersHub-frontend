import { useEffect, useState } from "react";
import { UserSearch, X, Truck, Check } from "lucide-react";
import { useUser } from "../../ctx/UserContext";
import axios from "axios";
import Tabs from "../tabs/Tabs";
import OrderList from "../orderList/OrderList";
import { Order } from "../../types/order";
import Dialog from "../dialog/Dialog";
import TextInput from "../textInput/TextInput";
import DatePicker from "../datePicker/DatePicker";
import ToastGroup from "../toastGroup/ToastGroup";
import Toast from "../toast/Toast";

function OrdersSection() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [data, setData] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [orderNumber, setOrderNumber] = useState<string>("");
  const [orderDtType, setOrderDtType] = useState<string>("");
  const [orderDtWeight, setOrderDtWeight] = useState<string>("");
  const [orderDtLength, setOrderDtLength] = useState<string>("");
  const [orderDtWidth, setOrderDtWidth] = useState<string>("");
  const [orderDtHeight, setOrderDtHeight] = useState<string>("");
  const [pickupStreet, setPickupStreet] = useState<string>("");
  const [pickupCity, setPickupCity] = useState<string>("");
  const [pickupZip, setPickupZip] = useState<string>("");
  const [pickupCountry, setPickupCountry] = useState<string>("");
  const [deliveryStreet, setDeliveryStreet] = useState<string>("");
  const [deliveryCity, setDeliveryCity] = useState<string>("");
  const [deliveryZip, setDeliveryZip] = useState<string>("");
  const [deliveryCountry, setDeliveryCountry] = useState<string>("");
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] =
    useState<string>("");
  const [toasts, setToasts] = useState<{ type: string; message: string }[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `http://${import.meta.env.VITE_API_ADDRESS}/orders`,
          { params: { role: user.role } }
        );
        setData(data.data);
        setToasts((prev) => [
          ...prev,
          { type: "success", message: data.message },
        ]);
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

  const handleAction = async (action: string, value?: any) => {
    if (action === "complete") {
      try {
        const { data } = await axios.post(
          `http://${import.meta.env.VITE_API_ADDRESS}/orders/complete`,
          { userId: user?.id, orderId: value }
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

    if (action === "delete") {
      try {
        const { data } = await axios.delete(
          `http://${import.meta.env.VITE_API_ADDRESS}/orders/${value}`,
          { data: { userId: user?.id, orderId: value } }
        );
        setToasts((prev) => [
          ...prev,
          { type: "success", message: data.message },
        ]);

        setData((prev: Order[]) => prev.filter((order) => order._id !== value));
      } catch (error) {
        console.error(error);
      }
      return;
    }

    if (action === "assignDriver") {
      try {
        const { data } = await axios.post(
          `http://${import.meta.env.VITE_API_ADDRESS}/orders/assign-driver`,
          {
            userId: user?.id,
            orderId: value.orderId,
            driverId: value.driverId,
            dispatcherId: user?.id,
          }
        );
        setData((prev: Order[]) =>
          prev.map((order) =>
            order._id === value.orderId
              ? {
                  ...order,
                  status: data.order.status,
                  assigned_driver: data.order.assigned_driver,
                  driver_info: data.order.driver_info,
                }
              : order
          )
        );
        setToasts((prev) => [
          ...prev,
          { type: "success", message: data.message },
        ]);

        const dialog = document.getElementById(
          `assignDriverDialog${value.orderId}`
        );
        if (dialog && dialog instanceof HTMLDialogElement) {
          dialog.close();
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (action === "assignVehicle") {
      try {
        const { data } = await axios.post(
          `http://${import.meta.env.VITE_API_ADDRESS}/orders/assign-vehicle`,
          {
            userId: user?.id,
            orderId: value.orderId,
            vehicleId: value.vehicleId,
            dispatcherId: user?.id,
          }
        );

        setData((prev: Order[]) =>
          prev.map((order) =>
            order._id === value.orderId
              ? {
                  ...order,
                  vehicle_info: data.order.vehicle_info,
                  vehicle_id: data.order.vehicle_id,
                }
              : order
          )
        );
        setToasts((prev) => [
          ...prev,
          { type: "success", message: data.message },
        ]);

        const dialog = document.getElementById(
          `assignVehicleDialog${value.orderId}`
        );
        if (dialog && dialog instanceof HTMLDialogElement) {
          dialog.close();
        }
      } catch (error) {
        console.error(error);
      }
    }
    if (action === "editOrder") {
      try {
        const { data } = await axios.put(
          `http://${import.meta.env.VITE_API_ADDRESS}/orders/update`,
          {
            userId: user?.id,
            orderId: value.orderId,
            updatedOrderData: value.updatedData,
            dispatcherId: user?.id,
          }
        );
        setToasts((prev) => [
          ...prev,
          { type: "success", message: data.message },
        ]);
        setData((prev: Order[]) =>
          prev.map((order) =>
            order._id === value.orderId
              ? {
                  ...data.order,
                  assigned_driver: order.assigned_driver,
                  vehicle_id: order.vehicle_id,
                  vehicle_info: order.vehicle_info,
                  driver_info: order.driver_info,
                }
              : order
          )
        );
      } catch (error) {
        console.error("Error updating order:", error);
      }
    }
  };

  const handleSubmit = async () => {
    const newOrder = {
      order_number: orderNumber,
      load_details: {
        type: orderDtType,
        weight: parseFloat(orderDtWeight),
        dimensions: {
          length: parseFloat(orderDtLength),
          width: parseFloat(orderDtWidth),
          height: parseFloat(orderDtHeight),
        },
      },
      pickup_address: {
        street: pickupStreet,
        city: pickupCity,
        zip_code: pickupZip,
        country: pickupCountry,
      },
      delivery_address: {
        street: deliveryStreet,
        city: deliveryCity,
        zip_code: deliveryZip,
        country: deliveryCountry,
      },
      estimated_delivery_time: estimatedDeliveryTime
        ? new Date(estimatedDeliveryTime)
        : null,
    };

    try {
      const { data } = await axios.post(
        `http://${import.meta.env.VITE_API_ADDRESS}/orders/create`,
        { newOrder: newOrder, userId: user?.id }
      );

      const dialog = document.getElementById("order");
      if (dialog && dialog instanceof HTMLDialogElement) {
        dialog.close();
      }

      setOrderNumber("");
      setOrderDtType("");
      setOrderDtWeight("");
      setOrderDtLength("");
      setOrderDtWidth("");
      setOrderDtHeight("");
      setPickupStreet("");
      setPickupCity("");
      setPickupZip("");
      setPickupCountry("");
      setDeliveryStreet("");
      setDeliveryCity("");
      setDeliveryZip("");
      setDeliveryCountry("");
      setEstimatedDeliveryTime("");

      setData((prev) => [data.data, ...prev]);
      setToasts((prev) => [
        ...prev,
        { type: "success", message: data.message },
      ]);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const closeToastHandle = (index: number) => {
    setToasts((prev) => prev.filter((_, indx) => indx !== index));
  };

  if (error) {
    return <p className="text-red-500">Error fetching orders: {error}</p>;
  }

  return (
    <div className="overflow-hidden">
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
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <OrderList
        orders={filteredOrders(activeTab)}
        onAction={handleAction}
        role="dispatcher"
      />
      <div className="fixed bottom-4 right-4">
        <button
          className="btn btn-neutral btn-xs sm:btn-sm md:btn-md lg:btn-lg"
          onClick={() => {
            const dialog = document.getElementById("createOrder");
            if (dialog && dialog instanceof HTMLDialogElement) {
              dialog.showModal();
            }
          }}
        >
          Create order
        </button>
      </div>

      <Dialog
        id="createOrder"
        title="Create Order"
        acceptText="Accept"
        closeText="Cancel"
        onAccept={handleSubmit}
      >
        <TextInput
          label="Order number:"
          name="orderNumber"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          required
        />
        <h2 className="font-bold text-center pt-8">Load Details</h2>
        <TextInput
          label="Type"
          name="orderDtType"
          value={orderDtType}
          onChange={(e) => setOrderDtType(e.target.value)}
          required
        />
        <TextInput
          label="Weight"
          name="orderDtWeight"
          value={orderDtWeight}
          onChange={(e) => setOrderDtWeight(e.target.value)}
          required
        />
        <h3 className="font-bold text-center pt-8">Dimensions</h3>
        <div className="flex space-x-4">
          <TextInput
            label="Length"
            name="orderDtLength"
            value={orderDtLength}
            onChange={(e) => setOrderDtLength(e.target.value)}
            required
          />
          <TextInput
            label="Width"
            name="orderDtWidth"
            value={orderDtWidth}
            onChange={(e) => setOrderDtWidth(e.target.value)}
            required
          />
          <TextInput
            label="Height"
            name="orderDtHeight"
            value={orderDtHeight}
            onChange={(e) => setOrderDtHeight(e.target.value)}
            required
          />
        </div>
        <h2 className="font-bold text-center pt-8">Addresses</h2>
        <TextInput
          label="Pickup Street"
          name="pickupStreet"
          value={pickupStreet}
          onChange={(e) => setPickupStreet(e.target.value)}
          required
        />
        <TextInput
          label="Pickup City"
          name="pickupCity"
          value={pickupCity}
          onChange={(e) => setPickupCity(e.target.value)}
          required
        />
        <TextInput
          label="Pickup ZIP Code"
          name="pickupZip"
          value={pickupZip}
          onChange={(e) => setPickupZip(e.target.value)}
          required
        />
        <TextInput
          label="Pickup Country"
          name="pickupCountry"
          value={pickupCountry}
          onChange={(e) => setPickupCountry(e.target.value)}
          required
        />
        <TextInput
          label="Delivery Street"
          name="deliveryStreet"
          value={deliveryStreet}
          onChange={(e) => setDeliveryStreet(e.target.value)}
          required
        />
        <TextInput
          label="Delivery City"
          name="deliveryCity"
          value={deliveryCity}
          onChange={(e) => setDeliveryCity(e.target.value)}
          required
        />
        <TextInput
          label="Delivery ZIP Code"
          name="deliveryZip"
          value={deliveryZip}
          onChange={(e) => setDeliveryZip(e.target.value)}
          required
        />
        <TextInput
          label="Delivery Country"
          name="deliveryCountry"
          value={deliveryCountry}
          onChange={(e) => setDeliveryCountry(e.target.value)}
          required
        />
        <DatePicker
          label="Estimate delivery time"
          name="estimatedDeliveryTime"
          value={estimatedDeliveryTime}
          onChange={(date) => setEstimatedDeliveryTime(date)}
          required
        />
      </Dialog>
    </div>
  );
}

export default OrdersSection;
