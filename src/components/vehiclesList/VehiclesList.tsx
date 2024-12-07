import { Truck, Edit, CheckCircle, Trash2 } from "lucide-react";

function VehiclesList({
  vehicles,
  onSelect,
  role = "driver",
}: {
  vehicles: any[];
  onSelect?: (vehicleId: string) => void;
  role?: string;
}) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6 text-center">Vehicle List</h1>
      <ul className="divide-y divide-gray-200 border rounded-lg overflow-hidden">
        {vehicles.map((vehicle) => (
          <li
            key={vehicle._id}
            className="flex flex-col p-4 hover:bg-gray-100 cursor-pointer"
            onClick={() => onSelect && onSelect(vehicle._id)}
          >
            <div className="flex flex-1 flex-row justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-blue-500 text-white">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-medium">
                    {vehicle.brand} {vehicle.model}
                  </p>
                  <p className="text-sm text-gray-500">
                    License Plate: {vehicle.license_plate}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`badge ${
                    vehicle.isInUse ? "badge-error" : "badge-success"
                  } text-sm`}
                >
                  {vehicle.isInUse ? "In Use" : "Available"}
                </span>
              </div>
            </div>

            {role === "dispatcher" && (
              <div className="flex flex-1 flex-row justify-evenly flex-wrap space-x-2">
                <button className="btn btn-primary btn-sm w-f">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button className="btn btn-success btn-sm">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Assign to Order
                </button>
                <button className="btn btn-error btn-sm">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VehiclesList;
