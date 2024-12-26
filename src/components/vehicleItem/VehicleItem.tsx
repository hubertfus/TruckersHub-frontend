import { useState } from "react";
import { Vehicle } from "../../types/vehicle";
import { CheckCircle, Edit, Trash2, Truck } from "lucide-react";
import Dialog from "../dialog/Dialog";
import TextInput from "../textInput/TextInput";
import { Order } from "../../types/order";
import axios from "axios";
import OrderList from "../orderList/OrderList";


interface VehicleItemProps {
  vehicle: Vehicle;
  onSelect?: (vehicleId: string) => void;
  role?: string;
  onAction?: (action: string, value?: any) => void;
}

const VehicleItem = ({ vehicle, onSelect, role, onAction }: VehicleItemProps) => {
  const [editedVehicle, setEditedVehicle] = useState<Vehicle>(vehicle);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([])

  const handleInputChange = (field: keyof Vehicle, value: string) => {
    setEditedVehicle((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = <
        T extends keyof Vehicle,
        K extends keyof Vehicle[T]
    >(
        field: T,
        subField: K,
        value: any
    ) => {
        const fieldValue = editedVehicle[field];
        
        if (typeof fieldValue === "object" && fieldValue !== null) {
            setEditedVehicle((prev) => ({
                ...prev,
                [field]: {
                    ...fieldValue,
                    [subField]: value,
                },
            }));
        } else {
            console.error(`Field "${field}" is not an object.`);
        }
    };

  const handleSave = () => {
    if (!editedVehicle.license_plate || !editedVehicle.model || !editedVehicle.brand) {
      setDialogError("All fields are required.");
      return;
    }

    onAction && onAction("edit",{vehicleId: vehicle._id, editedVehicle});
    setDialogError(null);
  };

  const handleAction = async (action: string, value?: any) =>{
    if(action==="click"){
      onAction && onAction("assignToOrder",{orderId:value, vehicleId:vehicle._id})
    }
  }

  return (
    <li
      key={vehicle._id}
      className="flex flex-col p-4 bg-base-300 rounded-lg cursor-pointer"
      onClick={() => onSelect && onSelect(vehicle._id)}
    >
      <div className="flex flex-1 flex-row justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 rounded-full bg-blue-500 text-white">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="font-medium">
              {vehicle.brand} {vehicle.model}
            </p>
            <p className="text-sm text-gray-500">
              License Plate: {vehicle.license_plate}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span
            className={`badge ${
              vehicle.isInUse ? "badge-error" : "badge-success"
            } text-sm`}
          >
            {vehicle.isInUse ? "In Use" : "Available"}
          </span>
        </div>
      </div>

      {role === "dispatcher" && (
        <div className="flex flex-1 flex-row justify-evenly flex-wrap space-x-2">
          <button
            className="btn btn-primary btn-sm w-f"
            onClick={() => {
                const dialog = document.getElementById("editVehicle");
                if (dialog && dialog instanceof HTMLDialogElement) {
                    dialog.showModal();
                }
            }}
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </button>
          {!vehicle.isInUse && <button className="btn btn-success btn-sm"
          onClick={async () => {
            const dialog = document.getElementById("assignToOrder");
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
            <CheckCircle className="w-4 h-4 mr-1" />
            Assign to Order
          </button>}
          <button
            className="btn btn-error btn-sm"
            onClick={() => onAction && onAction("delete", vehicle._id)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </button>
        </div>
      )}


      <Dialog
        id="assignToOrder"
        title="Assign to order"
        closeText="Cancel">
          <OrderList orders={orders} onAction={handleAction} role=""/>
      </Dialog>

      <Dialog
        id="editVehicle"
        title="Edit Vehicle"
        acceptText="Save"
        closeText="Cancel"
        onAccept={handleSave}
      >
        <TextInput
          label="License Plate"
          name="license_plate"
          placeholder="Enter license plate"
          value={editedVehicle.license_plate}
          onChange={(e) => handleInputChange("license_plate", e.target.value)}
          required
        />
        <TextInput
          label="Model"
          name="model"
          placeholder="Enter vehicle model"
          value={editedVehicle.model}
          onChange={(e) => handleInputChange("model", e.target.value)}
          required
        />
        <TextInput
          label="Brand"
          name="brand"
          placeholder="Enter vehicle brand"
          value={editedVehicle.brand}
          onChange={(e) => handleInputChange("brand", e.target.value)}
          required
        />
        <TextInput
          label="Year"
          name="year"
          placeholder="Enter manufacturing year"
          type="number"
          value={editedVehicle.year}
          onChange={(e) => handleInputChange("year", e.target.value)}
          min={1900}
        />
        <h2 className="font-bold text-center pt-8">Capacity:</h2>
        <TextInput
          label="Weight Capacity"
          name="weight"
          placeholder="Enter weight capacity"
          type="number"
          value={editedVehicle.capacity?.weight || ""}
          onChange={(e) => handleNestedChange("capacity", "weight", e.target.value)}
          min={0}
        />
        <TextInput
          label="Length (Volume)"
          name="length"
          placeholder="Enter length"
          type="number"
          value={editedVehicle.capacity?.volume?.length || ""}
          onChange={(e) =>
            handleNestedChange("capacity", "volume", {
              ...editedVehicle.capacity.volume,
              length: e.target.value,
            })
          }
          min={0}
        />
        <TextInput
          label="Width (Volume)"
          name="width"
          placeholder="Enter width"
          type="number"
          value={editedVehicle.capacity?.volume?.width || ""}
          onChange={(e) =>
            handleNestedChange("capacity", "volume", {
              ...editedVehicle.capacity.volume,
              width: e.target.value,
            })
          }
          min={0}
        />
        <TextInput
          label="Height (Volume)"
          name="height"
          placeholder="Enter height"
          type="number"
          value={editedVehicle.capacity?.volume?.height || ""}
          onChange={(e) =>
            handleNestedChange("capacity", "volume", {
              ...editedVehicle.capacity.volume,
              height: e.target.value,
            })
          }
          min={0}
        />
        <h2 className="font-bold text-center pt-8">Location:</h2>
        <TextInput
          label="Latitude"
          name="latitude"
          placeholder="Enter latitude"
          type="number"
          value={editedVehicle.current_location?.latitude || ""}
          onChange={(e) => handleNestedChange("current_location", "latitude", e.target.value)}
        />
        <TextInput
          label="Longitude"
          name="longitude"
          placeholder="Enter longitude"
          type="number"
          value={editedVehicle.current_location?.longitude || ""}
          onChange={(e) => handleNestedChange("current_location", "longitude", e.target.value)}
        />
        {dialogError && <p className="text-red-500 mt-2">{dialogError}</p>}
      </Dialog>
    </li>
  );
};

export default VehicleItem;
