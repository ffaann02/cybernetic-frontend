import {
  MdOutlineCleaningServices,
  MdOutlineDashboardCustomize,
} from "react-icons/md";
import { SiSpeedtest } from "react-icons/si";

const Tools = () => {
  const toolLists = [
    {
      title: "Data Cleaning",
      description: "Clean your data to remove any inconsistencies or errors.",
      Icon: MdOutlineCleaningServices,
    },
    {
      title: "Model Evaluation Simulation",
      description:
        "Simulate the evaluation of your model to predict its performance.",
      Icon: SiSpeedtest,
    },
    {
      title: "Create Custom Data",
      description: "Create custom data to train your model with.",
      Icon: MdOutlineDashboardCustomize,
    },
  ];

  return (
    <div className="w-full px-10 py-10 h-fit">
      <div className="bg-black/40 px-6 py-4 rounded-xl border">
        <div className="text-center text-3xl text-white py-6 font-bold tracking-wider">
          Tools
        </div>
        <div className="mt-4">
          <div className="grid grid-cols-3 gap-4">
            {toolLists.map((tool) => (
              <div
                key={tool.title}
                className="bg-white/20 hover:bg-cyan-600/40 border p-4 rounded-lg flex flex-col gap-y-2 cursor-pointer"
              >
                <tool.Icon className="my-auto text-[7.5rem] text-blue-600 mx-auto mb-2" />
                <p className="text-white text-center font-semibold text-2xl">
                  {tool.title}
                </p>
                <p className="text-white text-center">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Tools;
