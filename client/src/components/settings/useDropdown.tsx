import { useState } from "react";

const useDropdown = (currentTime) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(currentTime);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    console.log(option);
    setIsOpen(false);
  };

  return { isOpen, selectedOption, toggleDropdown, handleOptionClick };
};

export default useDropdown;
