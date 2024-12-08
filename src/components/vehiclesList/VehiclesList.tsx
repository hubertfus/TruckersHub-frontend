import { Vehicle } from "../../types/vehicle";
import VehicleItem from "../vehicleItem/VehicleItem";

interface VehiclesListProps {
  vehicles: Vehicle[];
  onSelect?: (vehicleId: string) => void;
  role?: string;
  onAction?: (action: string, value?: any) => void;
}

const VehiclesList = ({ vehicles, onSelect, role = "driver", onAction }: VehiclesListProps) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6 text-center">Vehicle List</h1>
      <ul className="divide-y divide-gray-200 border rounded-lg overflow-hidden">
        {vehicles.map((vehicle) => (
          <VehicleItem
            key={vehicle._id}
            vehicle={vehicle}
            onSelect={onSelect}
            role={role}
            onAction={onAction}
          />
        ))}
      </ul>
    </div>
  );
};

export default VehiclesList;
