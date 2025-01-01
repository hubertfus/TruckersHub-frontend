interface Tab {
  key: string;
  label: string;
  icon?: React.ElementType;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div role="tablist" className="tabs tabs-bordered justify-center my-4">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`tab ${activeTab === tab.key ? "tab-active" : ""}`}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.icon && <tab.icon className="inline-block mr-2" />}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default Tabs;
