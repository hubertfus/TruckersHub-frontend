import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CurrentOrder } from "../../components/currentOrder/CurrentOrder";
import { OrderHistory } from "../../components/orderHistory/OrderHistory";
import { UserProfile } from "../../components/userProfile/UserProfile";
import { VehicleInfo } from "../../components/vehicleInfo/VehicleInfo";
import axios from "axios";

export interface Order {
  _id: string;
  order_number: string;
  status: string;
  load_details: {
    type: string;
    weight: number;
    dimensions: { length: number; width: number; height: number };
  };
  pickup_address: { street: string; city: string; zip_code: string; country: string };
  delivery_address: { street: string; city: string; zip_code: string; country: string };
  created_at: string; 
}

export interface Vehicle {
  license_plate: string;
  model: string;
  brand: string;
  year: number;
  capacity: {
    weight: number;
    volume: { length: number; width: number; height: number };
  };
  current_location: { latitude: number; longitude: number };
}

export interface UserData {
  name: string;
  email: string;
  role: string;
  phone: string;
  license_number: string;
  availability: boolean;
  created_at: string;
  current_order: Order | null;
  current_vehicle: Vehicle | null;
  completed_or_cancelled_orders: Order[];
}

function UserDetails() {
  const { id } = useParams<{ id: string }>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get(`http://${import.meta.env.VITE_API_ADDRESS}/users/${id}`);
        setUserData(data.user);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <p className="text-lg font-semibold text-base-content/70">Loading user details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <p className="text-lg font-semibold text-error">{error}</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <p className="text-lg font-semibold text-base-content/70">No user data available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <UserProfile {...userData} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {userData.current_order && <CurrentOrder {...userData.current_order} />}
          {userData.current_vehicle && <VehicleInfo {...userData.current_vehicle} />}
        </div>

        {userData.completed_or_cancelled_orders && (
          <OrderHistory orders={userData.completed_or_cancelled_orders} />
        )}
      </div>
    </div>
  );
}

export default UserDetails;
