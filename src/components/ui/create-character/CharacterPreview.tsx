import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import Idle1 from "./SpriteFrame/Idle/Idle1";
import Idle2 from "./SpriteFrame/Idle/Idle2";
import Idle3 from "./SpriteFrame/Idle/Idle3";
import Running1 from "./SpriteFrame/Running/Running1";
import Running2 from "./SpriteFrame/Running/Running2";
import Running3 from "./SpriteFrame/Running/Running3";

const CharacterPreview = () => {
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const frame1 = useRef<HTMLDivElement>(null);
  const frame2 = useRef<HTMLDivElement>(null);
  const frame3 = useRef<HTMLDivElement>(null);

  const frames = [
    <Running1 />,
    <Running2 />,
    <Running3 />,
    <Running2 />,
    <Running1 />,
  ];

  const exportToPng = async () => {
    const captureImage = async (
      frameRef: React.RefObject<HTMLDivElement>,
      index: number
    ): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        if (!frameRef.current) {
          reject(new Error(`Frame ${index + 1} ref is not available.`));
          return;
        }

        toPng(frameRef.current, { backgroundColor: "rgba(0,0,0,0)" })
          .then((dataUrl: string) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = (err) => reject(err);
            img.src = dataUrl;
          })
          .catch((err: Error) => reject(err));
      });
    };

    try {
      // Capture all three frames
      const [img1, img2, img3] = await Promise.all([
        captureImage(frame1, 0),
        captureImage(frame2, 1),
        captureImage(frame3, 2),
      ]);

      // Once all images are loaded, create the sprite sheet
      const canvas = document.createElement("canvas");
      canvas.width = img1.width * 3;
      canvas.height = img1.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(img1, 0, 0);
        ctx.drawImage(img2, img1.width, 0);
        ctx.drawImage(img3, img1.width * 2, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            saveAs(blob, "character-sprite.png");
          }
        }, "image/png");
      }
    } catch (err) {
      console.error("Error exporting PNG:", err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prevFrame) => (prevFrame + 1) % frames.length);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="flex flex-col rounded-lg">
        <div
          className="w-[384px] h-[384px] my-auto relative bg-transparent overflow-hidden"
          id="frame"
        >
          <div className="w-full h-full relative bg-transparent">
            {/* <div className="w-full h-full relative" ref={frame1}>
              <Idle1 />
            </div>
            <div className="w-full h-full relative" ref={frame2}>
              <Idle2 />
            </div>
            <div className="w-full h-full relative" ref={frame3}>
              <Idle3 />
            </div> */}
            {/* <Running1/>
            <Running2/>
            <Running3 /> */}
            <div className="w-full h-full relative bg-transparent">
              {frames[currentFrame]}
            </div>
          </div>
        </div>
        <button onClick={exportToPng}>Export to PNG</button>
      </div>
    </>
  );
};

export default CharacterPreview;
