import StudyList from "@/components/study/list/StudyList";
import { useAuthStore } from "@/stores/auth";

export default function Profile() {
	const { user } = useAuthStore();

	return (
		<div className="flex flex-col p-6 gap-6 bg-slate-800 rounded-xl shadow-2xl cursor-default">
			<div className="flex justify-between items-center gap-5 my-3">
				<img src="/avatar.svg" alt="" className="w-32 h-32" />
				<div className="flex flex-col min-w-80">
					<h2 className="text-white underline font-bold text-3xl text-left mb-4">
						Study Profile
					</h2>
					<div className="flex py-2 gap-3 mb-2">
						<label className="w-1/3font-semibold text-xl text-white">
							Username:
						</label>
						<p className="w-2/3 text-gray-400 text-lg text-right">
							{user?.username}
						</p>
					</div>
					<div className="flex py-2">
						<label className="w-1/3 text-white font-semibold text-xl">
							Email:
						</label>
						<p className="w-2/3 text-gray-400 text-lg text-right">
							{user?.email}
						</p>
					</div>
				</div>
			</div>
			<div>
				<h2 className="text-white font-bold text-3xl mb-2 underline">
					Study stats:
				</h2>{" "}
				<StudyList />
			</div>
		</div>
	);
}
