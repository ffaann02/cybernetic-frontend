import { FaEraser } from "react-icons/fa";
import CharacterPreview from "../components/ui/create-character/CharacterPreview";
import ToolsBar from "../components/ui/create-character/ToolsBar";
import { CreateCharacterProvider } from "../contexts/CreateCharacterContext";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { useFirebaseStorage } from "../hooks/useFirebaseStorage";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import { useRef, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import useAxios from "../hooks/useAxios";
import axiosInstance from "../api/axios";

const CreateCharacter = () => {

  const { uploadImage } = useFirebaseStorage();
  const { getItem, setItem } = useLocalStorage();
  const { axiosFetch } = useAxios();

  const localStorageUser = getItem('CYBERNETIC_USER')
  const userId = localStorageUser?.userId

  const idle_frame1 = useRef<HTMLDivElement>(null);
  const idle_frame2 = useRef<HTMLDivElement>(null);
  const idle_frame3 = useRef<HTMLDivElement>(null);
  const idle_frame4 = useRef<HTMLDivElement>(null);

  const run_frame_1 = useRef<HTMLDivElement>(null);
  const run_frame_2 = useRef<HTMLDivElement>(null);
  const run_frame_3 = useRef<HTMLDivElement>(null);
  const run_frame_4 = useRef<HTMLDivElement>(null);
  const run_frame_5 = useRef<HTMLDivElement>(null);
  const run_frame_6 = useRef<HTMLDivElement>(null);

  const jump_frame_1 = useRef<HTMLDivElement>(null);
  const jump_frame_2 = useRef<HTMLDivElement>(null);
  const jump_frame_3 = useRef<HTMLDivElement>(null);

  const lift_run_frame_1 = useRef<HTMLDivElement>(null);
  const lift_run_frame_2 = useRef<HTMLDivElement>(null);
  const lift_run_frame_3 = useRef<HTMLDivElement>(null);
  const lift_run_frame_4 = useRef<HTMLDivElement>(null);
  const lift_run_frame_5 = useRef<HTMLDivElement>(null);
  const lift_run_frame_6 = useRef<HTMLDivElement>(null);

  const lift_idle_frame_1 = useRef<HTMLDivElement>(null);
  const lift_idle_frame_2 = useRef<HTMLDivElement>(null);
  const lift_idle_frame_3 = useRef<HTMLDivElement>(null);
  const [isExportAnimation, setIsExportAnimation] = useState<boolean>(false);

  const [characterName, setCharacterName] = useState<string>("");
  const [isUpdateCharacterError, setIsUpdateCharacterError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const IdleExportToPng = async () => {
    setIsExportAnimation(true);
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
      const [img1, img2, img3, img4] = await Promise.all([
        captureImage(idle_frame1, 0),
        captureImage(idle_frame2, 1),
        captureImage(idle_frame3, 2),
        captureImage(idle_frame4, 3),
      ]);

      // Once all images are loaded, create the sprite sheet
      const canvas = document.createElement("canvas");
      canvas.width = img1.width * 4;
      canvas.height = img1.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(img1, 0, 0);
        ctx.drawImage(img2, img1.width, 0);
        ctx.drawImage(img3, img1.width * 2, 0);
        ctx.drawImage(img4, img1.width * 3, 0);

        canvas.toBlob(async (blob) => {
          if (blob) {
            saveAs(blob, "idle.png");
            await uploadImage(blob, "idle.png", `character/${userId}`);
          }
        }, "image/png");
        setIsExportAnimation(false);
      }
    } catch (err) {
      console.error("Error exporting PNG:", err);
    }
  };

  const LiftIdleExportToPng = async () => {
    setIsExportAnimation(true);
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
        captureImage(lift_idle_frame_1, 0),
        captureImage(lift_idle_frame_2, 1),
        captureImage(lift_idle_frame_3, 2),
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

        canvas.toBlob(async (blob) => {
          if (blob) {
            saveAs(blob, "lift-idle.png");
            await uploadImage(blob, "lift-idle.png", `character/${userId}`);
          }
        }, "image/png");
        setIsExportAnimation(false);
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

        canvas.toBlob(async (blob) => {
          if (blob) {
            saveAs(blob, "running.png");
            await uploadImage(blob, "running.png", `character/${userId}`);
          }
        }, "image/png");
        setIsExportAnimation(false);
      }
    } catch (err) {
      console.error("Error exporting PNG:", err);
    }
  };

  const LiftRunningExportToPng = async () => {
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
        captureImage(lift_run_frame_1, 0),
        captureImage(lift_run_frame_2, 1),
        captureImage(lift_run_frame_3, 2),
        captureImage(lift_run_frame_4, 3),
        captureImage(lift_run_frame_5, 4),
        captureImage(lift_run_frame_6, 5),
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

        canvas.toBlob(async (blob) => {
          if (blob) {
            saveAs(blob, "lift-running.png");
            await uploadImage(blob, "lift-running.png", `character/${userId}`);
          }
        }, "image/png");
        setIsExportAnimation(false);
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

        canvas.toBlob(async (blob) => {
          if (blob) {
            console.log(blob);
            saveAs(blob, "jump.png");
            await uploadImage(blob, "jump.png", `character/${userId}`);
          }
        }, "image/png");
      }
    } catch (err) {
      console.error("Error exporting PNG:", err);
    }
  };


  const handleCreateCharacter = async () => {
    console.log("Create Character");
    try {
      const response = await axiosFetch({
        axiosInstance,
        url: '/user/character/update',
        method: 'post',
        requestConfig: {
          userId: userId,
          characterName: characterName,
          heighestLevel: 1,
        }
      })
      setIsUpdateCharacterError(false);
      const data = {
        userId: userId,
        email: localStorageUser?.email,
        characterName: characterName,
      }
      setItem("CYBERNETIC_USER", data)
      console.log(response);
      setIsExportAnimation(true);
      IdleExportToPng();
      LiftIdleExportToPng();
      RunningExportToPng();
      LiftRunningExportToPng();
      setIsExportAnimation(false);
    } catch (error) {
      setIsUpdateCharacterError(true);
      if (error.response) {
        setErrorMessage(error.response.data.error);
      }
      console.log(error);
    }
  };

  return (
    <CreateCharacterProvider>
      <div className="flex-grow flex w-full h-screen py-10 bg-gradient-to-r from-cyan-500 to-blue-500">
        <div
          className="max-w-5xl xl:max-w-7xl w-full h-full flex-grow border-4 border-transparent
      m-auto grid grid-cols-3 rounded-3xl pl-4 pr-0 py-5 gap-x-6 bg-black/50"
        >
          <div className="col-span-1 flex border rounded-xl bg-white/10">
            <CharacterPreview
              idle_frame1={idle_frame1}
              idle_frame2={idle_frame2}
              idle_frame3={idle_frame3}
              idle_frame4={idle_frame4}
              run_frame_1={run_frame_1}
              run_frame_2={run_frame_2}
              run_frame_3={run_frame_3}
              run_frame_4={run_frame_4}
              run_frame_5={run_frame_5}
              run_frame_6={run_frame_6}
              jump_frame_1={jump_frame_1}
              jump_frame_2={jump_frame_2}
              jump_frame_3={jump_frame_3}
              lift_run_frame_1={lift_run_frame_1}
              lift_run_frame_2={lift_run_frame_2}
              lift_run_frame_3={lift_run_frame_3}
              lift_run_frame_4={lift_run_frame_4}
              lift_run_frame_5={lift_run_frame_5}
              lift_run_frame_6={lift_run_frame_6}
              lift_idle_frame_1={lift_idle_frame_1}
              lift_idle_frame_2={lift_idle_frame_2}
              lift_idle_frame_3={lift_idle_frame_3}
              isExportAnimation={isExportAnimation}
              IdleExportToPng={IdleExportToPng}
              LiftIdleExportToPng={LiftIdleExportToPng}
              RunningExportToPng={RunningExportToPng}
              LiftRunningExportToPng={LiftRunningExportToPng}
              JumpExportToPng={JumpExportToPng}
              characterName={characterName}
              setCharacterName={setCharacterName}
            />
          </div>
          <div className="col-span-2 h-full flex flex-col">
            <ToolsBar />
            <div className="mt-auto ml-auto">
              {isUpdateCharacterError &&
                <div className="w-full flex justify-end">
                  <p className="text-red-400 text-lg mr-14">{errorMessage}</p>
                </div>}
              <div className="flex mt-auto mb-0 gap-x-4 ml-auto mr-10">
                <button className="bg-slate-200/50 px-4 py-3 rounded-2xl border font-bold text-slate-600 w-fit flex ">
                  <FaEraser className="text-2xl my-auto" />
                  <p className="ml-3 text-xl">Clear Setting</p>
                </button>
                <button className="bg-cyan-400/50 px-4 py-3 rounded-2xl border text-xl font-bold text-cyan-100 w-fit flex"
                  onClick={handleCreateCharacter}>
                  <IoMdCheckmarkCircleOutline className="text-2xl my-auto" />
                  <p className="ml-3 text-xl">Create Character</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CreateCharacterProvider>
  );
};
export default CreateCharacter;
