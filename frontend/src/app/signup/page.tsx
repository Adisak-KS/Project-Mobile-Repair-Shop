"use client";

import { useState } from "react";
import {
  showAlertError,
  showAlertSuccess,
  showAlertWarning,
} from "../utils/sweetAlert";
import { SignUp } from "../services/authService";
import { useRouter } from "next/navigation";
import SignUpForm from "../components/forms/SignUpForm";
import { validateSignUp } from "../utils/validation";

export default function Page() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    const errorValidateMessage = validateSignUp(
      firstName,
      lastName,
      username,
      password,
      confirmPassword
    );

    if (errorValidateMessage) {
      showAlertWarning(errorValidateMessage);
      return;
    }

    try {
      setIsLoading(true);
      const response = await SignUp(
        firstName,
        lastName,
        username,
        password,
        confirmPassword
      );

      if (response.status === 201) {
        // console.log("สมัครสมาชิกสำเร็จ", response.data);
        showAlertSuccess("สมัครสมาชิกสำเร็จ");
        router.push("/signin");
      } else {
        showAlertError("สมัครสมาชิกไม่สำเร็จ");
      }
    } catch (error: any) {
      showAlertError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignUpForm
      firstName={firstName}
      setFirstName={setFirstName}
      lastName={lastName}
      setLastName={setLastName}
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      isLoading={isLoading}
      handleSignUp={handleSignUp}
    />
  );
}
