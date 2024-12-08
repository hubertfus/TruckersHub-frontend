function DriversList({
  drivers,
  onSelect,
}: {
  drivers: any[];
  onSelect?: (userId: string) => void;
}) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6 text-center">Driver List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {drivers.map((driver) => {
          const driverName = driver.name || '';

          return (
            <div
              key={driver._id}
              className="card cursor-pointer bg-base-100 shadow-lg border border-gray-200 p-6 flex flex-col items-center justify-between space-y-4 transition-transform hover:scale-105"
              onClick={() => onSelect && onSelect(driver._id)}
            >
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold text-white bg-blue-500">
                {driverName
                  .split(" ")
                  .map((namePart: string) => namePart[0])
                  .join("")}
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold">{driverName}</h2>
                <p className="text-sm text-gray-500">
                  License: {driver.license_number || "N/A"}
                </p>
                <p className="text-sm text-gray-500">Phone: {driver.phone}</p>
                <p className="text-sm text-gray-500">Email: {driver.email}</p>
              </div>

              <div className="flex items-center space-x-2">
                <span
                  className={`badge ${
                    driver.availability ? "badge-success" : "badge-error"
                  } text-sm`}
                >
                  {driver.availability ? "Available" : "In Use"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DriversList;
