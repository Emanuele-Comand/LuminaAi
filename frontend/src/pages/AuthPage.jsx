import AuthCard from "../components/Auth/AuthCard";
import Navbar from "../components/Navbar";

const AuthPage = ({ isLogin }) => {
  console.log("isLogin value AuthPage", isLogin);
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen bg-black">
        <AuthCard isLogin={isLogin} />
      </div>
    </div>
  );
};

export default AuthPage;
