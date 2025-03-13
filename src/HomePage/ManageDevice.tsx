import { Device, Room } from "./HomePage";
import DeviceOverview from "./DeviceOverview";
import DeviceSmartFeature from "./DeviceSmartFeature";

interface ManageDeviceProps {
  devType: string | null;
  setActiveContent: (content: string) => void;
  getDevice: () => Device;
  getRoom: () => Room;
  setDevicesState: React.Dispatch<React.SetStateAction<Device[]>>;
  getSelectedDeviceStatus: (roomId: number, deviceId: number) => boolean;
  handleToggle: (roomId: number, deviceId: number) => void;
  setDevice: React.Dispatch<React.SetStateAction<Device>>;
  devicesState: Device[];
  getSelectedDeviceToggle: (
    roomId: number,
    deviceId: number,
    featureId: number
  ) => boolean;
  addFeature: boolean;
  handleAddFeature: (deviceId: number) => void;
  handleAddFeatureToggle: () => void;
  repeat: boolean;
  handleRepeatChange: () => void;
  hasSelect: boolean;
  setHasSelect: React.Dispatch<React.SetStateAction<boolean>>;
  turnOn: string;
  turnOff: string;
  handleTurnOnChange: (s: string) => void;
  handleTurnOffChange: (s: string) => void;
  turnOnPeriod: string;
  turnOffPeriod: string;
  toggleTime: (time: string, type: "turnOn" | "turnOff") => void;
  setAddFeature: React.Dispatch<React.SetStateAction<boolean>>;
}

const ManageDevice: React.FC<ManageDeviceProps> = ({
  devType,
  setActiveContent,
  getDevice,
  getRoom,
  setDevicesState,
  getSelectedDeviceStatus,
  handleToggle,
  setDevice,
  devicesState,
  getSelectedDeviceToggle,
  addFeature,
  handleAddFeature,
  handleAddFeatureToggle,
  repeat,
  handleRepeatChange,
  hasSelect,
  setHasSelect,
  turnOn,
  turnOff,
  handleTurnOnChange,
  handleTurnOffChange,
  turnOnPeriod,
  turnOffPeriod,
  toggleTime,
  setAddFeature,
}) => {
  return (
    <>
      {/* Purple Container */}
      <DeviceOverview
        setActiveContent={setActiveContent}
        getDevice={getDevice}
        getSelectedDeviceStatus={getSelectedDeviceStatus}
        handleToggle={handleToggle}
        getRoom={getRoom}
        setDevicesState={setDevicesState}
        setDevice={setDevice}
        devicesState={devicesState}
      />

      {devType === "light" || "aircond" || "petfeeder" || "irrigation" ? (
        <DeviceSmartFeature
          getSelectedDeviceToggle={getSelectedDeviceToggle}
          addFeature={addFeature}
          handleAddFeature={handleAddFeature}
          handleAddFeatureToggle={handleAddFeatureToggle}
          getDevice={getDevice}
          setDevicesState={setDevicesState}
          getRoom={getRoom}
          setActiveContent={setActiveContent}
          repeat={repeat}
          handleRepeatChange={handleRepeatChange}
          hasSelect={hasSelect}
          setHasSelect={setHasSelect}
          turnOn={turnOn}
          turnOff={turnOff}
          handleTurnOnChange={handleTurnOnChange}
          handleTurnOffChange={handleTurnOffChange}
          turnOnPeriod={turnOnPeriod}
          turnOffPeriod={turnOffPeriod}
          toggleTime={toggleTime}
          setAddFeature={setAddFeature}
        />
      ) : null}
    </>
  );
};

export default ManageDevice;
