import { useEffect, useState, useRef } from "react";
import HALO from "vanta/dist/vanta.halo.min";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";

const Home = () => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        HALO({
          el: vantaRef.current,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div ref={vantaRef} className="h-screen w-screen">
      <div className="z-50">
        <Navbar />
      </div>
      <div className="fixed inset-0 bg-black/20 z-10"></div>
      <div className="flex flex-col items-center px-12 pt-12 justify-between z-50">
        <img
          src="/lumina_logo.svg"
          alt="Lumina logo"
          className="w-1/6 h-1/6"
        ></img>
        <h1 className="text-8xl font-bold text-white pt-4">LUMINA</h1>
        <p className="text-white text-4xl w-1/3 text-center">
          Your free - Open Source AI solution
        </p>
        <div className="flex items-center justify-between pt-8 w-2/7">
          <Button className="bg-black text-white cursor-pointer rounded-full p-5.5 hover:text-black hover:bg-white transition-all duration-300 w-44">
            Learn More
          </Button>
          <Button className="bg-transparent text-white border-2 border-black cursor-pointer rounded-full p-5 hover:text-black hover:bg-white hover:border-white transition-all duration-300 w-44">
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
