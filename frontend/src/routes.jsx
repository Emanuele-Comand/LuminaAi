import { createBrowserRouter } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import LuminaChat from "./pages/LuminaChat";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/chat",
    element: (
      <ProtectedRoute>
        <LuminaChat />
      </ProtectedRoute>
    ),
  },
]);

export default router;
