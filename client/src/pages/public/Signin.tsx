import { useAuth } from "@/contexts/AuthContext";
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

export default function Signin() {
	// State variables
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	// Other variables
	const { login } = useAuth();

	// Handle functions
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		login(email, password);
	};

	return (
		<div className="flex m-auto justify-center items-center bg-blue-500 shadow-lg rounded-2xl p-5">
			<form onSubmit={handleSubmit}>
				<h2 className="text-white text-center text-3xl font-bold mb-3 cursor-default">
					Signin to Study Timer
				</h2>
				<div className="mb-2">
					<label className="block text-white text-xl font-bold mb-2">
						Email
					</label>
					<input
						className="w-full p-2 bg-white border border-grey-300 rounded-md"
						placeholder="Enter your email"
						onChange={(e) => setEmail(e.target.value)}
						value={email}
						type="text"
						required
						aria-required
						aria-description="user-email"
						minLength={3}
						maxLength={50}
					/>
				</div>
				<div className="mb-4">
					<label className="block text-white text-xl font-bold mb-2">
						Password
					</label>
					<input
						className="w-full p-2 bg-white border border-grey-300 rounded-md"
						placeholder="Enter your password"
						onChange={(e) => setPassword(e.target.value)}
						value={password}
						type="password"
						required
						aria-required
						aria-description="user-password"
						minLength={6}
					/>
				</div>
				<button
					className="w-full bg-orange-500 text-white font-bold py-2 rounded-md hover:bg-orange-600 hover:shadow-xl transition duration-150"
					type="submit"
				>
					Signin
				</button>
				<Link
					className="flex w-full h-8 justify-center items-end text-center text-blue-900 hover:text-purple-800 text-md font-bold"
					to="/signup"
				>
					Don't have an account? Signup First!
				</Link>
			</form>
		</div>
	);
}
