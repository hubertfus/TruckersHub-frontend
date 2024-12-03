import { useState } from "react";
import Tabs from "../tabs/Tabs";

function VehiclesSection() {
    const [activeSubTab, setActiveSubTab] = useState<string>("all");

    const tabs = [
        { key: "all", label: "All" },
        { key: "in_use", label: "In Use" },
        { key: "available", label: "Available" },
    ];

    return (
        <div>
            <Tabs tabs={tabs} activeTab={activeSubTab} onTabChange={setActiveSubTab} />
            <div className="p-4">
                <p>Currently showing vehicles: {activeSubTab}</p>
            </div>
        </div>
    );
}

export default VehiclesSection;
