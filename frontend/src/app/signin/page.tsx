"use client";
import { useState } from "react";
import { SignIn } from "../services/authService";
import SignInForm from "../components/forms/SignInForm";
import { validateSignIn } from "../utils/validation";
import {
  showAlertError,
  showAlertSuccess,
  showAlertWarning,
} from "../utils/sweetAlert";
import { setAccessToken, setRefreshToken } from "../services/tokenService";
import { useRouter } from "next/navigation";

export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    const errorValidateMessage = validateSignIn(username, password);
    if (errorValidateMessage) {
      showAlertWarning(errorValidateMessage);
      return;
    }

    try {
      setIsLoading(true);

      const response = await SignIn(username, password);
      if (
        response.data.success === true &&
        response.data.accessToken &&
        response.data.refreshToken
      ) {
        setAccessToken(response.data.accessToken);
        setRefreshToken(response.data.refreshToken);
        showAlertSuccess(`เข้าใช้งานด้วย ${username} สำเร็จ`);
        router.push("/backoffice/dashboard");
      } else {
        showAlertError("เข้าสู่ระบบไม่สำเร็จ");
      }
    } catch (error: any) {
      showAlertError(error?.response?.data?.message || error.message);
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
