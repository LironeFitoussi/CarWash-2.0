import { Outlet } from "react-router-dom";

// Components
import Navbar from "@/components/Molecules/Navbar";
import { AuthSync } from "@/components/AuthSync";

export default function Layout() {

  return (
    <div className="min-h-screen">
      <AuthSync />
      <Navbar />
      <Outlet />
    </div>
  );
}
