import { useEffect, useState } from "react";

import OrdersSection from "../../components/ordersSection/OrdersSection";
import DriversSection from "../../components/driversSection/DriversSection";
import VehiclesSection from "../../components/vehiclesSection/VehiclesSection";
import Tabs from "../../components/tabs/Tabs";
import TabContent from "../../components/tabContent/TabContent";
import { useUser } from "../../ctx/UserContext";
import { useNavigate } from "react-router-dom";

function DispatcherViewPage() {
  const [activeMainTab, setActiveMainTab] = useState<string>("orders");
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
      console.log("User not logged in");
    }
  }, [user, navigate]);

  const mainTabs = [
    { key: "orders", label: "Orders" },
    { key: "drivers", label: "Drivers" },
    { key: "vehicles", label: "Vehicles" },
  ];

  const content = {
    orders: <OrdersSection />,
    drivers: <DriversSection />,
    vehicles: <VehiclesSection />,
  };

  return (
    <div className="p-5">
      <h2 className="text-center">Management Panel</h2>
      <Tabs
        tabs={mainTabs}
        activeTab={activeMainTab}
        onTabChange={setActiveMainTab}
      />
      <TabContent activeTab={activeMainTab} content={content} />
    </div>
  );
}

export default DispatcherViewPage;
