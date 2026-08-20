<button onClick={() => navigate("/guest-login")}>
  Continue as Guest
</button>

const isGuest = localStorage.getItem("isGuest");

if (isGuest === "true") {
  console.log("User is logged in as Guest");
}
