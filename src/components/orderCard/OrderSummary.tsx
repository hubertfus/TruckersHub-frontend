interface OrderSummaryProps {
    driverInfo: string | null;
    vehicleInfo: string | null;
    estimatedDeliveryTime: string | null;
}

function OrderSummary({ driverInfo, vehicleInfo, estimatedDeliveryTime }: OrderSummaryProps) {
    return (
        <div className="text-sm text-secondary">
            <p>Driver: {driverInfo || "Not Assigned"}</p>
            <p>Vehicle: {vehicleInfo || "Not Assigned"}</p>
            <p>
                Estimated Delivery:{" "}
                {estimatedDeliveryTime
                ? new Date(estimatedDeliveryTime).toLocaleString()
                : "N/A"}
            </p>
        </div>
    );
}

export default OrderSummary