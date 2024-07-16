import CharacterPreview from "../components/ui/create-character/CharacterPreview";
import ToolsBar from "../components/ui/create-character/ToolsBar";
import { CreateCharacterProvider } from "../contexts/CreateCharacterContext";

const CreateCharacter = () => {
  return (
    <CreateCharacterProvider>
      <div className="flex-grow flex w-full h-screen py-10 bg-gradient-to-r from-cyan-500 to-blue-500">
        <div
          className="max-w-5xl xl:max-w-6xl w-full h-full flex-grow border-4 border-transparent
      m-auto grid grid-cols-3 rounded-3xl pl-4 pr-0 py-7 gap-x-6 bg-black/50"
        >
          <div className="col-span-1 flex border rounded-xl bg-white/10">
            <CharacterPreview />
          </div>
          <div className="col-span-2">
            <ToolsBar />
            <button className="bg-cyan-400/50 p-4 rounded-xl border text-xl font-bold absolute right-[21%] bottom-16 text-cyan-100">Create Character</button>
          </div>
        </div>
      </div>
    </CreateCharacterProvider>
  );
};
export default CreateCharacter;
