import { Outlet } from "react-router-dom";
import { Toaster } from 'sonner';

// Components
import Navbar from "@/components/Molecules/Navbar";
import { AuthSync } from "@/components/AuthSync";

export default function Layout() {

  return (
    <div className="min-h-screen">
      <AuthSync />
      <Navbar />
      <Outlet />
      <Toaster />
    </div>
  );
}
