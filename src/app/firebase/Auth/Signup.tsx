import {
  createUserWithEmailAndPassword,
  getAuth,
  UserCredential,
} from "firebase/auth";
import { firebase_app } from "../config";

// Define the return type of the function
interface SignUpResult {
  result: UserCredential | null;
  error: Error | null;
}

const auth = getAuth(firebase_app);

export default async function signUp(
  email: string,
  password: string
): Promise<SignUpResult> {
  let result: UserCredential | null = null;
  let error: Error | null = null;

  try {
    result = await createUserWithEmailAndPassword(auth, email, password);
  } catch (e) {
    error = e as Error;
  }

  return { result, error };
}
