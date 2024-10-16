import { AuthResponse } from "@/types/auth";
import { JwtType } from "@/types/jwt";
import { generateToken } from "@utils/jwt";
import { User } from "src/db/models/user.model";

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
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

  const access: string = generateToken(user.id, JwtType.Access);
  const refresh: string = generateToken(user.id, JwtType.Refresh);
  const tokens = { access, refresh };

  return { user, tokens };
}

export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const user = new User({ username, email, password });
  await user.save();
  if (!user) {
    throw new Error("Failed to create user, username or email already taken!");
  }

  const access = generateToken(user.id, JwtType.Access);
  const refresh = generateToken(user.id, JwtType.Refresh);
  const tokens = { access, refresh };

  return { user, tokens };
}
