import { Edit, Trash2 } from "lucide-react";
import { orderCardActions } from "./OrderCard";

interface ActionButtonsProps {
  role: string;
  status: string;
  id: string;
  vehicleInfo: string;
  driverInfo: string;
  onAction: (action: orderCardActions, value?: any) => void;
  handleAssignDriverModal: () => void;
  handleAssignVehicleModal: () => void;
  handleEditModal: () => void;
  handleChangeDriverModal: () => void;
  handleChangeVehicleModal: () => void;
}

function ActionButtons({
  role,
  status,
  id,
  vehicleInfo,
  driverInfo,
  onAction,
  handleAssignDriverModal,
  handleAssignVehicleModal,
  handleEditModal,
  handleChangeDriverModal,
  handleChangeVehicleModal,
}: ActionButtonsProps) {
  return (
    <div className="flex mt-4 flex-1 items-end">
      <div className="flex flex-row flex-1 flex-wrap gap-2 ">
        {role === "driver" && (
          <>
            {status === "in_progress" && (
              <button
                className="btn btn-error btn-sm w-full"
                onClick={() => onAction("cancel", id)}
              >
                Cancel Order
              </button>
            )}
            {status === "created" && (
              <button
                className="btn btn-success btn-sm w-full"
                onClick={() => onAction("accept", id)}
              >
                Accept Order
              </button>
            )}
          </>
        )}
        {role === "dispatcher" && (
          <>
            {status === "created" && (
              <button
                className="btn btn-primary btn-sm w-full"
                onClick={handleAssignDriverModal}
              >
                Assign Driver
              </button>
            )}
            {status === "in_progress" && (
              <>
                <button
                  className="btn btn-success btn-sm w-full"
                  onClick={() => onAction("complete", id)}
                >
                  Mark as Complete
                </button>

                {!driverInfo ? (
                  <button
                    className="btn btn-warning btn-sm w-full"
                    onClick={handleAssignDriverModal}
                  >
                    Assign Driver
                  </button>
                ) : (
                  <button
                    className="btn btn-warning btn-sm w-full"
                    onClick={handleChangeDriverModal}
                  >
                    Change Driver
                  </button>
                )}

                {!vehicleInfo ? (
                  <button
                    className="btn btn-warning btn-sm w-full"
                    onClick={handleAssignVehicleModal}
                  >
                    Assign Vehicle
                  </button>
                ) : (
                  <button
                    className="btn btn-warning btn-sm w-full"
                    onClick={handleChangeVehicleModal}
                  >
                    Change Vehicle
                  </button>
                )}
              </>
            )}
            <button
              className="btn btn-error btn-sm w-full"
              onClick={() => onAction("delete", id)}
            >
              <Trash2 className="mr-1" />
              Delete Order
            </button>
            <button
              className="btn btn-warning btn-sm w-full"
              onClick={handleEditModal}
            >
              <Edit className="mr-1" />
              Edit Order
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ActionButtons;
