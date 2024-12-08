import { useEffect, useState } from "react";
import { Check, User, AlertCircle } from "lucide-react";
import axios from "axios";
import Tabs from "../tabs/Tabs";
import DriverList from "../driversList/DriversList";

function DriversSection() {
    const [activeTab, setActiveTab] = useState<string>("all");
    const [data, setData] = useState([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://${import.meta.env.VITE_API_ADDRESS}/users`, {
                    params: { role: activeTab === "all" ? undefined : "driver" },
                });
                setData(response.data);
            } catch (err: any) {
                console.error("Error fetching drivers:", err);
                setError(err.message || "Unknown error occurred");
            }
        };

        fetchData();
    }, [activeTab]);

    const filteredDrivers = (status: string) => {
        if (status === "all") return data;
        if (status === "available") return data.filter((driver: any) => driver.availability === true);
        if (status === "in_use") return data.filter((driver: any) => driver.availability === false);
        return [];
    };

    const tabs = [
        { key: "all", label: "All", icon: User },
        { key: "available", label: "Available", icon: Check },
        { key: "in_use", label: "In Use", icon: AlertCircle },
    ];

    if (error) {
        return <p className="text-red-500">Error fetching drivers: {error}</p>;
    }

    const handleAction = async (action: string, value?: any) =>{
        if(action==="edit"){
            if(action==="edit"){
                try {
                    console.log(value)
                   await axios.put(
                        `http://${import.meta.env.VITE_API_ADDRESS}/users/edit/${value.driverId}`,{
                            ...value.editedDriver
                        }
                    );
                    setData((prev:any) =>
                        prev.map((driver:any)=> driver._id===value.driverId ?{...driver, email:value.editedDriver.email,
                            license_number: value.editedDriver.license_number, name: value.editedDriver.name, 
                            phone: value.editedDriver.phone
                        }: driver )
                      );
                } catch (error) {
                    console.error("Error while deleting vehicle:", error);
                }   
                return;
            }
        }
    }

    return (
        <div>
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            <DriverList drivers={filteredDrivers(activeTab)} onAction={handleAction}/>
        </div>
    );
}

export default DriversSection;
