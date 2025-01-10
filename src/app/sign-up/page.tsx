"use client";
import React, { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
} from "firebase/auth";
import GoogleIcon from "@mui/icons-material/Google";
import Link from "next/link";
import { useAuth } from "../firebase/AuthContext";
import { auth } from "../firebase/config";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Chip, Divider } from "@mui/material";
import { toast } from "react-toastify";
import Loader from "../Component/Loader";

const Provider = new GoogleAuthProvider();
const gitHubProvider = new GithubAuthProvider();

const Page = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { authUser, isLoading, setAuthUser } = useAuth();

  useEffect(() => {
    // Check if user is logged in and navigate to home if so
    if (!isLoading && authUser) {
      router.push("/");
    }
  }, [authUser, isLoading, router]);

  const signupHandler = async () => {
    if (!email || !password || !username) return;
    try {
      // Create user with email and password
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(auth.currentUser, {
        displayName: username,
      });
      if (auth.currentUser) {
        setAuthUser({
          uid: user.uid,
          email: user.email,
          username: username,
        });
        toast(`${username} is registered successfully`);
      }
    } catch (error) {
      console.error("An error occurred during sign up:", error);
      toast(error.message || "somthing went wrong");
    }
  };
  const signInWithGitHub = async () => {
    try {
      const { user } = await signInWithPopup(auth, gitHubProvider);
      console.log(user);
      toast(`${user.displayName} logged in successfully`);
    } catch (error: any) {
      console.error("An error occurred during Google sign-in:", error.message);
      toast(error.message || "somthing went wrong");
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, Provider);
      const user = result.user;
      console.log("Google sign-in successful:", user);
      setAuthUser({
        uid: user.uid,
        email: user.email,
        username: user.displayName || "No username",
      });
      toast(`${user.displayName} registered successfully`);
    } catch (error) {
      console.error("An error occurred during Google sign-in:", error);
      toast(error.message || "somthing went wrong");
    }
  };
  if (isLoading) return <Loader />;
  return (
    <main className="flex w-full h-screen">
      <div className="w-full lg:w-[50%] p-8  flex items-center justify-center lg:justify-start">
        <div className=" w-[85%] mx-auto ">
          <h1 className="text-4xl font-semibold">Welcome to my page</h1>
          <p className="mt-6 ml-1">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="underline text-blue-500 hover:text-blue-800 cursor-pointer"
            >
              Login
            </Link>
          </p>

          <div
            className="bg-red-800/[0.4] text-white w-full py-3 mt-6 rounded-full transition-all hover:bg-red-800/[0.8] active:scale-90 flex justify-center items-center gap-4 duration-700 cursor-pointer group"
            onClick={signInWithGoogle}
          >
            <GoogleIcon />
            <span className="font-semibold text-black/75 group-hover:text-white duration-700">
              Login with Google
            </span>
          </div>
          <Divider sx={{ marginBlock: 4 }}>
            <Chip label="OR" size="medium" />
          </Divider>
          <div
            className="bg-red-800/[0.4] text-white w-full py-3 mt-6 rounded-full transition-all hover:bg-red-800/[0.8] active:scale-90 flex justify-center items-center gap-4 duration-700 cursor-pointer group"
            onClick={signInWithGitHub}
          >
            <GoogleIcon />
            <span className="font-semibold text-black/75 group-hover:text-white duration-700">
              Login with GitHub
            </span>
          </div>
          <Divider sx={{ marginBlock: 4 }}>
            <Chip label="OR" size="medium" />
          </Divider>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-4"
          >
            <div className="pl-1 flex flex-col">
              <label>Name</label>
              <input
                type="text"
                placeholder="username"
                className="font-medium border-b border-black p-2 outline-0 focus-within:border-blue-400"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className=" flex flex-col">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="enter email"
                className="font-medium border-b border-black p-2 outline-0 focus-within:border-blue-400"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className=" flex flex-col">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="password"
                className="font-medium border-b border-black p-2 outline-0 focus-within:border-blue-400"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              className="bg-black text-white w-44 py-4 rounded-md uppercase transition-transform hover:bg-black/[0.8] active:scale-90"
              onClick={signupHandler}
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
      <div className="w-[50%] h-full hidden md:flex">
        <Image
          alt="login baner"
          width={150}
          height={150}
          className="w-full h-screen"
          src="/login-banner.jpg"
        />
      </div>
    </main>
  );
};

export default Page;
