import { useAuth } from "@/contexts/AuthContext";
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { register } = useAuth();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    register(username, email, password);
  };

  return (
    <div className="flex justify-center items-center bg-blue-500 shadow-lg rounded-2xl p-5">
      <form className="w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-white text-center text-3xl font-bold mb-2 cursor-default">
          Signup to Study Timer
        </h2>
        <div className="mb-2">
          <label className="block text-white text-xl font-bold mb-2">
            Username
          </label>
          <input
            className="w-full p-2 bg-white border border-grey-300 rounded-md"
            placeholder="Enter your username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            type="text"
          />
        </div>
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
          />
        </div>
        <button
          className="w-full bg-orange-500 text-white font-bold py-2 p-4 px-2 rounded-md hover:bg-orange-600 hover:shadow-xl transition-all duration-200"
          type="submit"
        >
          Signin
        </button>
        <Link
          className="flex w-full h-8 justify-center items-end text-center text-blue-900 hover:text-purple-800 text-md font-bold"
          to="/signin"
        >
          Already have an account? Signin!
        </Link>
      </form>
    </div>
  );
}
