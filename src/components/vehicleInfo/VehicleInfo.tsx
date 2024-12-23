import { Truck, MapPin } from 'lucide-react';
import { Vehicle } from '../../pages/userDetails/UserDetails';


export function VehicleInfo(vehicle: Vehicle) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-purple-100 p-3 rounded-full">
          <Truck className="w-8 h-8 text-purple-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">Current Vehicle</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600">
            <span className="font-semibold">Vehicle:</span> {vehicle.brand} {vehicle.model}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">License Plate:</span> {vehicle.license_plate}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Year:</span> {vehicle.year}
          </p>
        </div>
        <div>
          <p className="text-gray-600">
            <span className="font-semibold">Capacity:</span> {vehicle.capacity.weight}kg
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Dimensions:</span> {vehicle.capacity.volume.length}m × {vehicle.capacity.volume.width}m × {vehicle.capacity.volume.height}m
          </p>
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>
              {vehicle.current_location.latitude.toFixed(2)}°N, {vehicle.current_location.longitude.toFixed(2)}°E
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}