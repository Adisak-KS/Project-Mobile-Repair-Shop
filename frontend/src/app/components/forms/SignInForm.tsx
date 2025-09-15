"use client";

import Link from "next/link";

interface SignInFormProps {
  username: string;
  password: string;
  setUsername: (value: string) => void;
  setPassword: (value: string) => void;
  handleSignIn: () => void;
  isLoading: boolean;
}

export default function SignInForm({
  username,
  password,
  setUsername,
  setPassword,
  handleSignIn,
  isLoading,
}: SignInFormProps) {
  return (
    <div className="signin-container">
      <div className="signin-box">
        <div className="w-full">
          <h1 className="text-2xl font-bold text-center">Sign In</h1>
        </div>

        <label className="title">Username :</label>
        <input
          type="text"
          maxLength={30}
          placeholder="Enter your Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="mt-3">Password :</label>
        <input
          type="password"
          maxLength={30}
          placeholder="Enter your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSignIn} disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
          <i className="fa-solid fa-arrow-right-to-bracket"></i>
        </button>

        <p className="mt-2 flex justify-center">
          No have an account?
          <Link
            href="/signup"
            className="ms-2 text-blue-700 hover:text-blue-800"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
