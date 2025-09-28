"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignIn } from "../services/authService";
import SignInForm from "../components/forms/SignInForm";
import { validateSignIn } from "../utils/validation";
import { extractErrorMessage } from "../utils/errorHandler";
import toast from "react-hot-toast";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    const errorValidateMessage = validateSignIn(username, password);
    if (errorValidateMessage) {
      toast.error(errorValidateMessage);
      return;
    }

    try {
      setIsLoading(true);

      const response = await SignIn(username, password);
      if (response.success) {
        // เก็บ token
        localStorage.setItem("token", response.data.token);
        console.log(response.data.token);

        toast.success(`เข้าใช้งานด้วย ${username} สำเร็จ`);
        router.push("/admin/dashboard");
      } else {
        toast.error(response.message || "เข้าสู่ระบบไม่สำเร็จ");
      }
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignInForm
      username={username}
      password={password}
      setUsername={setUsername}
      setPassword={setPassword}
      handleSignIn={handleSignIn}
      isLoading={isLoading}
    />
  );
}
