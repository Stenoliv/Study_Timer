import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function MainHeader() {
	// State variables
	const [isDropdownOpen, setDropdownOpen] = useState(false);
	const [isClosing, setIsClosing] = useState(false);
	const dropdownRef = useRef<HTMLDivElement | null>(null);
	const avatarRef = useRef<HTMLImageElement | null>(null);

	const { authenticated, logout } = useAuth();

	// Functions
	const toggleDropdown = () => {
		if (isDropdownOpen) {
			setIsClosing(true);
			setTimeout(() => {
				setDropdownOpen(false);
				setIsClosing(false);
			}, 100);
		} else {
			setDropdownOpen(true);
		}
	};

	// Handler functions
	const handleLogout = () => {
		logout();
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node) &&
				avatarRef.current &&
				!avatarRef.current.contains(event.target as Node)
			) {
				setIsClosing(true);
				setTimeout(() => {
					setDropdownOpen(false);
					setIsClosing(false);
				}, 100);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className="flex justify-between items-center w-full bg-blue-500 p-2 drop-shadow-xl pointer-events-auto z-20">
			<a
				className="text-white text-4xl mb-2 font-bold cursor-pointer"
				href={!authenticated ? "/" : "/timer"}
			>
				Study Timer
			</a>
			{authenticated ? (
				<div className="relative mr-5 items-center gap-2">
					<img
						ref={avatarRef}
						className="relative bg-blue-800 w-12 h-12 p-1 rounded-full hover:cursor-pointer"
						src="/avatar.svg"
						alt="User avatar"
						onClick={toggleDropdown}
					/>
					{/* Dropdown Menu */}
					{isDropdownOpen && (
						<div
							ref={dropdownRef}
							className={`absolute right-0 flex flex-col mt-5 bg-blue-700 shadow-lg rounded-lg justify-center ${
								isClosing
									? "animate-pop-out pointer-events-none"
									: "animate-pop-in"
							} ${isClosing && !isDropdownOpen ? "opacity-0" : "opacity-100"}`}
							onAnimationEnd={() => {
								if (!isDropdownOpen) setDropdownOpen(false);
							}}
						>
							<Link
								to="/profile"
								className="block px-4 py-2 text-white font-semibold text-l hover:bg-blue-800 rounded-t-md"
							>
								Profile
							</Link>
							<button
								onClick={handleLogout}
								className="block px-4 py-2 text-white font-semibold text-l hover:bg-blue-800 rounded-b-md"
							>
								Logout
							</button>
						</div>
					)}
				</div>
			) : (
				<div className="flex mr-2 gap-0.5 text-white text-2xl items-end pb-1.5">
					<NavLink className="text-white text-lg font-semibold" to={"/signin"}>
						<span>Signin</span>
					</NavLink>
					/
					<NavLink className="text-white text-lg font-semibold" to={"/signup"}>
						<span>Signup</span>
					</NavLink>
				</div>
			)}
		</div>
	);
}
