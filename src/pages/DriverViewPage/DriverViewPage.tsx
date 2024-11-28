import { useEffect, useState } from "react";
import { Order } from "../../types/order.ts";
import axios from "axios";
import OrderCard from "../../components/orderCard/OrderCard.tsx";
import { X, Truck, UserSearch, Check } from "lucide-react";
import { useUser } from "../../ctx/UserContext";
import { useNavigate } from "react-router-dom";

function DriverViewPage() {
    const [data, setData] = useState<Order[]>();
    const { user } = useUser();
    const navigate = useNavigate();  
    
    useEffect(() => {
        if (user !== null) {
            axios.get(`http://${import.meta.env.VITE_API_ADDRESS}/orders`, {
                params: {
                    driverId: user.id,
                },
            }).then((response) => {
                setData(response.data);
                console.log(response.data);
            }).catch(error => {
                console.error('Error fetching orders:', error);
            });
        } else {
            navigate("/")
            console.log("User not logged in");
        }
    }, [user]);

    return (
        <div className="p-5">
            <h2 className="text-center">Available Orders</h2>
            <div className="flex flex-row flex-wrap justify-center gap-4">
                <span className="indicator-item badge badge-info h-fit gap-2">
                    <UserSearch /> created
                </span>
                <span className="indicator-item badge badge-error h-fit gap-2">
                    <X /> Canceled
                </span>
                <span className="indicator-item badge badge-primary h-fit gap-2">
                    <Truck /> In progress
                </span>
                <span className="indicator-item badge badge-success h-fit gap-2">
                    <Check /> Completed
                </span>
            </div>
            <div className="flex flex-wrap flex-row gap-5 justify-center pt-16 p-4">
                {data && data.map((order) => (
                    <OrderCard key={order._id} {...order} />
                ))}
            </div>
        </div>
    );
}

export default DriverViewPage;
