import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Navbar = () => {
  const { setAuthMode, authMode } = useAuthStore();

  console.log("Navbar authMode", authMode);

  return (
    <div className="flex justify-between items-center p-4 bg-white/20 px-24">
      <div className="flex items-center gap-8">
        <img src="/lumina_logo.svg" alt="Lumina logo"></img>
        <div className="flex items-center gap-4 text-white">
          <a
            href="/"
            className="relative transition-all duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
          >
            About
          </a>
          <a
            href="/"
            className="relative transition-all duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
          >
            Docs
          </a>
          <a
            href="/"
            className="relative transition-all duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
          >
            Open Source
          </a>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/auth" onClick={() => setAuthMode("login")}>
          <Button className="bg-black text-white cursor-pointer rounded-full p-5 hover:text-black hover:bg-white transition-all duration-300">
            Login
          </Button>
        </Link>
        <Link to="/auth" onClick={() => setAuthMode("signup")}>
          <Button className="bg-transparent text-white border-2 border-black cursor-pointer rounded-full p-5 hover:text-black hover:bg-white hover:border-white transition-all duration-300">
            Sign up
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
