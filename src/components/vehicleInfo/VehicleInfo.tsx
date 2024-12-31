import { Truck, MapPin } from "lucide-react";
import { Vehicle } from "../../pages/userDetails/UserDetails";

export function VehicleInfo(vehicle: Vehicle) {
  return (
    <div className="bg-base-100 rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-primary p-3 rounded-full">
          <Truck className="w-8 h-8 text-primary-content" />
        </div>
        <h3 className="text-xl font-bold text-base-content">Current Vehicle</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p>
            <span className="font-semibold">Vehicle:</span> {vehicle.brand}{" "}
            {vehicle.model}
          </p>
          <p>
            <span className="font-semibold">License Plate:</span>{" "}
            {vehicle.license_plate}
          </p>
          <p>
            <span className="font-semibold">Year:</span> {vehicle.year}
          </p>
        </div>
        <div>
          <p>
            <span className="font-semibold">Capacity:</span>{" "}
            {vehicle.capacity.weight}kg
          </p>
          <p>
            <span className="font-semibold">Dimensions:</span>{" "}
            {vehicle.capacity.volume.length}m × {vehicle.capacity.volume.width}m
            × {vehicle.capacity.volume.height}m
          </p>
          <div className="flex items-center space-x-2 ">
            <MapPin className="w-4 h-4 text-info" />
            <span>
              {vehicle.current_location.latitude.toFixed(2)}°N,{" "}
              {vehicle.current_location.longitude.toFixed(2)}°E
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
