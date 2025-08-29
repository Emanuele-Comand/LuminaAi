import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useState } from "react";

const AuthCard = ({ isLogin }) => {
  const navigate = useNavigate();
  const { login, signup, isLoading, error, clearError } = useAuthStore();

  console.log("AuthCard - isLogin", isLogin);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate("/chat");
      }
    } else {
      const result = await signup(
        formData.email,
        formData.password,
        formData.name
      );
      if (result.success) {
        navigate("/chat");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-white bg-white/20 rounded-lg p-8 w-full max-w-md mx-4">
      <h1 className="text-4xl font-bold pb-8">
        {isLogin ? "Login" : "Sign up"}
      </h1>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded mb-4 w-full">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full">
        {!isLogin && (
          <Input
            type="text"
            name="name"
            placeholder="Username"
            className="mb-4"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        )}
        <Input
          type="email"
          name="email"
          placeholder="Email"
          className="mb-4"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          className="mb-4"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <Button
          type="submit"
          className="bg-white text-black w-full cursor-pointer"
          disabled={isLoading}
        >
          {isLoading
            ? isLogin
              ? "Logging in..."
              : "Signing up..."
            : isLogin
            ? "Login"
            : "Sign up"}
        </Button>
      </form>
      <div className="flex flex-col items-center justify-center w-full">
        <span className="text-white pt-4">Or</span>
        <div className="g-signin2" data-onsuccess="onSignIn"></div>
        <div className="flex flex-col items-center justify-center mt-4 w-full">
          <button className="bg-white text-black mb-4 rounded-full p-3 flex items-center justify-center cursor-pointer w-full hover:bg-white/80">
            <img src="../google.png" alt="Google" className="w-4 h-4 mr-2" />
            {isLogin ? "Login with Google" : "Sign up with Google"}
          </button>
          <button className="bg-white text-black mb-4 rounded-full p-3 flex items-center justify-center cursor-pointer w-full hover:bg-white/80">
            <img
              src="../microsoft.png"
              alt="Microsoft"
              className="w-4 h-4 mr-2"
            />
            {isLogin ? "Login with Microsoft" : "Sign up with Microsoft"}
          </button>
          <button className="bg-white text-black mb-4 rounded-full p-3 flex items-center justify-center cursor-pointer w-full hover:bg-white/80">
            <img src="../apple.png" alt="Apple" className="w-4 h-4 mr-2" />
            {isLogin ? "Login with Apple" : "Sign up with Apple"}
          </button>
        </div>
      </div>
      {isLogin && (
        <Link
          to="/*"
          className="relative transition-all duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full text-blue-500 mt-4"
        >
          Forgot Password?
        </Link>
      )}
      <Link
        to="/"
        className="bg-white text-black w-full cursor-pointer mt-8 block text-center py-2 rounded-md"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default AuthCard;
