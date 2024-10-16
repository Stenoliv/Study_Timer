import { useEffect, useRef, useState } from "react";

export interface ToastProps {
  id: string;
  msg: string;
  type: "success" | "error" | "info";
  duration: number;
  onClose: (id: string) => void;
}

export default function Toast(props: ToastProps) {
  const { id, msg, type, duration, onClose } = props;
  const [remainingTime, setRemainingTime] = useState(duration); // Remaining time for toast
  const [isHovered, setIsHovered] = useState(false); // Hover state
  const [isVisible, setIsVisible] = useState(true); // Visibility of the toast
  const startTime = useRef<number>(Date.now()); // Track the time the toast starts
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Reference for the interval

  useEffect(() => {
    startTimer();
    return () => clearInterval(intervalRef.current!);
  });

  // Start the timer
  const startTimer = () => {
    if (!intervalRef.current) clearInterval(intervalRef.current!);
    intervalRef.current = setInterval(() => {
      if (!isHovered) {
        const timeElapsed = Date.now() - startTime.current;
        const newRemainingTime = duration - timeElapsed;

        // Update remaining time
        setRemainingTime(newRemainingTime);

        // Check if the toast duration is over
        if (newRemainingTime <= 0) {
          clearInterval(intervalRef.current!);
          setIsVisible(false); // Trigger pop-out animation
          setTimeout(() => onClose(id), 100); // Close the toast after animation
        }
      }
    }, 10); // Update every 100ms
  };

  // Handle mouse enter event
  const handleMouseEnter = () => {
    setIsHovered(true);
    clearInterval(intervalRef.current!); // Pause timer
  };

  // Handle mouse leave event
  const handleMouseLeave = () => {
    setIsHovered(false);
    startTime.current = Date.now() - (duration - remainingTime); // Adjust start time
    startTimer(); // Resume timer
  };

  const progressPercentage = (remainingTime / duration) * 100;

  const toastStyle = {
    success: "bg-green-500 border-2 border-green-500",
    error: "bg-red-500 border-2 border-red-500",
    info: "bg-blue-500 border-2 border-blue-500",
  }[type];

  return (
    <div
      className={`${
        isVisible ? "animate-pop-in" : "animate-pop-out"
      } ${toastStyle} relative text-white flex items-center justify-between px-4 py-3 m-2 rounded-md shadow-md hover:border-white cursor-pointer pointer-events-auto`}
      onClick={() => {
        setIsVisible(false);
        setTimeout(() => onClose(id), 300); // Close immediately on click
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <p className="mr-4">{msg}</p>
      <div
        className="absolute rounded-md bottom-0 left-0 h-1 bg-white"
        style={{
          width: `${progressPercentage}%`,
        }}
      ></div>
    </div>
  );
}
