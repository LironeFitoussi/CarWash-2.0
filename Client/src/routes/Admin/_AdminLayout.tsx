import AdminNavbar from "@/components/Molecules/AdminNavbar";
import { Outlet } from "react-router-dom";
import { Toaster } from 'sonner';

export default function AdminLayout() {
  return (
    <>
      <AdminNavbar />
      <Outlet />
      <Toaster />
    </>
  );
}