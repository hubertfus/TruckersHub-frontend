import { User } from "../../ctx/UserContext";
import DriverCard from "../driverCard/DriverCard";


interface DriversListProps {
  drivers: any[];
  onSelect?: (userId: string) => void;
  onAction?: (action: string, value?: any) => void;
  role: Pick<User, "role">["role"]
}

const DriversList = ({ drivers, onAction, onSelect, role }: DriversListProps) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6 text-center">Driver List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {drivers.map((driver) => (
          <DriverCard key={driver._id} driver={driver} onAction={onAction} role={role} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
};

export default DriversList;
