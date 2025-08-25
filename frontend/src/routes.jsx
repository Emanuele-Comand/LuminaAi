import { createBrowserRouter } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import LuminaChat from "./pages/LuminaChat";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LuminaChat />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
]);

export default router;
