import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdAutoFixHigh, MdOutlineGridOn, MdSaveAlt } from "react-icons/md";

const CameraDataPanelUI = ({
  collectedList,
  setCollectedList,
  dataCollectNotify,
}) => {
  const [itemList, setItemList] = useState([
    {
      index: 1,
      imageType: "robot",
      name: "Robot01",
      description: "A voice recorder that can record audio.",
      image:
        "https://png.pngtree.com/thumb_back/fh260/background/20230408/pngtree-robot-white-with-green-cute-robot-fantasy-scene-image_2199816.jpg",
    },
    {
      index: 2,
      imageType: "robot",
      name: "Robot02",
      description: "A text note that can store text.",
      image:
        "https://t3.ftcdn.net/jpg/05/59/11/04/360_F_559110407_NfJFju7r6802upIi90zIs34xYjM8ZFHx.jpg",
    },
    {
      index: 3,
      imageType: "robot",
      name: "Robot03",
      description: "A robot that can dance.",
      image:
        "https://t4.ftcdn.net/jpg/05/11/82/47/360_F_511824793_S2mQ0JybJzJv7QhR4VGAwAakRkfxAnjx.jpg",
    },
    {
      index: 4,
      imageType: "robot",
      name: "Robot04",
      description: "A robot that can sing.",
      image:
        "https://t4.ftcdn.net/jpg/05/90/82/32/360_F_590823233_97YNah2bYsEW9llwf7UNK5L3r1cM0Ei3.jpg",
    },
    {
      index: 5,
      imageType: "robot",
      name: "Robot05",
      description: "A little robot that can draw.",
      image:
        "https://www.eurokidsindia.com/blog/wp-content/uploads/2023/08/robot-movies.jpg",
    },
    {
      index: 6,
      imageType: "robot",
      name: "Robot06",
      description: "A robot that can clean.",
      image:
        "https://t3.ftcdn.net/jpg/05/73/14/38/360_F_573143889_NVvKlj8AGINKQyT7Pr3tkvCScXShff0F.jpg",
    },
    {
      index: 7,
      imageType: "robot",
      name: "Robot07",
      description: "A robot that can play music.",
      image:
        "https://img.freepik.com/premium-photo/cute-gas-station-attendant-service-robot-waiting-customer-filling-car-fuel-innovative-technology-occupation-concept-generative-ai_10307-2950.jpg",
    },
    {
      index: 8,
      imageType: "robot",
      name: "Robot08",
      description: "A robot that can garden.",
      image:
        "https://img.freepik.com/premium-photo/cute-gas-station-attendant-service-robot-waiting-customer-filling-car-fuel-innovative-technology-occupation-concept-generative-ai_10307-2948.jpg",
    },
    {
      index: 9,
      imageType: "robot",
      name: "Robot09",
      description: "A robot that can paint.",
      image:
        "https://img.freepik.com/premium-photo/ai-powered-robotic-assistants-robots_964851-77287.jpg",
    },
    {
      index: 10,
      imageType: "robot",
      name: "Robot10",
      description: "A robot that can write.",
      image:
        "https://t4.ftcdn.net/jpg/06/59/79/83/360_F_659798364_bRekkrASYOTkaoAvFqy5tjNfjhc5EGDa.jpg",
    },
    {
      index: 11,
      imageType: "robot",
      name: "Robot11",
      description: "A robot that can draw.",
      image:
        "https://t3.ftcdn.net/jpg/06/13/90/24/360_F_613902473_FAH3VGE1Uf22ErGD20wPrvcS1VveJdM1.jpg",
    },
    {
      index: 12,
      imageType: "robot",
      name: "Robot12",
      description: "A robot that can read.",
      image:
        "https://img.freepik.com/premium-photo/chat-robot-ai-customer-support_237803-1361.jpg",
    },
    {
      index: 13,
      imageType: "robot",
      name: "Robot13",
      description: "A robot that can swim.",
      image:
        "https://t3.ftcdn.net/jpg/05/62/72/46/360_F_562724678_ViVALsLzUUOosQTStf6htDfZeBXii91h.jpg",
    },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isUsingGrid, setIsUsingGrid] = useState(false);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % itemList.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + itemList.length) % itemList.length);
  };

  const handleCollectItem = (index) => {
    if (!collectedList.includes(index)) {
      setCollectedList((prev) => [...prev, index]);
    }
  };

  return (
    <div
      className="absolute z-[500] w-full max-w-[50%] max-h-[70vh] rounded-3xl border-4 border-white/50 bg-black/50 flex items-center justify-center p-4"
      style={{ top: "45%", left: "50%", transform: "translate(-50%, -50%)" }}
    >
      <div className="w-full h-full mx-auto pt-6 pb-2">
        <div
          className="absolute w-28 h-20 rounded-t-2xl rounded-b-lg bg-black/40 -top-14 left-1/2 transform -translate-x-1/2
            border-4 border-white/40 p-2"
        >
          <div className="bg-red-600/50 w-full h-full rounded-xl px-2 py-1.5 flex">
            <div className="w-[2.75rem] h-full rounded-full bg-black/40 border border-slate-600 mx-auto"></div>
          </div>
        </div>
        <div className="w-full h-full grid grid-cols-6 gap-4 rounded-xl -mt-2">
          {!isUsingGrid ? (
            <div className="col-span-4 h-full border-[1rem] border-black/50 rounded-xl relative">
              <div className="w-full h-full rounded-xl bg-neutral-200 relative">
                <img
                  src={itemList[currentIndex].image}
                  className="w-full h-full object-cover rounded-xl"
                />
                {collectedList.includes(itemList[currentIndex].index) && (
                  <div className="absolute top-0 left-0 bg-green-500 text-white px-2 py-1 rounded-br-xl">
                    Collected
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="col-span-4 h-full border-[1rem] bg-white/50 border-black/50 rounded-xl relative">
              <div className="w-full grid grid-cols-5 p-2 gap-2 rounded-xl relative">
                {itemList.map((item, index) => (
                  <div
                    key={index}
                    className="w-full h-24 rounded-xl bg-neutral-200 relative"
                  >
                    <img
                      src={item.image}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    {collectedList.includes(item.index) && (
                      <div className="absolute top-0 left-0 bg-green-500 text-white px-2 py-1 rounded-br-xl">
                        Collected
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="col-span-2 bg-cyan-400/50 rounded-xl border-4 h-[99.5%] mt-0.5 p-4">
            <h4 className="text-slate-100 text-2xl font-semibold">
              Controller
            </h4>
            <div className="w-20 h-20 my-12 mx-auto relative">
              <FaChevronLeft
                className="absolute text-2xl text-black/60 -left-8 transform top-1/2 
                -translate-y-1/2 hover:text-cyan-400 cursor-pointer"
                onClick={handlePrevious}
              />
              <div className="absolute w-full h-full bg-black/50 border rounded-full"></div>
              <FaChevronRight
                className="absolute text-2xl text-black/60 -right-8 transform top-1/2 
                -translate-y-1/2  hover:text-cyan-400 cursor-pointer"
                onClick={handleNext}
              />
              <MdOutlineGridOn
                className="absolute text-2xl text-black/60 -top-8 transform left-1/2 
                -translate-x-1/2  hover:text-cyan-400 cursor-pointer"
                onClick={() => {
                  console.log("test");
                  setIsUsingGrid((prev) => !prev);
                }}
              />
              <MdAutoFixHigh
                className="absolute text-2xl text-black/60 -bottom-8 transform left-1/2 
                -translate-x-1/2  hover:text-cyan-400 cursor-pointer"
              />
            </div>
            <div className="h-full">
              <button
                className="w-full bg-green-400 hover:bg-green-300 rounded-xl px-4 py-2 text-xl 
                font-semibold text-slate-500 flex"
                onClick={() => handleCollectItem(itemList[currentIndex].index)}
              >
                <MdSaveAlt className="inline-block text-2xl mt-0.5" />
                <p className="mt-0.5 ml-4">Collect</p>
              </button>
              <div className="bg-white/80 px-2.5 pt-1.5 pb-2 rounded-lg mt-2">
                <p className="text-lg font-semibold text-slate-500">
                  Image Description
                </p>
                <p>{itemList[currentIndex].description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraDataPanelUI;
