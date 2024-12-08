import { User } from "../../ctx/UserContext.tsx";
import { Order } from "../../types/order.ts";
import { Truck, X, UserSearch, Check } from "lucide-react";
import Dialog from "../dialog/Dialog.tsx";
import DriverList from "../driversList/DriversList.tsx";
import VehiclesList from "../vehiclesList/VehiclesList.tsx";
import { useRef, useState } from "react";
import axios from "axios";
import LoadDetails from "./LoadDetails.tsx";
import AddressDetails from "./AddressDetails.tsx";
import OrderSummary from "./OrderSummary.tsx";
import ActionButtons from "./ActionButtons.tsx";
import EditOrderDialog from "../dialog/EditOrderDialog.tsx";

export type orderCardActions = "cancel" | "accept" | "complete" | "delete" | "assignDriver" | "assignVehicle" | "editOrder" | "changeDriver" | "changeVehicle";

interface OrderCardProps {
  order: Order; 
  role: Pick<User, "role">["role"];
  onAction: (action: orderCardActions, value?: any) => void;
}

function OrderCard(props: OrderCardProps) {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const driverDialogRef = useRef<HTMLDialogElement>(null);
  const vehicleDialogRef = useRef<HTMLDialogElement>(null);
  const editDialogRef = useRef<HTMLDialogElement>(null);

  const statusIcons = {
    in_progress: <Truck />,
    cancelled: <X />,
    created: <UserSearch />,
    completed: <Check />,
  };

  const statusClass = {
    in_progress: "badge-primary",
    cancelled: "badge-error",
    created: "badge-info",
    completed: "badge-success",
  };

  const handleShowModalWithData = async (
    dialogRef: React.RefObject<HTMLDialogElement>,
    fetchUrl: string,
    setData: React.Dispatch<React.SetStateAction<any[]>>,
  ) => {
    setLoading(true); 
    try {
      if (dialogRef.current) dialogRef.current.showModal();
      const { data } = await axios.get(fetchUrl);
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="indicator">
        <span className={`indicator-item badge ${statusClass[props.order.status]} right-2 top-2 p-1 h-fit`}>
          {statusIcons[props.order.status]}
        </span>

        <div className="bg-base-300 flex flex-col gap-3 p-4 rounded shadow-md w-60">
          <div className="text-lg font-semibold text-primary">
            Order #{props.order.order_number}
          </div>
          <LoadDetails
            type={props.order.load_details.type}
            weight={props.order.load_details.weight}
            dimensions={props.order.load_details.dimensions}
          />
          <AddressDetails
            title="Pickup Address"
            address={props.order.pickup_address}
          />
          <AddressDetails
            title="Delivery Address"
            address={props.order.delivery_address}
          />
          <OrderSummary
            driverInfo={props.order.driver_info}
            vehicleInfo={props.order.vehicle_info}
            estimatedDeliveryTime={props.order.estimated_delivery_time}
          />
          <ActionButtons
            role={props.role}
            order={props.order}
            onAction={props.onAction}
            handleAssignDriverModal={() =>
            handleShowModalWithData(
                driverDialogRef,
                `http://${import.meta.env.VITE_API_ADDRESS}/users?available=true`,
                setDrivers,
              ) 
            }
            handleAssignVehicleModal={() =>
              handleShowModalWithData(
                vehicleDialogRef,
                `http://${import.meta.env.VITE_API_ADDRESS}/vehicles?available=true`,
                setVehicles,
              )
            }
            handleEditModal={() =>
              handleShowModalWithData(editDialogRef, "", () => {})
            }
            handleChangeDriverModal={()=> 
              handleShowModalWithData(
                driverDialogRef,
                `http://${import.meta.env.VITE_API_ADDRESS}/users?available=true${props.order.assigned_driver ? `&userId=${props.order.assigned_driver}` : ''}`,
                setDrivers,
              )
            }
            handleChangeVehicleModal={()=>
              handleShowModalWithData(
                vehicleDialogRef,
                `http://${import.meta.env.VITE_API_ADDRESS}/vehicles?available=true${props.order.vehicle_id ? `&vehicleId=${props.order.vehicle_id}` : ''}`,
                setVehicles,
              )
            }
          />
        </div>
      </div>

      <Dialog id="assignDriverDialog" title="Assign Driver" ref={driverDialogRef}>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <DriverList
            drivers={drivers}
            onSelect={(driverId) =>
              props.onAction("assignDriver", { driverId, orderId: props.order._id })
            }
          />
        )}
      </Dialog>

      <Dialog id="assignVehicleDialog" title="Assign Vehicle" ref={vehicleDialogRef}>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <VehiclesList
            vehicles={vehicles}
            onSelect={(vehicleId) =>
              props.onAction("assignVehicle", { vehicleId, orderId: props.order._id })
            }
          />
        )}
      </Dialog>

      <EditOrderDialog
        order={props.order}
        onAction={props.onAction}
        closeDialog={() => editDialogRef.current?.close()}
        ref={editDialogRef}
      />
    </>
  );
}

export default OrderCard;
