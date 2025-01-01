import { useEffect, useState } from "react";
import { Check, Truck, AlertCircle } from "lucide-react";
import axios from "axios";
import Tabs from "../tabs/Tabs";
import VehiclesList from "../vehiclesList/VehiclesList";
import Dialog from "../dialog/Dialog";
import TextInput from "../textInput/TextInput";
import { Vehicle } from "../../types/vehicle";
import { useUser } from "../../ctx/UserContext";
import ToastGroup from "../toastGroup/ToastGroup";
import Toast from "../toast/Toast";

function VehiclesSection() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [data, setData] = useState<Vehicle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newVehicle, setNewVehicle] = useState<Vehicle>({
    _id: "",
    license_plate: "",
    model: "",
    brand: "",
    year: "",
    isInUse: false,
    capacity: { weight: "", volume: { length: "", width: "", height: "" } },
    current_location: { latitude: "", longitude: "" },
    maintenance_schedule: [],
  });
  const { user } = useUser();

  const [dialogError, setDialogError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<{ type: string; message: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `http://${import.meta.env.VITE_API_ADDRESS}/vehicles`
        );
        setData(data.vehicles);
        setToasts((prev) => [
          ...prev,
          { type: "success", message: data.message },
        ]);
      } catch (err: any) {
        console.error("Error fetching vehicles:", err);
        setError(err.message || "Unknown error occurred");
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setNewVehicle((prev) => ({
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
    const fieldValue = newVehicle[field];

    if (typeof fieldValue === "object" && fieldValue !== null) {
      setNewVehicle((prev) => ({
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

  const handleSave = async () => {
    try {
      if (!newVehicle.license_plate || !newVehicle.model || !newVehicle.brand) {
        setDialogError("Please fill in all required fields.");
        return;
      }
      const { data } = await axios.post(
        `http://${import.meta.env.VITE_API_ADDRESS}/vehicles/add-vehicle`,
        newVehicle
      );
      setToasts((prev) => [
        ...prev,
        { type: "success", message: data.message },
      ]);

      const response = await axios.get(
        `http://${import.meta.env.VITE_API_ADDRESS}/vehicles`
      );
      setData(response.data);
      const dialog = document.getElementById("addVehicle");
      if (dialog && dialog instanceof HTMLDialogElement) {
        dialog.close();
      }
    } catch (err: any) {
      console.error("Error saving vehicle:", err);
      setDialogError(err.message || "Unknown error occurred.");
    }
  };

  const filteredVehicles = (status: string) => {
    if (status === "all") return data;
    if (status === "available")
      return data.filter((vehicle: any) => !vehicle.isInUse);
    if (status === "in_use")
      return data.filter((vehicle: any) => vehicle.isInUse);
    return [];
  };

  const tabs = [
    { key: "all", label: "All", icon: Truck },
    { key: "available", label: "Available", icon: Check },
    { key: "in_use", label: "In Use", icon: AlertCircle },
  ];

  const handleAction = async (action: string, value?: any) => {
    if (action === "delete") {
      try {
        const { data } = await axios.delete(
          `http://${import.meta.env.VITE_API_ADDRESS}/vehicles/delete/${value}`
        );
        setToasts((prev) => [
          ...prev,
          { type: "success", message: data.message },
        ]);

        setData((prev: Vehicle[]) =>
          prev.filter((vehicle) => vehicle._id !== value)
        );
      } catch (error) {
        console.error("Error while deleting vehicle:", error);
      }
      return;
    }
    if (action === "edit") {
      try {
        const { data } = await axios.put(
          `http://${import.meta.env.VITE_API_ADDRESS}/vehicles/edit/${
            value.vehicleId
          }`,
          {
            ...value.editedVehicle,
          }
        );
        setToasts((prev) => [
          ...prev,
          { type: "success", message: data.message },
        ]);

        setData((prev) =>
          prev.map((vehicle) =>
            vehicle._id === value.vehicleId
              ? { ...value.editedVehicle }
              : vehicle
          )
        );
      } catch (error) {
        console.error("Error while deleting vehicle:", error);
      }
      return;
    }
    if (action === "assignToOrder") {
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
        setToasts((prev) => [
          ...prev,
          { type: "success", message: data.message },
        ]);

        const dialog = document.getElementById(
          `assignToOrderV${value.vehicleId}`
        );
        if (dialog && dialog instanceof HTMLDialogElement) {
          dialog.close();
        }
        setData((prev) =>
          prev.map((vehicle: Vehicle) =>
            vehicle._id === value.vehicleId
              ? { ...vehicle, isInUse: true }
              : vehicle
          )
        );
      } catch (error) {
        console.error(error);
      }
      return;
    }
  };

  const closeToastHandle = (index: number) => {
    setToasts((prev) => prev.filter((_, indx) => indx !== index));
  };

  if (error) {
    return <p className="text-red-500">Error fetching vehicles: {error}</p>;
  }

  return (
    <div>
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
      <VehiclesList
        vehicles={filteredVehicles(activeTab)}
        role="dispatcher"
        onAction={handleAction}
      />
      <div className="fixed bottom-4 right-4">
        <button
          className="btn btn-neutral btn-xs sm:btn-sm md:btn-md lg:btn-lg"
          onClick={() => {
            const dialog = document.getElementById("addVehicle");
            if (dialog && dialog instanceof HTMLDialogElement) {
              dialog.showModal();
            }
          }}
        >
          Add vehicle
        </button>
      </div>
      <Dialog
        id="addVehicle"
        title="Add Vehicle"
        acceptText="Save"
        closeText="Cancel"
        onAccept={handleSave}
      >
        <TextInput
          label="License Plate"
          name="license_plate"
          placeholder="Enter license plate"
          value={newVehicle.license_plate}
          onChange={(e) => handleInputChange("license_plate", e.target.value)}
          required
        />
        <TextInput
          label="Model"
          name="model"
          placeholder="Enter vehicle model"
          value={newVehicle.model}
          onChange={(e) => handleInputChange("model", e.target.value)}
          required
        />
        <TextInput
          label="Brand"
          name="brand"
          placeholder="Enter vehicle brand"
          value={newVehicle.brand}
          onChange={(e) => handleInputChange("brand", e.target.value)}
          required
        />
        <TextInput
          label="Year"
          name="year"
          placeholder="Enter manufacturing year"
          type="number"
          value={newVehicle.year}
          onChange={(e) => handleInputChange("year", e.target.value)}
          min={1900}
        />
        <h2 className="font-bold text-center pt-8">Capacity:</h2>
        <TextInput
          label="Weight Capacity"
          name="weight"
          placeholder="Enter weight capacity"
          type="number"
          value={newVehicle.capacity.weight}
          onChange={(e) =>
            handleNestedChange("capacity", "weight", e.target.value)
          }
          min={0}
        />
        <TextInput
          label="Length (Volume)"
          name="length"
          placeholder="Enter length"
          type="number"
          value={newVehicle.capacity.volume.length}
          onChange={(e) =>
            handleNestedChange("capacity", "volume", {
              ...newVehicle.capacity.volume,
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
          value={newVehicle.capacity.volume.width}
          onChange={(e) =>
            handleNestedChange("capacity", "volume", {
              ...newVehicle.capacity.volume,
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
          value={newVehicle.capacity.volume.height}
          onChange={(e) =>
            handleNestedChange("capacity", "volume", {
              ...newVehicle.capacity.volume,
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
          value={newVehicle.current_location.latitude}
          onChange={(e) =>
            handleNestedChange("current_location", "latitude", e.target.value)
          }
        />
        <TextInput
          label="Longitude"
          name="longitude"
          placeholder="Enter longitude"
          type="number"
          value={newVehicle.current_location.longitude}
          onChange={(e) =>
            handleNestedChange("current_location", "longitude", e.target.value)
          }
        />
        {dialogError && <p className="text-red-500 mt-2">{dialogError}</p>}
      </Dialog>
    </div>
  );
}

export default VehiclesSection;
