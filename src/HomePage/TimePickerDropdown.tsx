interface TimePickerProps {
  selectedHour: string;
  setSelectedHour: React.Dispatch<React.SetStateAction<string>>;
  selectedMinute: string;
  setSelectedMinute: React.Dispatch<React.SetStateAction<string>>;
}

const TimePickerDropdown: React.FC<TimePickerProps> = ({
  selectedHour,
  setSelectedHour,
  selectedMinute,
  setSelectedMinute,
}) => {
  // Generate minutes (00-59)
  const generateMinutes = () => {
    return Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));
  };

  // Generate hours (00-23 for 24-hour format)
  const generateHours = () => {
    return Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
  };

  return (
    <div className="d-flex flex-column">
      <div
        className="d-flex gap-2 justify-content-center align-items-center mb-2"
        style={{ height: "48px" }}
      >
        {/* Hour Dropdown */}
        <div className="dropdown">
          <button
            className="btn dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{
              backgroundColor: "#eeeeee",
              color: "#404040",
              width: "100%",
              borderRadius: "10px",
            }}
          >
            {selectedHour || "Hour"}
          </button>
          <ul
            className="dropdown-menu w-100"
            style={{ maxHeight: "200px", overflowY: "auto", minWidth: "60px" }}
          >
            {generateHours().map((hour) => (
              <li key={hour}>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedHour(hour);
                  }}
                >
                  {hour}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <span>:</span>

        {/* Minute Dropdown */}
        <div className="dropdown">
          <button
            className="btn dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{
              backgroundColor: "#eeeeee",
              color: "#404040",
              width: "100%",
              borderRadius: "10px",
            }}
          >
            {selectedMinute || "Minute"}
          </button>
          <ul
            className="dropdown-menu w-100"
            style={{ maxHeight: "200px", overflowY: "auto", minWidth: "60px" }}
          >
            {generateMinutes().map((minute) => (
              <li key={minute}>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setSelectedMinute(minute);
                  }}
                >
                  {minute}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TimePickerDropdown;
