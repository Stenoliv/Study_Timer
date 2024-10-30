import { generateToken } from "@utils/jwt";
import { User } from "@models/user.model";

export async function loginUser(
	email: string,
	password: string
): Promise<{ user: User; token: string }> {
	// Search user by email
	const user = await User.findOne({ where: { email } });
	if (!user) {
		throw new Error("User not found");
	}

	// Check if password is valid
	const isPasswordValid = await user.validatePassword(password);
	if (!isPasswordValid) {
		throw new Error("Invalid password");
	}

	const token = generateToken(user.id);

	return { user, token };
}

export async function registerUser(
	username: string,
	email: string,
	password: string
) {
	const user = await User.create({ username, email, password });
	if (!user) {
		throw new Error("Failed to create user, username or email already taken!");
	}

	const token = generateToken(user.id);

	return token;
}
