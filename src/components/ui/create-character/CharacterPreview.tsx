import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import CharacterHead from "../../../assets/character-part-example/CharacterHead";
import LeftFoot from "../../../assets/character-part-example/LeftFoot";
import LeftHand from "../../../assets/character-part-example/LeftHand";
import LeftTopArm from "../../../assets/character-part-example/LeftTopArm";
import LeftTopLeg from "../../../assets/character-part-example/LeftTopLeg";
import RightHand from "../../../assets/character-part-example/RightHand";

const CharacterPreview = () => {
  const exportToPng = () => {
    const input: HTMLElement | null = document.getElementById("frame");
    if (!input) return;
    html2canvas(input).then((canvas) => {
      // Create a new canvas with 3 times the width of the original
      const newCanvas = document.createElement("canvas");
      newCanvas.width = canvas.width * 3;
      newCanvas.height = canvas.height;
      const ctx = newCanvas.getContext("2d");
      if(!ctx) return;
      // Draw the original image three times on the new canvas
      ctx.drawImage(canvas, 0, 0);
      ctx.drawImage(canvas, canvas.width, 0);
      ctx.drawImage(canvas, canvas.width * 2, 0);

      // Convert the new canvas to a PNG and save it
      newCanvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, "character.png");
        }
      }, "image/png");
    });
  };

  return (
    <>
      <div className="flex flex-col bg-white/15 rounded-lg">
        <div className="w-[384px] h-[384px] my-auto relative" id="frame">
          <div className="absolute left-1/2 transform -translate-x-1/2 top-4">
            <CharacterHead />
          </div>
          <div
            className="w-[4.5rem] h-24 bg-orange-400 justify-end flex rounded-lg absolute 
        transform left-1/2 top-28 -translate-x-1/2 z-[2]"
          >
            <div className="w-full mt-auto mb-auto h-4 bg-black absolute bottom-0 rounded-b-lg"></div>
          </div>

          <div className="w-12 absolute transform left-[39%] top-[7.8rem] -translate-x-[48%] -rotate-[75deg] z-[3]">
            <LeftTopArm />
          </div>
          <div className="w-[4rem] absolute transform left-[41.5%] top-[10.5rem] -translate-x-[55%] -rotate-[120deg] z-[2]">
            {/* <LeftHand /> */}
            <RightHand />
          </div>

          <div className="w-12 absolute transform right-[27%] top-[7.7rem] -translate-x-[48%] -rotate-[110deg] z-[1]">
            <LeftTopArm />
          </div>
          <div className="w-[4rem] absolute transform right-[21%] top-[10.5rem] -translate-x-[55%] rotate-[100deg] z-[2]">
            {/* <LeftHand /> */}
            <LeftHand />
          </div>

          <div className="w-6 absolute transform left-[45%] top-[12.5rem] -translate-x-[55%]">
            <LeftTopLeg />
          </div>
          <div className="w-[1.97rem] absolute transform left-[46.2%] top-[15rem] -translate-x-[55%]">
            <LeftFoot />
          </div>
          <div className="w-6 absolute transform left-[55%] top-[12.5rem] -translate-x-[55%]">
            <LeftTopLeg />
          </div>
          <div className="w-[1.97rem] absolute transform left-[56.1%] top-[15rem] -translate-x-[55%]">
            <LeftFoot />
          </div>
        </div>
        <button onClick={exportToPng} className="text-white">
          Export to PNG
        </button>
      </div>
    </>
  );
};
export default CharacterPreview;
