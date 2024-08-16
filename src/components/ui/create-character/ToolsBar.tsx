import React, { useContext, useState } from "react";
import { IoBodySharp } from "react-icons/io5";
import { MdFace } from "react-icons/md";
import { FaTshirt } from "react-icons/fa";
import { PiPantsFill, PiBootFill } from "react-icons/pi";
import { BsBackpack2Fill } from "react-icons/bs";
import { CreateCharacterContext } from "../../../contexts/CreateCharacterContext";
import Head from "../../create-character/Head";
import HeadOrange from "../../../assets/orange-variant/Head.svg";
import HeadRed from "../../../assets/red-variant/Head.svg";
import OrangeBody from "../../../assets/orange-variant/Body.svg";
import RedBody from "../../../assets/red-variant/Body.svg";
import HeadPreview from "../../create-character/HeadPreview";
import BodyPreview from "../../create-character/BodyPreview";

export interface Choice {
  id: number;
  name: string;
  image: string;
}

interface Tool {
  index: number;
  name: string;
  icon?: React.ElementType | string;
  choices: Choice[];
}

const tools: Tool[] = [
  {
    index: 1,
    name: "สีผิว",
    icon: IoBodySharp,
    choices: [
      {
        id: 1,
        name: "สีผิว 1",
        image:
          "https://emojiisland.com/cdn/shop/products/Neutral_Face_Emoji_large.png?v=1571606037",
      },
      {
        id: 2,
        name: "สีผิว 2",
        image:
          "https://emojiisland.com/cdn/shop/products/Neutral_Face_Emoji_large.png?v=1571606037",
      },
      // Add more choices as needed
    ],
  },
  {
    index: 2,
    name: "หน้าตา",
    icon: MdFace,
    choices: [
      {
        id: 1,
        name: "หน้าตา 1",
        image:
          "https://emojiisland.com/cdn/shop/products/Neutral_Face_Emoji_large.png?v=1571606037",
      },
      {
        id: 2,
        name: "หน้าตา 2",
        image:
          "https://emojiisland.com/cdn/shop/products/Neutral_Face_Emoji_large.png?v=1571606037",
      },
      // Add more choices as needed
    ],
  },
  {
    index: 3,
    name: "เสื้อ",
    icon: FaTshirt,
    choices: [
      {
        id: 1,
        name: "เสื้อ 1",
        image:
          "https://emojiisland.com/cdn/shop/products/Neutral_Face_Emoji_large.png?v=1571606037",
      },
      {
        id: 2,
        name: "เสื้อ 2",
        image:
          "https://emojiisland.com/cdn/shop/products/Neutral_Face_Emoji_large.png?v=1571606037",
      },
      // Add more choices as needed
    ],
  },
  {
    index: 4,
    name: "กางเกง",
    icon: PiPantsFill,
    choices: [
      {
        id: 1,
        name: "กางเกง 1",
        image:
          "https://emojiisland.com/cdn/shop/products/Neutral_Face_Emoji_large.png?v=1571606037",
      },
      {
        id: 2,
        name: "กางเกง 2",
        image:
          "https://emojiisland.com/cdn/shop/products/Neutral_Face_Emoji_large.png?v=1571606037",
      },
      // Add more choices as needed
    ],
  },
  {
    index: 5,
    name: "รองเท้า",
    icon: PiBootFill,
    choices: [
      {
        id: 1,
        name: "รองเท้า 1",
        image:
          "https://emojiisland.com/cdn/shop/products/Neutral_Face_Emoji_large.png?v=1571606037",
      },
      {
        id: 2,
        name: "รองเท้า 2",
        image:
          "https://emojiisland.com/cdn/shop/products/Neutral_Face_Emoji_large.png?v=1571606037",
      },
      // Add more choices as needed
    ],
  },
];

const ToolsBar: React.FC = () => {
  const [currentTool, setCurrentTool] = useState<Tool>(tools[0]);
  const [currentChoices, setCurrentChoices] = useState<{
    [key: string]: Choice;
  }>({});
  const { setCharacter, setChoices } = useContext(CreateCharacterContext);

  const changeTool = (tool: Tool) => setCurrentTool(tool);

  const chooseChoice = (choice: Choice) => {
    setCurrentChoices((prevChoices) => ({
      ...prevChoices,
      [currentTool.name]: choice,
    }));

    const newCharacter: any = {
      ...currentChoices,
      [currentTool.name]: choice,
    };

    setCharacter(newCharacter);
  };

  const colorList = [
    "#CE8E71",
    "#DFA98F",
    "#E9C8BC",
    "#F6CDAA",
    "#D69D70",
    "#B37344",
    "#88583B",
  ];

  return (
    <div className="w-full">
      <div className="w-full flex gap-x-4 overflow-x-scroll scrollbar-hide">
        {tools.map((tool) => (
          <button
            key={tool.index}
            onClick={() => changeTool(tool)}
            className={`${
              currentTool.index === tool.index
                ? "bg-cyan-400 text-slate-600"
                : "bg-white/15 text-white/40 hover:bg-white/30 hover:text-white/60"
            } px-4 py-3 rounded-xl transition-all ease-linear duration-100 flex items-center gap-x-2`}
          >
            {tool.icon && <tool.icon className="text-xl my-auto" />}
            <span>{tool.name}</span>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-4 mt-6 gap-4 pr-6">
        {currentTool.name === "สีผิว" &&
          colorList.map((color, index) => (
            <button
              key={color}
              onClick={() => chooseChoice({ id: 0, name: color, image: "" })}
              className={`col-span-1 w-full h-full border-4 rounded-lg ${
                currentChoices[currentTool.name]?.name === color
                  ? "border-cyan-200 bg-white/40"
                  : "border-white/20 bg-white/20"
              } px-6 pt-4 pb-2 relative transition-all ease-linear duration-100`}
            >
              <div
                className="w-20 h-20 rounded-full mx-auto"
                style={{ backgroundColor: color }}
              ></div>
              <p className="mt-3 text-white">สีผิวที่ {index + 1}</p>
            </button>
          ))}

        {currentTool.name === "หน้าตา" && (
          <>
            <button
              onClick={() => {
                setChoices((prevChoices) => ({
                  ...prevChoices,
                  head: 1,
                }));
              }}
              className={`col-span-1 w-full h-full border-4 rounded-lg px-6 pt-4 pb-2 relative transition-all ease-linear duration-100`}
            >
              <div className="w-20 h-20 rounded-full mx-auto">
                <HeadPreview choice={1} />
              </div>
              <p className="mt-3 text-white">หน้าตาที่ 1</p>
            </button>
            <button
              onClick={() => {
                setChoices((prevChoices) => ({
                  ...prevChoices,
                  head: 2,
                }));
              }}
              className={`col-span-1 w-full h-full border-4 rounded-lg px-6 pt-4 pb-2 relative transition-all ease-linear duration-100
                 overflow-hidden`}
            >
              <div className="w-20 h-20 rounded-full mx-auto relative">
                <img src={HeadOrange} className="absolute -top-10" />
              </div>
              <p className="mt-3 text-white">หน้าตาที่ 2</p>
            </button>
            <button
              onClick={() => {
                setChoices((prevChoices) => ({
                  ...prevChoices,
                  head: 3,
                }));
              }}
              className={`col-span-1 w-full h-full border-4 rounded-lg px-6 pt-4 pb-2 relative transition-all ease-linear duration-100`}
            >
              <div className="w-20 h-20 rounded-full mx-auto">
                <img src={HeadRed} />
              </div>
              <p className="mt-3 text-white">หน้าตาที่ 3</p>
            </button>
          </>
        )}

        {currentTool.name === "เสื้อ" && (
          <>
            <button
              onClick={() => {
                setChoices((prevChoices) => ({
                  ...prevChoices,
                  body: 1,
                }));
              }}
              className={`col-span-1 w-full h-full border-4 rounded-lg px-6 pt-4 pb-2 relative transition-all ease-linear duration-100`}
            >
              <div className="w-20 h-32 rounded-full mx-auto">
                <BodyPreview choice={1} />
              </div>
              <p className="mt-3 text-white">เสื้อที่ 1</p>
            </button>
            <button
              onClick={() => {
                setChoices((prevChoices) => ({
                  ...prevChoices,
                  body: 2,
                }));
              }}
              className={`col-span-1 w-full h-full border-4 rounded-lg px-6 pt-4 pb-2 relative transition-all ease-linear duration-100
                 overflow-hidden`}
            >
              <div className="w-20 h-20 rounded-full mx-auto relative">
                <img src={OrangeBody} className="" />
              </div>
              <p className="mt-16 text-white">เสื้อที่ 2</p>
            </button>
            <button
              onClick={() => {
                setChoices((prevChoices) => ({
                  ...prevChoices,
                  body: 3,
                }));
              }}
              className={`col-span-1 w-full h-full border-4 rounded-lg px-6 pt-4 pb-2 relative transition-all ease-linear duration-100`}
            >
              <div className="w-20 h-20 rounded-full mx-auto relative">
                <img src={RedBody} className="" />
              </div>
              <p className="mt-16 text-white">เสื้อที่ 3</p>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ToolsBar;
