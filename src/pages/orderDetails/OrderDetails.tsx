import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { CalendarClock, Package, Truck, User } from "lucide-react";
import { Order } from "../../types/order";
import { LocationInfo } from "./LocationInfo";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";

import "leaflet/dist/leaflet.css";

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Order Details</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {orderData.order_number}
                </p>
              </div>
            </div>
            <span className="ml-auto px-4 py-2 rounded-full bg-accent text-accent-content capitalize">
              {orderData.status.replace("_", " ")}
            </span>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Load Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                <p className="font-medium mt-1">
                  {orderData.load_details.type}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Weight
                </p>
                <p className="font-medium mt-1">
                  {orderData.load_details.weight}kg
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Dimensions
                </p>
                <p className="font-medium mt-1">
                  {orderData.load_details.dimensions.length}m ×{" "}
                  {orderData.load_details.dimensions.width}m ×{" "}
                  {orderData.load_details.dimensions.height}m
                </p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200 dark:border-gray-700" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-6">
            <LocationInfo type="pickup" address={orderData.pickup_address} />
            <LocationInfo
              type="delivery"
              address={orderData.delivery_address}
            />
          </div>

          <hr className="border-gray-200 dark:border-gray-700" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6">
            <div className="flex items-start gap-3">
              <div className="text-gray-500 dark:text-gray-400 mt-0.5">
                <User className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Driver
                </p>
                <Link
                  to={`/users/${orderData.assigned_driver}`}
                  className="font-medium"
                >
                  {orderData.driver_info}
                </Link>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-gray-500 dark:text-gray-400 mt-0.5">
                <Truck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Vehicle
                </p>
                <p className="font-medium">{orderData.vehicle_info}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-gray-500 dark:text-gray-400 mt-0.5">
                <CalendarClock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Estimated Delivery
                </p>
                <p className="font-medium">
                  {orderData.estimated_delivery_time}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 ">
            <h2 className="text-lg font-semibold mb-4">Route</h2>
            <div className="h-96 z-20">
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
    </div>
  );
}

export default OrderDetails;
