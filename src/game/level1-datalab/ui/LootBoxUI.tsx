import { useState } from "react";

const LootBoxUI = ({
  confirmSelectedItems, setConfirmSelectedItems
}) => {
  const [itemList, setItemList] = useState([
    {
      index: 1,
      name: "Voice Recorder",
      description: "A voice recorder that can record audio.",
      image: "https://cdn-icons-png.flaticon.com/512/3687/3687408.png",
    },
    {
      index: 2,
      name: "Text Note",
      description: "A text note that can store text.",
      image: "https://cdn-icons-png.flaticon.com/512/4400/4400968.png",
    },
  ]);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelectItem = (item) => {
    if (confirmSelectedItems.some(confirmedItem => confirmedItem.index === item.index)) return; // Prevent selection if item is collected

    setSelectedItems((prev) => {
      if (prev.some(selectedItem => selectedItem.index === item.index)) {
        return prev.filter((selectedItem) => selectedItem.index !== item.index);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleCollectItem = (item) => {
    setConfirmSelectedItems((prev) => {
      if (!prev.some(confirmedItem => confirmedItem.index === item.index)) {
        return [...prev, item];
      }
      return prev;
    });

    // Also remove from selectedItems after collecting
    setSelectedItems((prev) => prev.filter((selectedItem) => selectedItem.index !== item.index));
  };

  // Ensure there are always 10 items for the grid
  const displayItems = [...itemList, ...Array(10 - itemList.length).fill(null)];

  return (
    <div
      className="absolute z-[500] w-full max-w-[50%] ml-24 h-[60vh] overflow-y-auto rounded-3xl border-4 border-white/50
        bg-cyan-400/50 flex items-center justify-center p-4"
      style={{ top: "40%", transform: "translateY(-50%)" }}
    >
      <div className="w-full h-full">
        <h1 className="text-center mb-2.5 text-2xl -mt-1 text-white font-semibold">Chest Box</h1>
        <div className="grid grid-cols-5 gap-4">
          {displayItems.map((item, index) => (
            <div
              key={index}
              className={`bg-white h-32 rounded-xl flex items-center justify-center ${
                item
                  ? confirmSelectedItems.some(confirmedItem => confirmedItem.index === item.index)
                    ? "border-4 border-blue-600"
                    : selectedItems.some(selectedItem => selectedItem.index === item.index)
                    ? "border-4 border-green-400"
                    : ""
                  : "opacity-75 cursor-not-allowed"
              }`}
              onClick={() => item && handleSelectItem(item)}
            >
              {item ? (
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: "50%", height: "auto" }}
                />
              ) : (
                <p className="m-auto text-gray-500">Empty</p>
              )}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-4 mt-4 pt-3 border-t-2">
          <p className="text-xl -mb-1 text-white font-semibold">Picking Item</p>
          {selectedItems.map((item, index) => (
            <div key={index} className="bg-white p-2 rounded-lg -mt-1 cursor-pointer flex gap-x-2 items-stretch">
              <div className="bg-neutral-200 w-fit p-1.5 rounded-lg">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-[50px]"
                />
              </div>
              <div className="my-auto font-semibold">
                <p className="text-gray-500 text-xl">
                  {item.name}
                </p>
                <p className="text-gray-400">
                  {item.description}
                </p>
              </div>
              <div className="ml-auto mr-0 h-12 my-auto flex gap-x-2">
                <button
                  className="bg-green-500 hover:bg-green-400 text-white px-3 py-1 rounded-lg h-full"
                  onClick={() => handleCollectItem(item)}
                >
                  Collect
                </button>
                <button
                  className="bg-red-400 hover:bg-red-300 text-white px-3 py-1 rounded-lg h-full"
                  onClick={() => handleSelectItem(item)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          {selectedItems.length === 0 && (
            <div className="bg-white/80 p-2 rounded-lg -mt-1">
              <p className="text-gray-500 text-center">No Item Selected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LootBoxUI;
