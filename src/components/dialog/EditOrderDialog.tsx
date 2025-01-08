import { useState, forwardRef } from "react";
import Dialog from "../dialog/Dialog.tsx";
import { Order } from "../../types/order.ts";
import TextInput from "../textInput/TextInput.tsx";
import DatePicker from "../datePicker/DatePicker.tsx";

interface EditOrderDialogProps {
  order: Order;
  onAction: (action: "editOrder", value?: any) => void;
  closeDialog: () => void;
}

const EditOrderDialog = forwardRef<HTMLDialogElement, EditOrderDialogProps>(
  ({ order, onAction, closeDialog }, ref) => {
    const [orderData, setOrderData] = useState({
      orderNumber: order.order_number,
      orderDtType: order.load_details.type,
      orderDtWeight: order.load_details.weight.toString(),
      orderDtLength: order.load_details.dimensions.length.toString(),
      orderDtWidth: order.load_details.dimensions.width.toString(),
      orderDtHeight: order.load_details.dimensions.height.toString(),
      pickupStreet: order.pickup_address.street,
      pickupCity: order.pickup_address.city,
      pickupZip: order.pickup_address.zip_code,
      pickupCountry: order.pickup_address.country,
      deliveryStreet: order.delivery_address.street,
      deliveryCity: order.delivery_address.city,
      deliveryZip: order.delivery_address.zip_code,
      deliveryCountry: order.delivery_address.country,
      estimatedDeliveryTime: order.estimated_delivery_time
        ? typeof order.estimated_delivery_time === "string"
          ? order.estimated_delivery_time.split("T")[0]
          : new Date(order.estimated_delivery_time).toISOString().split("T")[0]
        : "",
      status: order.status,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    });

    const handleInputChange = (field: string, value: string) => {
      setOrderData((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    };

    const handleSave = async () => {
      try {
        const updatedOrderData = {
          order_number: orderData.orderNumber,
          load_details: {
            type: orderData.orderDtType,
            weight: parseFloat(orderData.orderDtWeight),
            dimensions: {
              length: parseFloat(orderData.orderDtLength),
              width: parseFloat(orderData.orderDtWidth),
              height: parseFloat(orderData.orderDtHeight),
            },
          },
          pickup_address: {
            street: orderData.pickupStreet,
            city: orderData.pickupCity,
            zip_code: orderData.pickupZip,
            country: orderData.pickupCountry,
          },
          delivery_address: {
            street: orderData.deliveryStreet,
            city: orderData.deliveryCity,
            zip_code: orderData.deliveryZip,
            country: orderData.deliveryCountry,
          },
          status: orderData.status,
          assigned_driver: null,
          vehicle_id: null,
          estimated_delivery_time: orderData.estimatedDeliveryTime
            ? new Date(orderData.estimatedDeliveryTime)
            : null,
          created_at: orderData.createdAt
            ? new Date(orderData.createdAt)
            : new Date(),
          updated_at: new Date(),
        };

        onAction("editOrder", {
          orderId: order._id,
          updatedData: updatedOrderData,
        });
        closeDialog();
      } catch (error) {
        console.error("Error saving the order:", error);
      }
    };

    return (
      <Dialog
        ref={ref}
        id="editOrderDialog"
        title="Edit Order"
        closeText="Cancel"
        acceptText="Save"
        onAccept={handleSave}
        onClose={closeDialog}
      >
        <TextInput
          label="Order number:"
          name="orderNumber"
          value={orderData.orderNumber}
          onChange={(e) => handleInputChange("orderNumber", e.target.value)}
          required
        />

        <h2 className="font-bold text-center pt-8">Load Details</h2>
        <TextInput
          label="Type"
          name="orderDtType"
          value={orderData.orderDtType}
          onChange={(e) => handleInputChange("orderDtType", e.target.value)}
          required
        />
        <TextInput
          label="Weight"
          name="orderDtWeight"
          value={orderData.orderDtWeight}
          onChange={(e) => handleInputChange("orderDtWeight", e.target.value)}
          min={0}
          required
        />

        <h3 className="font-bold text-center pt-8">Dimensions</h3>
        <div className="flex space-x-4">
          <TextInput
            label="Length"
            name="orderDtLength"
            value={orderData.orderDtLength}
            onChange={(e) => handleInputChange("orderDtLength", e.target.value)}
            min={0}
            required
          />
          <TextInput
            label="Width"
            name="orderDtWidth"
            value={orderData.orderDtWidth}
            onChange={(e) => handleInputChange("orderDtWidth", e.target.value)}
            min={0}
            required
          />
          <TextInput
            label="Height"
            name="orderDtHeight"
            value={orderData.orderDtHeight}
            onChange={(e) => handleInputChange("orderDtHeight", e.target.value)}
            min={0}
            required
          />
        </div>

        <h2 className="font-bold text-center pt-8">Addresses</h2>
        <TextInput
          label="Pickup Street"
          name="pickupStreet"
          value={orderData.pickupStreet}
          onChange={(e) => handleInputChange("pickupStreet", e.target.value)}
          required
        />
        <TextInput
          label="Pickup City"
          name="pickupCity"
          value={orderData.pickupCity}
          onChange={(e) => handleInputChange("pickupCity", e.target.value)}
          required
        />
        <TextInput
          label="Pickup ZIP Code"
          name="pickupZip"
          value={orderData.pickupZip}
          onChange={(e) => handleInputChange("pickupZip", e.target.value)}
          required
        />
        <TextInput
          label="Pickup Country"
          name="pickupCountry"
          value={orderData.pickupCountry}
          onChange={(e) => handleInputChange("pickupCountry", e.target.value)}
          required
        />

        <TextInput
          label="Delivery Street"
          name="deliveryStreet"
          value={orderData.deliveryStreet}
          onChange={(e) => handleInputChange("deliveryStreet", e.target.value)}
          required
        />
        <TextInput
          label="Delivery City"
          name="deliveryCity"
          value={orderData.deliveryCity}
          onChange={(e) => handleInputChange("deliveryCity", e.target.value)}
          required
        />
        <TextInput
          label="Delivery ZIP Code"
          name="deliveryZip"
          value={orderData.deliveryZip}
          onChange={(e) => handleInputChange("deliveryZip", e.target.value)}
          required
        />
        <TextInput
          label="Delivery Country"
          name="deliveryCountry"
          value={orderData.deliveryCountry}
          onChange={(e) => handleInputChange("deliveryCountry", e.target.value)}
          required
        />

        <DatePicker
          label="Estimated Delivery Time"
          name="estimatedDeliveryTime"
          value={orderData.estimatedDeliveryTime}
          onChange={(date) => handleInputChange("estimatedDeliveryTime", date)}
          required
        />
      </Dialog>
    );
  }
);

export default EditOrderDialog;
