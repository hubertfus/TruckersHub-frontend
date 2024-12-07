import { useEffect, useState } from "react";
import { Check, Truck, AlertCircle } from "lucide-react";
import axios from "axios";
import Tabs from "../tabs/Tabs";
import VehiclesList from "../vehiclesList/VehiclesList";

function VehiclesSection() {
    const [activeTab, setActiveTab] = useState<string>("all");
    const [data, setData] = useState([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://${import.meta.env.VITE_API_ADDRESS}/vehicles`);
                setData(response.data);
            } catch (err: any) {
                console.error("Error fetching vehicles:", err);
                setError(err.message || "Unknown error occurred");
            }
        };

        fetchData();
    }, []);

    const filteredVehicles = (status: string) => {
        if (status === "all") return data;
        if (status === "available") return data.filter((vehicle: any) => !vehicle.isInUse);
        if (status === "in_use") return data.filter((vehicle: any) => vehicle.isInUse);
        return [];
    };

    const tabs = [
        { key: "all", label: "All", icon: Truck },
        { key: "available", label: "Available", icon: Check },
        { key: "in_use", label: "In Use", icon: AlertCircle },
    ];

    if (error) {
        return <p className="text-red-500">Error fetching vehicles: {error}</p>;
    }

    return (
        <div>
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            <VehiclesList vehicles={filteredVehicles(activeTab)} role="dispatcher" />
        </div>
    );
}

export default VehiclesSection;
