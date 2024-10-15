import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function MainHeader() {
	// State variables
	const [isDropdownOpen, setDropdownOpen] = useState(false);

	const { logout } = useAuth();

	// Functions
	const toggleDropdown = () => {
		setDropdownOpen((prev) => !prev);
	};

	// Handler functions
	const handleLogout = () => {
		logout();
	};

	return (
		<div className="flex justify-between items-center w-full bg-blue-500 p-2 ">
			<a className="text-white text-4xl mb-2 font-bold cursor-pointer" href="/">
				Study Timer
			</a>
			<div className="relative mr-5">
				<img
					className="bg-blue-800 w-12 h-12 p-1 mx-2 mr-0 rounded-full hover:cursor-pointer"
					src="src/assets/avatar.svg"
					alt="User avatar"
					onClick={toggleDropdown}
				/>
				{/* Dropdown Menu */}
				{isDropdownOpen && (
					<div className="absolute right-0 mt-2 w-48 bg-blue-700 p-2 shadow-lg rounded-lg">
						<Link
							to="/profile"
							className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
						>
							Profile
						</Link>
						<button
							onClick={handleLogout}
							className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
						>
							Logout
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
