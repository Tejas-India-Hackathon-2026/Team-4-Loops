import React from "react";
import { useNavigate } from "react-router-dom";

function GuestLogin() {
  const navigate = useNavigate();

  const handleGuestLogin = () => {
    // Create guest session
    localStorage.setItem("isGuest", "true");

    // Go to home/dashboard
    navigate("/home");
  };

  return (
    <div className="guest-login">
      <h2>Welcome</h2>
      <p>Continue without creating an account</p>

      <button onClick={handleGuestLogin}>
        Continue as Guest
      </button>
    </div>
  );
}

export default GuestLogin;
