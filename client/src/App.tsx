import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import DefaultLayout from "@/layouts/DefaultLayout";
import HomePage from "@/pages/private/Home";
import Signin from "@/pages/public/Signin";
import Signup from "@/pages/public/Signup";
import Profile from "@/pages/private/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route element={<DefaultLayout />}>
				<Route path="/signin" element={<Signin />} />
				<Route path="/signup" element={<Signup />} />
				<Route element={<ProtectedRoute />}>
					{/** Protected by checking if authenticated or not */}
					<Route index element={<HomePage />} />
					<Route path="/profile" element={<Profile />} />
				</Route>
			</Route>
		)
	);

	return <RouterProvider router={router} />;
}

export default App;
