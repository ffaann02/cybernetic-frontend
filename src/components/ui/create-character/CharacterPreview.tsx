import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import Idle1 from "./SpriteFrame/Idle/Idle1";
import Idle2 from "./SpriteFrame/Idle/Idle2";
import Idle3 from "./SpriteFrame/Idle/Idle3";
import Running1 from "./SpriteFrame/Running/Running1";
import Running2 from "./SpriteFrame/Running/Running2";
import Running3 from "./SpriteFrame/Running/Running3";
import Running4 from "./SpriteFrame/Running/Running4";
import Running5 from "./SpriteFrame/Running/Running5";
import Running6 from "./SpriteFrame/Running/Running6";
import Jump1 from "./SpriteFrame/Jump/Jump1";
import Jump2 from "./SpriteFrame/Jump/Jump2";
import Jump3 from "./SpriteFrame/Jump/Jump3";
import { useFirebaseStorage } from "../../../hooks/useFirebaseStorage";
import testfromTif from "../../../components/create-character/MainCharacter.png"

const CharacterPreview = () => {
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const frame1 = useRef<HTMLDivElement>(null);
  const frame2 = useRef<HTMLDivElement>(null);
  const frame3 = useRef<HTMLDivElement>(null);

  const run_frame_1 = useRef<HTMLDivElement>(null);
  const run_frame_2 = useRef<HTMLDivElement>(null);
  const run_frame_3 = useRef<HTMLDivElement>(null);
  const run_frame_4 = useRef<HTMLDivElement>(null);
  const run_frame_5 = useRef<HTMLDivElement>(null);
  const run_frame_6 = useRef<HTMLDivElement>(null);
  const jump_frame_1 = useRef<HTMLDivElement>(null);
  const jump_frame_2 = useRef<HTMLDivElement>(null);
  const jump_frame_3 = useRef<HTMLDivElement>(null);

  const frames = [
    <Jump1 />,
    <Jump2 />,
    <Jump3 />,
  ];

  const { uploadImage } = useFirebaseStorage();

  const IdleExportToPng = async () => {
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

  const RunningExportToPng = async () => {
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
      const [img1, img2, img3, img4, img5, img6] = await Promise.all([
        captureImage(run_frame_1, 0),
        captureImage(run_frame_2, 1),
        captureImage(run_frame_3, 2),
        captureImage(run_frame_4, 3),
        captureImage(run_frame_5, 4),
        captureImage(run_frame_6, 5),
      ]);

      // Once all images are loaded, create the sprite sheet
      const canvas = document.createElement("canvas");
      canvas.width = img1.width * 6;
      canvas.height = img1.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(img1, 0, 0);
        ctx.drawImage(img2, img1.width, 0);
        ctx.drawImage(img3, img1.width * 2, 0);
        ctx.drawImage(img4, img1.width * 3, 0);
        ctx.drawImage(img5, img1.width * 4, 0);
        ctx.drawImage(img6, img1.width * 5, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            saveAs(blob, "running.png");
          }
        }, "image/png");
      }
    } catch (err) {
      console.error("Error exporting PNG:", err);
    }
  };

  const JumpExportToPng = async () => {
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
        captureImage(jump_frame_1, 0),
        captureImage(jump_frame_2, 1),
        captureImage(jump_frame_3, 2),
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

        canvas.toBlob(async(blob) => {
          if (blob) {
            console.log(blob)
            saveAs(blob, "jump.png");
            await uploadImage(blob, 'jump.png', 'character/u111362252');
          }
        }, "image/png");
      }
    } catch (err) {
      console.error("Error exporting PNG:", err);
    }
  };

  // const uploadImage = async (blob: Blob) => {
  //   const formData = new FormData();
  //   formData.append('image', blob, 'jump.png');
  //   try{
  //     const response = await axiosInstance.post('/test/firebase/upload', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     });
  //     console.log(response);
  //   } catch (err) {
  //     console.error('Error uploading image:', err);
  //   }
  // };

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
          className="w-[384px] h-[384px] my-auto relative bg-transparent"
          id="frame"
        >
          <img src={testfromTif} className="h-full mx-auto"/>
          {/* <div className="w-full h-full relative bg-transparent">
            <div className="w-full h-full relative" ref={frame1}> */}
              {/* <Idle1 /> */}
            {/* </div> */}
{/* 
            <div className="w-full h-full relative" ref={frame2}>
              <Idle2 />
            </div>
            <div className="w-full h-full relative" ref={frame3}>
              <Idle3 />
            </div> */}
            {/* <div className="w-full h-full relative" ref={run_frame_1}>
              <Running1 />
            </div>
            <div className="w-full h-full relative" ref={run_frame_2}>
              <Running2 />
            </div>
            <div className="w-full h-full relative" ref={run_frame_3}>
              <Running3 />
            </div>
            <div className="w-full h-full relative" ref={run_frame_4}>
              <Running4 />
            </div>
            <div className="w-full h-full relative" ref={run_frame_5}>
              <Running5 />
            </div>
            <div className="w-full h-full relative" ref={run_frame_6}>
              <Running6 />
            </div> */}
            {/* <div className="w-full h-full relative" ref={jump_frame_1}>
              <Jump1/>
            </div>
            <div className="w-full h-full relative" ref={jump_frame_2}>
              <Jump2/>
            </div>
            <div className="w-full h-full relative" ref={jump_frame_3}>
              <Jump3 />
            </div> */}
            {/* <div className="w-full h-full relative bg-transparent">
              {frames[currentFrame]}
            </div> */}
          </div>
        </div>
        {/* <button onClick={IdleExportToPng}>Idle Export to PNG</button>
        <button onClick={RunningExportToPng}>Running Export to PNG</button>
        <button onClick={JumpExportToPng}>Jump Export to PNG</button> */}
      {/* </div> */}
    </>
  );
};

export default CharacterPreview;
