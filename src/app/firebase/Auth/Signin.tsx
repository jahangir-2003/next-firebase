import {
  signInWithEmailAndPassword,
  getAuth,
  UserCredential,
} from "firebase/auth";
import { firebase_app } from "../config";

// Define the return type of the function
interface SignInResult {
  result: UserCredential | null;
  error: Error | null;
}

const auth = getAuth(firebase_app);

// Type the function parameters and return value
export default async function signIn(
  email: string,
  password: string
): Promise<SignInResult> {
  let result: UserCredential | null = null;
  let error: Error | null = null;

  try {
    result = await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    error = e as Error;
  }

  return { result, error };
}
