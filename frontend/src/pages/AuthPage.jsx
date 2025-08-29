import AuthCard from "../components/Auth/AuthCard";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/authStore";

const AuthPage = ({ isLogin }) => {
  const { authMode } = useAuthStore();

  console.log("authMode", authMode);
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen bg-black">
        <AuthCard isLogin={authMode === "login"} />
      </div>
    </div>
  );
};

export default AuthPage;
