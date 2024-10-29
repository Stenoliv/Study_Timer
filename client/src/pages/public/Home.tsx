import Leaderboard from "@/components/leaderboard";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
	const { authenticated } = useAuth();
	return (
		<>
			<Leaderboard />
			{authenticated ? <div></div> : <div></div>}
		</>
	);
}
