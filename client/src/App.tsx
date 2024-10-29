import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import DefaultLayout from "@/layouts/DefaultLayout";
import TimerPage from "@/pages/private/Timer";
import Signin from "@/pages/public/Signin";
import Signup from "@/pages/public/Signup";
import Profile from "@/pages/private/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/public/Home";

function App() {
	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route element={<DefaultLayout />}>
				<Route index element={<HomePage />} />
				<Route path="/signin" element={<Signin />} />
				<Route path="/signup" element={<Signup />} />
				<Route element={<ProtectedRoute />}>
					{/** Protected by checking if authenticated or not */}
					<Route path="/timer" element={<TimerPage />} />
					<Route path="/profile" element={<Profile />} />
				</Route>
			</Route>
		)
	);

	return <RouterProvider router={router} />;
}

export default App;
