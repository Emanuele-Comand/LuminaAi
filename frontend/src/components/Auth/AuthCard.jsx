import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";

const AuthCard = () => {
  const [isSignUp, setSignUp] = useState(false);

  return isSignUp ? (
    <div className="flex flex-col items-center justify-center text-white bg-white/20 rounded-lg p-8 w-full max-w-md mx-4">
      <h1 className="text-4xl font-bold pb-8">Login</h1>
      <Input type="email" placeholder="Email" className="mb-4" />
      <Input type="password" placeholder="Password" className="mb-4" />
      <Button className="bg-white text-black w-full cursor-pointer">
        Sign Up
      </Button>

      <div className="flex flex-col items-center justify-center w-full">
        <span className="text-white pt-4">Or</span>
        <div className="g-signin2" data-onsuccess="onSignIn"></div>
        <div className="flex flex-col items-center justify-center mt-4 w-full">
          <button className="bg-white text-black mb-4 rounded-full p-3 flex items-center justify-center cursor-pointer w-full hover:bg-white/80">
            <img src="../google.png" alt="Google" className="w-4 h-4 mr-2" />
            Sign Up with Google
          </button>
          <button className="bg-white text-black mb-4 rounded-full p-3 flex items-center justify-center cursor-pointer w-full hover:bg-white/80">
            <img
              src="../microsoft.png"
              alt="Microsoft"
              className="w-4 h-4 mr-2"
            />
            Sign Up with Microsoft
          </button>
          <button className="bg-white text-black mb-4 rounded-full p-3 flex items-center justify-center cursor-pointer w-full hover:bg-white/80">
            <img src="../apple.png" alt="Apple" className="w-4 h-4 mr-2" />
            Sign Up with Apple
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center text-white bg-white/20 rounded-lg p-8 w-full max-w-md mx-4">
      <h1 className="text-4xl font-bold pb-8">Login</h1>
      <Input type="email" placeholder="Email" className="mb-4" />
      <Input type="password" placeholder="Password" className="mb-4" />
      <Button className="bg-white text-black w-full cursor-pointer">
        Login
      </Button>

      <div className="flex flex-col items-center justify-center w-full">
        <span className="text-white pt-4">Or</span>
        <div className="g-signin2" data-onsuccess="onSignIn"></div>
        <div className="flex flex-col items-center justify-center mt-4 w-full">
          <button className="bg-white text-black mb-4 rounded-full p-3 flex items-center justify-center cursor-pointer w-full hover:bg-white/80">
            <img src="../google.png" alt="Google" className="w-4 h-4 mr-2" />
            Login with Google
          </button>
          <button className="bg-white text-black mb-4 rounded-full p-3 flex items-center justify-center cursor-pointer w-full hover:bg-white/80">
            <img
              src="../microsoft.png"
              alt="Microsoft"
              className="w-4 h-4 mr-2"
            />
            Login with Microsoft
          </button>
          <button className="bg-white text-black mb-4 rounded-full p-3 flex items-center justify-center cursor-pointer w-full hover:bg-white/80">
            <img src="../apple.png" alt="Apple" className="w-4 h-4 mr-2" />
            Login with Apple
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
