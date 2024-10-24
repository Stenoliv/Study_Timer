import { Session } from "@/db/models/session.model";

export async function createSession(
	userId: string,
	name: string,
	time: number
): Promise<Session> {
	const session = await Session.create({
		userId,
		name,
		time,
	});

	if (!session) {
		throw new Error("Failed to create session");
	}

	return session;
}

export async function getSession(id: string) {
	return await Session.findByPk(id);
}
