"use client";
import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
} from "firebase/auth";
import Link from "next/link";
import { auth } from "../firebase/config";
import { useAuth } from "../firebase/AuthContext";
import GoogleIcon from "@mui/icons-material/Google";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Chip, Divider } from "@mui/material";
import { toast } from "react-toastify";
import Loader from "../Component/Loader";
import { GitHub } from "@mui/icons-material";

const Provider = new GoogleAuthProvider();
const gitHubProvider = new GithubAuthProvider();

const page: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const { authUser, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && authUser) {
      router.push("/");
    }
  }, [authUser, isLoading, router]);

  const loginHandler = async () => {
    if (!email || !password) return;
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      console.log(user);
      toast(`${user.displayName} logged in successfully`);
    } catch (error: any) {
      console.error("An error occurred during login:", error.message);
      toast(error.message || "somthing went wrong");
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { user } = await signInWithPopup(auth, Provider);
      console.log(user);
      toast(`${user.displayName} logged in successfully`);
    } catch (error: any) {
      console.error("An error occurred during Google sign-in:", error.message);
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

  if (isLoading) return <Loader />;
  return (
    <main className="flex h-screen">
      <div className="w-full md:w-[50%] flex items-center justify-center ">
        <div className="p-8 w-[85%] mx-auto">
          <h1 className="text-4xl font-semibold capitalize">welcome back</h1>
          <p className="mt-4 ml-1 flex flex-row gap-1">
            Don't have an account?
            <Link
              href="/sign-up"
              className="underline text-blue-500 hover:text-blue-800 cursor-pointer"
            >
              Sign Up
            </Link>
          </p>

          <div
            className="bg-red-800/[0.4] text-white w-full py-3 mt-8 rounded-full transition-all duration-700 hover:bg-red-800/[0.8] active:scale-90 flex justify-center items-center gap-3 cursor-pointer group"
            onClick={signInWithGoogle}
          >
            <GoogleIcon />
            <span className=" text-black font-semibold group-hover:text-white transition-all duration-700">
              Login with Google
            </span>
          </div>
          <Divider sx={{ marginBlock: 4 }}>
            <Chip label="OR" size="medium" />
          </Divider>
          <div
            className="bg-red-800/[0.4] text-white w-full py-3 mt-8 rounded-full transition-all duration-700 hover:bg-red-800/[0.8] active:scale-90 flex justify-center items-center gap-3 cursor-pointer group"
            onClick={signInWithGitHub}
          >
            <GitHub />
            <span className=" text-black font-semibold group-hover:text-white transition-all duration-700">
              Login with gitHub
            </span>
          </div>
          <Divider sx={{ marginBlock: 4 }}>
            <Chip label="OR" size="medium" />
          </Divider>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className=" pl-1 flex flex-col">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                className="font-medium border-b border-black p-3 outline-0 focus-within:border-blue-400"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
              />
            </div>
            <div className="mt-10 pl-1 flex flex-col">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                className="font-medium border-b border-black p-3 outline-0 focus-within:border-blue-400"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
              />
            </div>
            <div className="flex flex-row justify-between items-center">
              <button
                className="bg-black text-white w-44 py-4 mt-10 rounded-md transition-all duration-700 hover:bg-black/[0.8] active:scale-90"
                onClick={loginHandler}
                disabled={isLoading} // Disable button while loading
              >
                Sign in
              </button>
              <Link href="/reset-password"> forgot password </Link>
            </div>
          </form>
        </div>
      </div>
      <div className="w-[50%] hidden md:flex">
        <Image
          src="/login-banner.jpg"
          width={250}
          height={250}
          alt="login banner"
          className="w-full h-screen"
        />
      </div>
    </main>
  );
};

export default page;
