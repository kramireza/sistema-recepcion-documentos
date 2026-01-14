import { Routes, Route } from "react-router-dom";
import VerifyPage from "./pages/VerifyPage";
import FormPage from "./pages/FormPage";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import AdminRoute from "./components/AdminRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<VerifyPage />} />
      <Route path="/form" element={<FormPage />} />
      <Route path="/admin" element={<AdminLogin />} />

      <Route
        path="/admin/panel"
        element={
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        }
      />
    </Routes>
  );
}
