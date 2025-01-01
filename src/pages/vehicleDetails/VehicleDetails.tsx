import axios from "axios";
import { MapPin, Calendar, Wrench, Truck, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Vehicle } from "../../types/vehicle";

function VehicleDetails() {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const { data } = await axios.get(
          `http://${import.meta.env.VITE_API_ADDRESS}/vehicles/${id}`
        );
        setVehicle(data.vehicle);
      } catch (err) {
        console.error("Error fetching vehicle data:", err);
        setError("Failed to load vehicle data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <p className="text-lg font-semibold text-base-content/70">
          Loading vehicle details...
        </p>
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

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <p className="text-lg font-semibold text-base-content/70">
          No vehicle data available.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="card-title text-3xl font-bold">
                  {vehicle.brand} {vehicle.model}
                </h1>
                <p className="text-lg text-base-content/70 mt-1">
                  License Plate: {vehicle.license_plate}
                </p>
              </div>
              <div
                className={`badge badge-lg ${
                  vehicle.isInUse ? "badge-error" : "badge-success"
                } px-4 py-2 text-lg font-medium`}
              >
                {vehicle.isInUse ? "In Use" : "Available"}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl flex items-center mb-4">
                <Truck className="w-5 h-5 mr-2" /> Vehicle Information
              </h2>
              <div className="space-y-3">
                <p className="text-base-content/70">
                  Year:{" "}
                  <span className="text-base-content font-bold">
                    {vehicle.year}
                  </span>
                </p>
                <div>
                  <h3 className="font-medium text-base-content/70 mb-2">
                    Capacity
                  </h3>
                  <div className="pl-4 space-y-1">
                    <p className="text-base-content/70">
                      Weight:{" "}
                      <span className="text-base-content font-bold">
                        {vehicle.capacity.weight} kg
                      </span>
                    </p>
                    <p className="text-base-content/70">
                      Volume:{" "}
                      <span className="text-base-content font-bold">
                        {vehicle.capacity.volume.length}m ×{" "}
                        {vehicle.capacity.volume.width}m ×{" "}
                        {vehicle.capacity.volume.height}m
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-xl flex items-center mb-4">
                <MapPin className="w-5 h-5 mr-2" /> Current Location
              </h2>
              <div className="space-y-2">
                <p className="text-base-content/70">
                  Latitude:{" "}
                  <span className="text-base-content font-bold">
                    {vehicle.current_location.latitude}°
                  </span>
                </p>
                <p className="text-base-content/70">
                  Longitude:{" "}
                  <span className="text-base-content font-bold">
                    {vehicle.current_location.longitude}°
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl md:col-span-2">
            <div className="card-body">
              <h2 className="card-title text-xl flex items-center mb-4">
                <Wrench className="w-5 h-5 mr-2" /> Maintenance Schedule
              </h2>
              {vehicle.maintenance_schedule.map((maintenance, index) => (
                <div
                  key={index}
                  className="border-l-4 border-primary pl-4 py-2"
                >
                  <div className="flex items-center text-base-content/70">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(maintenance.date).toLocaleDateString()}
                  </div>
                  <p className="font-medium text-base-content">
                    {maintenance.service_type}
                  </p>
                  <p className="text-base-content/70">
                    {maintenance.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl md:col-span-2">
            <div className="card-body">
              <h2 className="card-title text-xl flex items-center mb-4">
                <Clock className="w-5 h-5 mr-2" /> System Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-base-content/70">Created At:</p>
                  <p className="text-base-content font-bold">
                    {new Date(vehicle.created_at ?? "").toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-base-content/70">Last Updated:</p>
                  <p className="text-base-content font-bold">
                    {new Date(vehicle.updated_at ?? "").toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetails;
