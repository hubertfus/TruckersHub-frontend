import { Edit, Trash2 } from "lucide-react";
import { Order } from "../../types/order";
import { orderCardActions } from "./OrderCard";

interface ActionButtonsProps {
    role: string;
    order: Order;
    onAction: (action: orderCardActions, value?: any) => void;
    handleAssignDriverModal: () => void;
    handleAssignVehicleModal: () => void;
    handleEditModal: () => void;
}

function ActionButtons({
    role,
    order,
    onAction,
    handleAssignDriverModal,
    handleAssignVehicleModal,
    handleEditModal,
    }: ActionButtonsProps) {
    return (
        <div className="flex flex-row flex-wrap gap-2 mt-4 bottom-0 ">
        {role === "driver" && (
            <>
            {order.status === "in_progress" && (
                <button className="btn btn-error btn-sm w-full" onClick={() => onAction("cancel", order._id)}>
                Cancel Order
                </button>
            )}
            {order.status === "created" && (
                <button className="btn btn-success btn-sm w-full" onClick={() => onAction("accept", order._id)}>
                Accept Order
                </button>
            )}
            </>
        )}
        {role === "dispatcher" && (
            <>
            {order.status === "created" && (
                <button className="btn btn-primary btn-sm w-full" onClick={handleAssignDriverModal}>
                Assign Driver
                </button>
            )}
            {order.status === "in_progress" && (
                <>
                <button className="btn btn-success btn-sm w-full" onClick={() => onAction("complete", order._id)}>
                    Mark as Complete
                </button>
                {!order.vehicle_id && (
                    <button className="btn btn-warning btn-sm w-full" onClick={handleAssignVehicleModal}>
                    Assign Vehicle
                    </button>
                )}
                </>
            )}
            <button className="btn btn-error btn-sm w-full" onClick={() => onAction("delete", order._id)}>
                <Trash2 className="mr-1" />
                Delete Order
            </button>
            <button className="btn btn-warning btn-sm w-full" onClick={handleEditModal}>
                <Edit className="mr-1" />
                Edit Order
            </button>
            </>
        )}
        </div>
    );
}

export default ActionButtons