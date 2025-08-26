import { createBrowserRouter } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import LuminaChat from "./pages/LuminaChat";
import Home from "./pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/chat",
    element: <LuminaChat />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
]);

export default router;
