import { useEffect, useState } from "react";
import { Check, User, AlertCircle } from "lucide-react";
import axios from "axios";
import Tabs from "../tabs/Tabs";
import DriverList from "../driversList/DriversList";
import { useUser } from "../../ctx/UserContext";
import ToastGroup from "../toastGroup/ToastGroup";
import Toast from "../toast/Toast";

function DriversSection() {
    const [activeTab, setActiveTab] = useState<string>("all");
    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { user } = useUser()
    const [toasts, setToasts] = useState<{type:string, message:string}[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const {data} = await axios.get(`http://${import.meta.env.VITE_API_ADDRESS}/users`, {
                    params: { role: activeTab === "all" ? undefined : "driver" },
                });
                setToasts(prev => [...prev, { type: "success", message: data.message }]);

                setData(data.drivers);
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
                    const {data} = await axios.put(
                        `http://${import.meta.env.VITE_API_ADDRESS}/users/edit/${value.driverId}`,{
                            ...value.editedDriver
                        }
                    );
                    setToasts(prev => [...prev, { type: "success", message: data.message }]);

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
        if (action === "delete") {
            try {
                const {data} = await axios.delete(
                    `http://${import.meta.env.VITE_API_ADDRESS}/users/delete/${value}`
                );
                setToasts(prev => [...prev, { type: "success", message: data.message }]);

                setData((prev: any[]) => prev.filter((driver) => driver._id !== value));
            } catch (error) {
                console.error(error);
            }
            return;
        }
        if(action==="assignToOrder"){
            try {
                const {data} = await axios.post(
                   `http://${import.meta.env.VITE_API_ADDRESS}/orders/assign-driver`,{
                   orderId:value.orderId, driverId: value.driverId, dispatcherId: user?.id
                   }
               );
               setToasts(prev => [...prev, { type: "success", message: data.message }]);

               const dialog = document.getElementById(`assignToOrder${value.driverId}`);
               if (dialog && dialog instanceof HTMLDialogElement) {
                   dialog.close();
               }
               setData(prev=> prev.map((vehicle:any)=> vehicle._id===value.vehicleId?{...vehicle,isInUse:true} : vehicle))
           } catch (error) {
               console.error(error);
           }
           return;
       }
    }
    
    const closeToastHandle = (index: number)=>{
        setToasts(prev => prev.filter((_,indx)=> indx !== index))
    }

    return (
        <div>
            <ToastGroup>
                {toasts?.map(((toast,index)=><Toast key={index} type={toast.type} message={toast.message} onClose={closeToastHandle} index={index}/>))}
            </ToastGroup>
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            <DriverList drivers={filteredDrivers(activeTab)} onAction={handleAction} role="dispatcher"/>
        </div>
    );
}

export default DriversSection;
