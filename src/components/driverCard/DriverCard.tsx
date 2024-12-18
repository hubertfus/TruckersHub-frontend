import { useState } from "react";
import Dialog from "../dialog/Dialog";
import TextInput from "../textInput/TextInput";
import { User } from "../../ctx/UserContext";
import OrderList from "../orderList/OrderList";
import { Order } from "../../types/order";
import axios from "axios";

interface DriverCardProps {
  driver: any;
  onSelect?: (userId: string) => void;
  onAction?: (action: string, value?: any) => void;
  role: Pick<User, "role">["role"]
}

const DriverCard = ({
  driver,
  onSelect,
  onAction,
  role
}: DriverCardProps) => {
  const driverName = driver.name || '';
  const [editedDriver, setEditedDriver] = useState({
    name: driver.name || '',
    email: driver.email || '',
    phone: driver.phone || '',
    license_number: driver.license_number || '',
  });
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([])

  const handleInputChange = (field: string, value: string) => {
    setEditedDriver((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (!editedDriver.name || !editedDriver.email || !editedDriver.phone || !editedDriver.license_number) {
      setDialogError("All fields are required.");
      return;
    }

    onAction && onAction("edit",{editedDriver:editedDriver, driverId: driver._id})

    setDialogError(null); 
  };

  const handleAction = async (action: string, value?: any) =>{
    if(action==="click"){
      onAction && onAction("assignToOrder",{orderId:value, driverId: driver._id})
    }
  }

  return (
    <div
      key={driver._id}
      className="card cursor-pointer bg-base-100 shadow-lg border border-gray-200 p-6 flex flex-col items-center justify-between space-y-4 transition-transform hover:scale-105"
      onClick={() => onSelect && onSelect(driver._id)}
    >
      <div className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold text-white bg-blue-500">
        {driverName
          .split(" ")
          .map((namePart: string) => namePart[0])
          .join("")}
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">{driverName}</h2>
        <p className="text-sm text-gray-500">
          License: {driver.license_number || "N/A"}
        </p>
        <p className="text-sm text-gray-500">Phone: {driver.phone}</p>
        <p className="text-sm text-gray-500">Email: {driver.email}</p>
      </div>

      <div className="flex items-center space-x-2">
        <span
          className={`badge ${driver.availability ? "badge-success" : "badge-error"} text-sm`}
        >
          {driver.availability ? "Available" : "In Use"}
        </span>
      </div>

      {role === "dispatcher" && <div className="flex flex-wrap justify-evenly gap-1 mt-4">
        <button
          className="btn btn-primary btn-sm w-full"
          onClick={async () => {
            const dialog = document.getElementById(`editDriver${driver._id}`);
            if (dialog && dialog instanceof HTMLDialogElement) {
              dialog.showModal();
            }
          }}
        >
          Edit
        </button>
        {driver.availability && <button className="btn btn-success btn-sm w-full" onClick={async () => {
            const dialog = document.getElementById(`assignToOrder${driver._id}`);
            if (dialog && dialog instanceof HTMLDialogElement) {
                dialog.showModal();
                try {
                  const {data} = await axios.get(`http://${import.meta.env.VITE_API_ADDRESS}/orders?role=dispatcher&createdAndWtihNoVehicleAssigned=true`);
                  setOrders(data.data);
              } catch (error: any) {
                  console.error("Error fetching orders:", error);
              }
            }
        }}>
          Assign to Order
        </button>}
        <button className="btn btn-error btn-sm w-full" onClick={()=> onAction && onAction("delete",driver._id)}>
          Delete
        </button>
      </div>}


      <Dialog
        id={`assignToOrder${driver._id}`}
        title="Assign to order"
        closeText="Cancel">
          <OrderList orders={orders} onAction={handleAction} role=""/>
      </Dialog>

      <Dialog
        id={`editDriver${driver._id}`}
        title="Edit Driver"
        closeText="Cancel"
        acceptText="Save"
        onAccept={handleSave}
      >
        <TextInput
          label="Name"
          name="name"
          placeholder="Enter driver name"
          value={editedDriver.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          required
        />
        <TextInput
          label="Email"
          name="email"
          placeholder="Enter driver email"
          value={editedDriver.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          required
        />
        <TextInput
          label="Phone"
          name="phone"
          placeholder="Enter driver phone"
          value={editedDriver.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          required
        />
        <TextInput
          label="License Number"
          name="license_number"
          placeholder="Enter driver license number"
          value={editedDriver.license_number}
          onChange={(e) => handleInputChange("license_number", e.target.value)}
          required
        />

        {dialogError && <p className="text-red-500 mt-2">{dialogError}</p>}
      </Dialog>
    </div>
  );
};

export default DriverCard;
