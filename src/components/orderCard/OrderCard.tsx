import axios from "axios";
import {
  Package2,
  MapPin,
  Truck,
  Calendar,
  User as UserIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import ActionButtons from "./ActionButtons";
import { User } from "../../ctx/UserContext";
import Dialog from "../dialog/Dialog";
import EditOrderDialog from "../dialog/EditOrderDialog";
import VehiclesList from "../vehiclesList/VehiclesList";
import DriversList from "../driversList/DriversList";
import { Address, Order } from "../../types/order";
import { Link } from "react-router-dom";

interface OrderProps extends Order {
  onAction: (action: orderCardActions, value?: any) => void;
  role: Pick<User, "role">["role"];
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAddress(address: Address) {
  return `${address.street}, ${address.city}, ${address.zip_code}, ${address.country}`;
}
export type orderCardActions =
  | "click"
  | "cancel"
  | "accept"
  | "complete"
  | "delete"
  | "assignDriver"
  | "assignVehicle"
  | "editOrder"
  | "changeDriver"
  | "changeVehicle";

export const statusClass = {
  in_progress: "badge-primary",
  cancelled: "badge-error",
  created: "badge-info",
  completed: "badge-success",
};

export default function OrderCard(order: OrderProps) {
  const {
    _id,
    order_number,
    load_details,
    pickup_address,
    delivery_address,
    status,
    estimated_delivery_time,
    vehicle_info,
    driver_info,
    assigned_driver,
    vehicle_id,
    onAction,
  } = order;
  const [drivers, setDrivers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const driverDialogRef = useRef<HTMLDialogElement>(null);
  const vehicleDialogRef = useRef<HTMLDialogElement>(null);
  const editDialogRef = useRef<HTMLDialogElement>(null);

  const handleShowModalWithData = async (
    dialogRef: React.RefObject<HTMLDialogElement>,
    fetchUrl: string,
    setData: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    setLoading(true);
    try {
      if (dialogRef.current) dialogRef.current.showModal();
      const { data } = await axios.get(fetchUrl);
      setData(data.drivers ?? data.vehicles);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="card w-96 bg-base-200 shadow-xl hover:shadow-2xl transition-shadow duration-300"
      onClick={() => onAction("click", order._id)}
    >
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <Link to={`/order/${_id}`}>
            <h2 className="card-title text-xl text-blue-700 underline-offset-8 underline font-bold">
              {order_number}
            </h2>
          </Link>
          <div className={`badge ${statusClass[status]} capitalize`}>
            {status.replace("_", " ")}
          </div>
        </div>

        <div className="p-4 bg-base-300 rounded-lg">
          <div className="flex items-start gap-4 mb-4">
            <Package2 className="w-5 h-5 text-gray-600 mt-1" />
            <div>
              <h3 className="font-semibold">Load Details</h3>
              <p>Type: {load_details.type}</p>
              <p>Weight: {load_details.weight} kg</p>
              <p>
                Dimensions: {load_details.dimensions.length}m ×{" "}
                {load_details.dimensions.width}m ×{" "}
                {load_details.dimensions.height}m
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mt-4">
          <div className="flex items-start gap-4">
            <MapPin className="w-5 h-5 text-success mt-1" />
            <div>
              <h3 className="font-semibold">Pickup Address</h3>
              <p>{formatAddress(pickup_address)}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <MapPin className="w-5 h-5 text-error mt-1" />
            <div>
              <h3 className="font-semibold">Delivery Address</h3>
              <p>{formatAddress(delivery_address)}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-base-300 grid grid-cols-2 gap-4">
          <Link
            to={assigned_driver ? `/users/${assigned_driver}` : ""}
            className="flex items-center gap-2"
          >
            <UserIcon className="w-5 h-5 text-gray-600" />
            <span>{driver_info ?? "No driver Assigned"}</span>
          </Link>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-gray-600" />
            <span>{vehicle_info ?? "No vehicle Assigned"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-600" />
            <span>
              Est. Delivery: {formatDate(estimated_delivery_time ?? "")}
            </span>
          </div>
        </div>
        <ActionButtons
          role={order.role}
          driverInfo={driver_info}
          onAction={onAction}
          id={_id}
          status={status}
          vehicleInfo={vehicle_info}
          handleAssignDriverModal={() =>
            handleShowModalWithData(
              driverDialogRef,
              `http://${import.meta.env.VITE_API_ADDRESS}/users?available=true`,
              setDrivers
            )
          }
          handleAssignVehicleModal={() =>
            handleShowModalWithData(
              vehicleDialogRef,
              `http://${
                import.meta.env.VITE_API_ADDRESS
              }/vehicles?available=true`,
              setVehicles
            )
          }
          handleEditModal={() =>
            handleShowModalWithData(editDialogRef, "", () => {})
          }
          handleChangeDriverModal={() =>
            handleShowModalWithData(
              driverDialogRef,
              `http://${import.meta.env.VITE_API_ADDRESS}/users?available=true`,
              setDrivers
            )
          }
          handleChangeVehicleModal={() =>
            handleShowModalWithData(
              vehicleDialogRef,
              `http://${
                import.meta.env.VITE_API_ADDRESS
              }/vehicles?available=true${
                vehicle_id ? `&vehicleId=${vehicle_id}` : ""
              }`,
              setVehicles
            )
          }
        />
        <Dialog
          id={`assignDriverDialog${_id}`}
          title="Assign Driver"
          ref={driverDialogRef}
        >
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <DriversList
              drivers={drivers}
              onSelect={(driverId: string) =>
                onAction("assignDriver", {
                  driverId,
                  orderId: _id,
                })
              }
              role=""
            />
          )}
        </Dialog>

        <Dialog
          id={`assignVehicleDialog${_id}`}
          title="Assign Vehicle"
          ref={vehicleDialogRef}
        >
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <VehiclesList
              vehicles={vehicles}
              onSelect={(vehicleId) =>
                onAction("assignVehicle", {
                  vehicleId,
                  orderId: _id,
                })
              }
            />
          )}
        </Dialog>

        <EditOrderDialog
          order={order}
          onAction={onAction}
          closeDialog={() => editDialogRef.current?.close()}
          ref={editDialogRef}
        />
      </div>
    </div>
  );
}
