"use client";

import Link from "next/link";

interface SignUpFormProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  handleSignUp: () => void;
  isLoading: boolean;
}

export default function SignUpForm({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  username,
  setUsername,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  handleSignUp,
  isLoading,
}: SignUpFormProps) {
  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="w-full">
          <h1 className="text-2xl font-bold text-center">Sign Up</h1>
        </div>

        <label htmlFor="First Name">First Name</label>
        <input
          type="text"
          maxLength={50}
          placeholder="Enter your First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <label htmlFor="Last Name" className="title mt-3">
          Last Name
        </label>
        <input
          type="text"
          maxLength={50}
          placeholder="Enter your Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <label htmlFor="Username" className="title mt-3">
          Username
        </label>
        <input
          type="text"
          maxLength={30}
          placeholder="Enter your Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="Password" className="title mt-3">
          Password
        </label>
        <input
          maxLength={255}
          placeholder="Enter Your Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="Confirm Password" className="title mt-3">
          Confirm Password
        </label>
        <input
          type="password"
          placeholder="Enter Your Password Again"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button onClick={handleSignUp} disabled={isLoading}>
          {isLoading ? "Signing Up..." : "Sign Up"}
          <i className="fa-solid fa-arrow-right-to-bracket"></i>
        </button>

        <p className="mt-2 flex justify-center">
          You have account?
          <Link
            href="/signin"
            className="ms-2 text-blue-700 hover:text-blue-800"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
