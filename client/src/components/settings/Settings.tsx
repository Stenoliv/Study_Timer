import { useState } from "react";
import Dropdown from "./Dropdown";

export default function Settings({
  addTime,
  onSetAddTime,
  setTime,
  timerType,
  setTimerType,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSettings = () => {
    setIsOpen((prev) => !prev);
  };
  const deleteSession = () => {
    setTime(0);
  };
  const handleTimerTypeChange = (type) => {
    setTimerType(type);
  };
  return (
    <div className="flex justify-center">
      <div>
        <button className="text-4xl" onClick={toggleSettings}>
          ⚙
        </button>
      </div>
      {isOpen && (
        <div className="absolute bg-slate-800 z-10 py-4 px-20 ">
          <div className="flex flex-col">
            <button
              className="bg-gray-900 text-white p-2 border-2 rounded-lg border-white text-xl"
              onClick={toggleSettings}
            >
              Close settings
            </button>
          </div>
          <div className="border-white border-2 rounded-md my-4">
            <p className="text-white text-xl mx-4 my-2">
              Time adjustment interval
            </p>
            <Dropdown currentTime={addTime} onSelect={onSetAddTime} />
          </div>
          <div className="border-white border-2 rounded-md my-4">
            <p className="text-white text-xl mx-4 my-2">Timer Type</p>
            <div>
              <button
                className={`border-white border-2 rounded-md m-4 p-2 text-white ${
                  timerType === "classic" ? "bg-cyan-600" : "bg-slate-900"
                }`}
                onClick={() => handleTimerTypeChange("classic")}
              >
                Classic
              </button>
              <button
                className={`border-white border-2 rounded-md m-4 p-2 text-white ${
                  timerType === "counter" ? "bg-cyan-600" : "bg-slate-900"
                }`}
                onClick={() => handleTimerTypeChange("counter")}
              >
                Counter
              </button>
            </div>
          </div>
          <div>
            <button
              className="border-white border-2 rounded-md p-2 text-white bg-slate-900 px-12"
              onClick={deleteSession}
            >
              Delete current session
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
