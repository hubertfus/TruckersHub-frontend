import { MapPin } from "lucide-react";

interface LocationInfoProps {
  type: "pickup" | "delivery";
  address: any;
}

export function LocationInfo({ type, address }: LocationInfoProps) {
  const iconColor = type === "pickup" ? "text-blue-500" : "text-red-500";
  const title = type === "pickup" ? "Pickup Location" : "Delivery Location";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MapPin className={`w-5 h-5 ${iconColor}`} />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="pl-7 space-y-1">
        <p className="font-medium">{address.street}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {address.city}, {address.zip_code}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {address.country}
        </p>
      </div>
    </div>
  );
}
