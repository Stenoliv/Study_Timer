import useDropdown from "./useDropdown";

const Dropdown = ({ currentTime, onSelect }) => {
  const options = [5, 10, 20, 30, 40, 50, 60];
  const { isOpen, selectedOption, toggleDropdown, handleOptionClick } =
    useDropdown(currentTime);

  return (
    <div className="relative inline-block text-left my-2">
      <div>
        <button
          onClick={toggleDropdown}
          className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-slate-900 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {selectedOption + " seconds" || "Select Time"}
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-2 rounded-md shadow-lg bg-slate-900 ring-1 ring-black ring-opacity-5 w-28">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  handleOptionClick(option);
                  onSelect(option);
                }}
                className="block px-4 py-2 text-sm text-white hover:bg-blue-700 text-center w-full"
                role="menuitem"
              >
                {option} seconds
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default Dropdown;
