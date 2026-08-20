import { BrowserRouter, Routes, Route } from "react-router-dom";

import GuestLogin from "./pages/GuestLogin";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/guest-login" element={<GuestLogin />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
