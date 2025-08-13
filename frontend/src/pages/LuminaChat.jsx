import LuminaSidebar from "../components/LuminaSidebar";
import LuminaHeader from "../components/LuminaHeader";
import { Input } from "../components/ui/input";
import { ScrollArea } from "../components/ui/scroll-area";

const LuminaChat = () => {
  return (
    <>
      <div className="flex items-end justify-center">
        <div>
          <LuminaSidebar />
        </div>
        <div className="flex flex-col w-full items-center">
          <div className="bg-white/20 backdrop-blur-2xl text-white w-full border border-t-0 border-l-0 border-r-0 p-2 pt-2.5">
            <LuminaHeader></LuminaHeader>
          </div>
          <div>
            <ScrollArea className="bg-white/20 backdrop-blur-2xl text-white w-[886px] h-[680px] rounded-md border p-4 mb-2 mt-4">
              ScrollArea
            </ScrollArea>
          </div>
          <div className="bg-white/20 backdrop-blur-2xl rounded-md w-3/4 mb-4">
            <Input
              className="text-white"
              placeholder="Enter your message here..."
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default LuminaChat;
