"use client";
import React from "react";
import { useRouter } from "next/navigation";
import signUp from "./firebase/Auth/Signup";

function Page() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();

  const handleForm = async (event) => {
    event.preventDefault();

    const { result, error } = await signUp(email, password);

    if (error) {
      return console.log(error);
    }

    console.log(result);
  };
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-[500px] border-2 mx-auto">
        <h1 className="mt-60 mb-30">Sign up</h1>
        <form onSubmit={handleForm} className="flex flex-col">
          <label htmlFor="email">
            <p>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              name="email"
              id="email"
              placeholder="example@mail.com"
            />
          </label>
          <label htmlFor="password">
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              name="password"
              id="password"
              placeholder="password"
            />
          </label>
          <button type="submit">Sign up</button>
        </form>
      </div>
    </div>
  );
}

export default Page;
