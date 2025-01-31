export const formatFirebaseAuthError = (error: any): string => {
  // Get the Firebase error code
  const errorCode = error?.code || "";

  switch (errorCode) {
    case "auth/invalid-verification-code":
      return "Invalid OTP code. Please check and try again";

    case "auth/code-expired":
      return "OTP code has expired. Please request a new one";

    case "auth/invalid-verification-id":
      return "Invalid verification session. Please request a new code";

    case "auth/missing-verification-code":
      return "Please enter the verification code";

    case "auth/too-many-requests":
      return "Too many attempts. Please try again later";

    default:
      // If no specific error code matches, check message
      if (error?.message?.includes("Firebase")) {
        return "Verification failed. Please try again";
      }
      return error?.message || "Something went wrong. Please try again";
  }
};
