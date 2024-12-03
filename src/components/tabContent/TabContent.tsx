import React from "react";

interface TabContentProps {
    activeTab: string;
    content: { [key: string]: React.ReactNode }; 
}

function TabContent({ activeTab, content }: TabContentProps) {
    return <div>{content[activeTab]}</div>;
}

export default TabContent;
