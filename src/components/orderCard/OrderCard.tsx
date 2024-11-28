import { Order } from "../../types/order.ts";
import { Truck, X, UserSearch, Check } from "lucide-react";

function OrderCard(props: Order) {
    const handleCancel = () => {
        console.log(`Order ${props.order_number} canceled.`);
    };

    const handleAccept = () => {
        console.log(`Order ${props.order_number} accepted.`);
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

                <div className="bg-base-300 flex flex-col gap-3 p-4 rounded shadow-md w-80">
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

                    <div className="flex gap-2 mt-4">
                        {props.status === "in_progress" && (
                            <button
                                className="btn btn-error btn-sm"
                                onClick={handleCancel}
                            >
                                Cancel Order
                            </button>
                        )}
                        {props.status === "created" && (
                            <button
                                className="btn btn-success btn-sm"
                                onClick={handleAccept}
                            >
                                Accept Order
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrderCard;
