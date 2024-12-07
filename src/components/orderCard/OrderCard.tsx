import { User } from "../../ctx/UserContext.tsx";
import { Order } from "../../types/order.ts";
import { Truck, X, UserSearch, Check, Trash2 } from "lucide-react";
import Dialog from "../dialog/Dialog.tsx";
import DriverList from "../driverList/DriverList.tsx";
import axios from "axios";
import { useState } from "react";

type orderCardActions = "cancel" | "accept" | "complete" | "delete" | "assign";

interface OrderCardProps extends Order {
    role: Pick<User, "role">["role"];
    onAction: (action: orderCardActions, value?: any) => void;
}

function OrderCard(props: OrderCardProps) {
    const [drivers, setDrivers] = useState<any[]>([])


    const handleAssignDriver = async (driverId:string) => {
        props.onAction("assign", {driverId: driverId, orderId: props._id})
        const dialog = document.getElementById("assignDriver");
        if (dialog && dialog instanceof HTMLDialogElement) {
            dialog.close();
            const {data} = await axios.get(`http://${import.meta.env.VITE_API_ADDRESS}/users?available=true`)
            setDrivers(data)
        }
    }

    const handleCancel = () => {
        console.log(`Order ${props.order_number} cancelled.`);
        props.onAction("cancel", props._id);
        
    };

    const handleAccept = () => {
        console.log(`Order ${props.order_number} accepted.`);
        props.onAction("accept", props._id);
    };

    const handleAssignDriverModal = async () => {
        console.log(`Assigning driver for Order ${props.order_number}.`);
        const dialog = document.getElementById("assignDriver");
        if (dialog && dialog instanceof HTMLDialogElement) {
            dialog.showModal();
            const {data} = await axios.get(`http://${import.meta.env.VITE_API_ADDRESS}/users?available=true`)
            setDrivers(data)
        }
    };

    const handleMarkComplete = () => {
        console.log(`Marking Order ${props.order_number} as complete.`);
        props.onAction("complete",props._id);
    };

    const handleDelete = () => {
        console.log(`Deleting Order ${props.order_number}.`);
        props.onAction("delete",props._id)
    };

    return (
        <>
            <div className="indicator">
                {props.status === "in_progress" && (
                    <span className="indicator-item badge badge-primary right-2 top-2 p-1 h-fit">
                        <Truck />
                    </span>
                )}
                {props.status === "cancelled" && (
                    <span className="indicator-item badge badge-error right-2 top-2 p-1 h-fit">
                        <X />
                    </span>
                )}
                {props.status === "created" && (
                    <span className="indicator-item badge badge-info right-2 top-2 p-1 h-fit">
                        <UserSearch />
                    </span>
                )}
                {props.status === "completed" && (
                    <span className="indicator-item badge badge-success right-2 top-2 p-1 h-fit">
                        <Check />
                    </span>
                )}

                <div className="bg-base-300 flex flex-col gap-3 p-4 rounded shadow-md w-60">
                    <div className="text-lg font-semibold text-primary">
                        Order #{props.order_number}
                    </div>

                    <div className="text-sm">
                        <p className="font-semibold">Load Details:</p>
                        <p>Type: {props.load_details.type}</p>
                        <p>
                            Dimensions: {props.load_details.dimensions.length} x{" "}
                            {props.load_details.dimensions.width} x{" "}
                            {props.load_details.dimensions.height} cm
                        </p>
                        <p>Weight: {props.load_details.weight} kg</p>
                    </div>

                    <div className="text-sm">
                        <p className="font-semibold">Pickup Address:</p>
                        <p>
                            {props.pickup_address.street}, {props.pickup_address.city}
                        </p>
                        <p>
                            {props.pickup_address.zip_code}, {props.pickup_address.country}
                        </p>
                    </div>

                    <div className="text-sm">
                        <p className="font-semibold">Delivery Address:</p>
                        <p>
                            {props.delivery_address.street}, {props.delivery_address.city}
                        </p>
                        <p>
                            {props.delivery_address.zip_code}, {props.delivery_address.country}
                        </p>
                    </div>

                    <div className="text-sm text-secondary">
                        <p>Driver: {props.driver_info || "Not Assigned"}</p>
                        <p>Vehicle: {props.vehicle_info || "Not Assigned"}</p>
                        <p>
                            Estimated Delivery:{" "}
                            {props.estimated_delivery_time
                                ? new Date(props.estimated_delivery_time).toLocaleString()
                                : "N/A"}
                        </p>
                    </div>

                    <div className="text-xs text-gray-500">
                        <p>Created: {new Date(props.created_at).toLocaleString()}</p>
                        <p>Updated: {new Date(props.updated_at).toLocaleString()}</p>
                    </div>

                    <div className="flex flex-row flex-wrap gap-2 mt-4 bottom-0 ">
                        {props.role === "driver" && (
                            <>
                                {props.status === "in_progress" && (
                                    <button
                                        className="btn btn-error btn-sm w-full"
                                        onClick={handleCancel}
                                    >
                                        Cancel Order
                                    </button>
                                )}
                                {props.status === "created" && (
                                    <button
                                        className="btn btn-success btn-sm w-full"
                                        onClick={handleAccept}
                                    >
                                        Accept Order
                                    </button>
                                )}
                            </>
                        )}

                        {props.role === "dispatcher" && (
                            <>
                                {props.status === "created" && (
                                    <button
                                        className="btn btn-primary btn-sm w-full" 
                                        onClick={handleAssignDriverModal}
                                    >
                                        Assign Driver
                                    </button>
                                )}
                                {props.status === "in_progress" && (
                                    <>
                                        <button
                                            className="btn btn-success btn-sm w-full"
                                            onClick={handleMarkComplete}
                                        >
                                            Mark as Complete
                                        </button>
                                        {props.vehicle_info === "Not Assigned" && (
                                            <button
                                                className="btn btn-warning btn-sm w-full"
                                                onClick={() =>
                                                    props.onAction("assign", props._id)
                                                }
                                            >
                                                Assign Vehicle
                                            </button>
                                        )}
                                    </>
                                )}
                                <button
                                    className="btn btn-error btn-sm w-full"
                                    onClick={handleDelete}
                                >
                                    <Trash2 className="mr-1" />
                                    Delete Order
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Dialog title="Assign driver" id="assignDriver">
                <DriverList drivers={drivers} onSelect={handleAssignDriver}/>
            </Dialog>
        </>
    );
}

export default OrderCard;
