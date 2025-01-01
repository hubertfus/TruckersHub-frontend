import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { CalendarClock, Package, Truck, User } from "lucide-react";
import { Order } from "../../types/order";
import { LocationInfo } from "./LocationInfo";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import { statusClass } from "../../components/orderCard/OrderCard";

const GEOAPIFY_API_KEY = "b8568cb9afc64fad861a69edbddb2658";

const geocodeAddress = async (address: string) => {
  try {
    const response = await axios.get(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
        address
      )}&format=json&apiKey=${GEOAPIFY_API_KEY}`
    );

    const results = response.data.results;
    if (results && results.length > 0) {
      const { lat, lon } = results[0];
      return { lat, lon };
    } else {
      throw new Error("No coordinates found");
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    throw error;
  }
};

const getRoute = async (
  start: { lat: number; lon: number },
  end: { lat: number; lon: number }
) => {
  try {
    const response = await axios.get(
      `https://router.project-osrm.org/route/v1/driving/${start.lon},${start.lat};${end.lon},${end.lat}?overview=full&geometries=geojson`
    );

    if (response.data.routes.length > 0) {
      const route = response.data.routes[0];
      return route.geometry.coordinates.map(([lon, lat]: [number, number]) => ({
        lat,
        lon,
      }));
    }

    throw new Error("No route found");
  } catch (error) {
    console.error("Routing error:", error);
    return null;
  }
};

function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const [orderData, setOrderData] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [route, setRoute] = useState<{ lat: number; lon: number }[] | null>(
    null
  );

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const { data } = await axios.get(
          `http://${import.meta.env.VITE_API_ADDRESS}/orders/${id}`
        );
        const pickupCoords = await geocodeAddress(
          `${data?.pickup_address.city} ${data?.pickup_address.street} ${data?.pickup_address.zip_code}`
        );
        const deliveryCoords = await geocodeAddress(
          `${data?.delivery_address.city} ${data?.delivery_address.street} ${data?.delivery_address.zip_code}`
        );

        if (pickupCoords && deliveryCoords) {
          data.pickup_address.coordinates = pickupCoords;
          data.delivery_address.coordinates = deliveryCoords;
        }

        setOrderData(data);
      } catch (err) {
        console.error("Error fetching order data:", err);
        setError("Failed to load order data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [id]);

  useEffect(() => {
    const fetchRoute = async () => {
      if (
        orderData?.pickup_address.coordinates &&
        orderData.delivery_address.coordinates
      ) {
        const route = await getRoute(
          orderData.pickup_address.coordinates,
          orderData.delivery_address.coordinates
        );
        setRoute(route);
      }
    };

    fetchRoute();
  }, [orderData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <p className="text-lg font-semibold text-base-content/70">
          Loading order details...
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

  if (!orderData) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <p className="text-lg font-semibold text-base-content/70">
          No order data available.
        </p>
      </div>
    );
  }

  const pickupCoordinates = orderData.pickup_address.coordinates;
  const deliveryCoordinates = orderData.delivery_address.coordinates;

  if (
    !pickupCoordinates ||
    !pickupCoordinates.lat ||
    !pickupCoordinates.lon ||
    !deliveryCoordinates ||
    !deliveryCoordinates.lat ||
    !deliveryCoordinates.lon
  ) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <p className="text-lg font-semibold text-error">
          Invalid location data.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center py-8 px-4">
      <div className="card w-full max-w-4xl shadow-xl bg-base-100">
        <div className="card-header flex items-center justify-between p-4 border-b border-base-300">
          <div className="flex items-center gap-4">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-12 h-12 flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h2 className="card-title text-lg font-bold">
                {orderData.order_number}
              </h2>
              <p className="text-sm text-primary">
                {orderData.status.replace("_", " ")}
              </p>
            </div>
          </div>
          <div className={`badge ${statusClass[orderData.status]} p-4`}>
            {orderData.status.replace("_", " ")}
          </div>
        </div>

        <div className="card-body">
          <h2 className="text-lg font-semibold mb-4">Load Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="stat">
              <div className="stat-title">Type</div>
              <div>{orderData.load_details.type}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Weight</div>
              <div>{orderData.load_details.weight} kg</div>
            </div>
            <div className="stat">
              <div className="stat-title">Dimensions</div>
              <div>
                {orderData.load_details.dimensions.length}m ×{" "}
                {orderData.load_details.dimensions.width}m ×{" "}
                {orderData.load_details.dimensions.height}m
              </div>
            </div>
          </div>

          <div className="divider"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <LocationInfo type="pickup" address={orderData.pickup_address} />
            <LocationInfo
              type="delivery"
              address={orderData.delivery_address}
            />
          </div>

          <div className="divider"></div>

          <h2 className="text-lg font-semibold mb-4">Driver and Vehicle</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="font-semibold flex gap-2">
                <User className="w-6 h-6" />
                Driver
              </p>
              <Link to={`/users/${orderData.assigned_driver}`} className="link">
                {orderData.driver_info}
              </Link>
            </div>
            <div>
              <p className="font-semibold flex gap-2">
                <Truck className="w-6 h-6" />
                Vehicle
              </p>
              <Link to={`/vehicle/${orderData.vehicle_id}`}>
                {orderData.vehicle_info}
              </Link>
            </div>
            <div>
              <p className="font-semibold flex gap-2">
                <CalendarClock className="w-6 h-6" />
                Estimated Delivery
              </p>
              <p>{orderData.estimated_delivery_time}</p>
            </div>
          </div>
        </div>

        <div className="card-body">
          <h2 className="text-lg font-semibold mb-4">Route</h2>
          <div className="h-96">
            <MapContainer
              center={[pickupCoordinates.lat, pickupCoordinates.lon]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker
                position={[pickupCoordinates.lat, pickupCoordinates.lon]}
              />
              <Marker
                position={[deliveryCoordinates.lat, deliveryCoordinates.lon]}
              />
              {route && (
                <Polyline
                  positions={route.map((coord) => [coord.lat, coord.lon])}
                  pathOptions={{ color: "blue" }}
                />
              )}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
