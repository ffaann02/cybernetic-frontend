import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { saveAs } from "file-saver";
import Idle1 from "./SpriteFrame/Idle/Idle1";
import Idle2 from "./SpriteFrame/Idle/Idle2";
import Idle3 from "./SpriteFrame/Idle/Idle3";
import Idle4 from "./SpriteFrame/Idle/Idle4";
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
import LiftIdle1 from "./SpriteFrame/Lift-Idle/LiftIdle1";
import LiftIdle2 from "./SpriteFrame/Lift-Idle/LiftIdle2";
import LiftIdle3 from "./SpriteFrame/Lift-Idle/LiftIdle3";
import LiftRunning1 from "./SpriteFrame/Lift-Running/LiftRunning1";
import LiftRunning2 from "./SpriteFrame/Lift-Running/LiftRunning2";
import LiftRunning3 from "./SpriteFrame/Lift-Running/LiftRunning3";
import LiftRunning4 from "./SpriteFrame/Lift-Running/LiftRunning4";
import LiftRunning5 from "./SpriteFrame/Lift-Running/LiftRunning5";
import LiftRunning6 from "./SpriteFrame/Lift-Running/LiftRunning6";

const CharacterPreview = ({
  idle_frame1,
  idle_frame2,
  idle_frame3,
  idle_frame4,
  run_frame_1,
  run_frame_2,
  run_frame_3,
  run_frame_4,
  run_frame_5,
  run_frame_6,
  jump_frame_1,
  jump_frame_2,
  jump_frame_3,
  lift_run_frame_1,
  lift_run_frame_2,
  lift_run_frame_3,
  lift_run_frame_4,
  lift_run_frame_5,
  lift_run_frame_6,
  lift_idle_frame_1,
  lift_idle_frame_2,
  lift_idle_frame_3,
  isExportAnimation,
  IdleExportToPng,
  LiftIdleExportToPng,
  RunningExportToPng,
  LiftRunningExportToPng,
  JumpExportToPng,
}) => {
  const [currentFrame, setCurrentFrame] = useState<number>(0);

  const [animation, setAnimation] = useState<string>("idle");
  const animationList = [
    { name: "idle", title: "Idle" },
    { name: "running", title: "Running" },
    { name: "picking", title: "Picking Run" },
    { name: "picking_idle", title: "Picking Idle" },
    { name: "death", title: "Death" },
  ];
  const [animationSpeed, setAnimationSpeed] = useState<number>(100);
  const animationSpeedList = [
    { name: 100, title: "Fast" },
    { name: 200, title: "Normal" },
    { name: 500, title: "Slow" },
  ];

  const idleFrames = [<Idle1 />, <Idle2 />, <Idle3 />, <Idle4 />];

  const runningFrames = [
    <Running1 />,
    <Running2 />,
    <Running3 />,
    <Running4 />,
    <Running5 />,
    <Running6 />,
  ];

  const idleLiftFrames = [<LiftIdle1 />, <LiftIdle2 />, <LiftIdle3 />];

  const runningLiftFrames = [
    <LiftRunning1 />,
    <LiftRunning2 />,
    <LiftRunning3 />,
    <LiftRunning4 />,
    <LiftRunning5 />,
    <LiftRunning6 />,
  ];

  const getFrames = () => {
    switch (animation) {
      case "idle":
        return idleFrames;
      case "running":
        return runningFrames;
      case "picking_idle":
        return idleLiftFrames;
      case "picking":
        return runningLiftFrames;
      default:
        return [];
    }
  };

  const frames = getFrames();

  const { uploadImage } = useFirebaseStorage();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prevFrame) => (prevFrame + 1) % frames.length);
    }, animationSpeed);
    return () => clearInterval(interval);
  }, [animationSpeed, frames.length]);

  return (
    <>
      <div className="flex flex-col rounded-lg">
        <div className="pl-4 pr-2 mt-3 flex justify-between">
          <h1 className="text-2xl text-white my-auto">Animation: </h1>
          <div className="flex gap-4 ml-3">
            <select
              onChange={(e) => setAnimation(e.target.value)}
              className="px-3 pl-2 py-1 border  rounded-xl bg-white/15 text-white/40 hover:bg-white/30 hover:text-white/60"
              value={animation}
            >
              {animationList.map((anim) => (
                <option
                  key={anim.name}
                  value={anim.name}
                  className={`${
                    animation === anim.name
                      ? "bg-cyan-400 text-slate-600"
                      : "bg-white/15 text-white/40 hover:bg-white/30 hover:text-white/60"
                  }`}
                >
                  {anim.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="pl-4 pr-2 mt-3 flex justify-between">
          <h1 className="text-2xl text-white my-auto">Speed: </h1>
          <div className="flex gap-4 ml-3">
            <select
              onChange={(e) => setAnimationSpeed(Number(e.target.value))}
              className="px-3 py-1 rounded-xl border bg-white/15 text-white/40 hover:bg-white/30 hover:text-white/60"
              value={animationSpeed}
            >
              {animationSpeedList.map((speed) => (
                <option key={speed.name} value={speed.name}>
                  {speed.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div
          className="w-[384px] h-[384px] mt-24 mb-auto relative bg-transparent overflow-y-auto"
          id="frame"
        >
          <div className="w-full h-full relative bg-transparent">
            {!isExportAnimation && (
              <div className="w-full h-full relative bg-transparent">
                {frames[currentFrame]}
              </div>
            )}
            <div className="h-20"></div>
            <div className="w-full h-full relative" ref={idle_frame1}>
              <Idle1 />
            </div>
            <div className="h-20"></div>
            <div className="w-full h-full relative" ref={idle_frame2}>
              <Idle2 />
            </div>
            <div className="h-20"></div>

            <div className="w-full h-full relative" ref={idle_frame3}>
              <Idle3 />
            </div>
            <div className="h-20"></div>

            <div className="w-full h-full relative" ref={idle_frame4}>
              <Idle4 />
            </div>
            <div className="h-20"></div>

            <div className="w-full h-full relative" ref={run_frame_1}>
              <Running1 />
            </div>
            <div className="h-20"></div>

            <div className="w-full h-full relative" ref={run_frame_2}>
              <Running2 />
            </div>
            <div className="h-20"></div>

            <div className="w-full h-full relative" ref={run_frame_3}>
              <Running3 />
            </div>
            <div className="h-20"></div>

            <div className="w-full h-full relative" ref={run_frame_4}>
              <Running4 />
            </div>
            <div className="h-20"></div>

            <div className="w-full h-full relative" ref={run_frame_5}>
              <Running5 />
            </div>
            <div className="h-20"></div>

            <div className="w-full h-full relative" ref={run_frame_6}>
              <Running6 />
            </div>
            <div className="h-20"></div>

            <div className="w-full h-full relative" ref={lift_idle_frame_1}>
              <LiftIdle1 />
            </div>
            <div className="h-20"></div>

            <div className="w-full h-full relative" ref={lift_idle_frame_2}>
              <LiftIdle2 />
            </div>
            <div className="h-20"></div>

            <div className="w-full h-full relative" ref={lift_idle_frame_3}>
              <LiftIdle3 />
            </div>
            <div className="h-20"></div>

            <div className="w-full h-full relative" ref={lift_run_frame_1}>
              <LiftRunning1 />
            </div>
            <div className="h-20"></div>

            <div className="w-full h-full relative" ref={lift_run_frame_2}>
              <LiftRunning2 />
            </div>
            <div className="h-20"></div>

            <div className="w-full h-full relative" ref={lift_run_frame_3}>
              <LiftRunning3 />
            </div>
            <div className="h-20"></div>

            <div className="w-full h-full relative" ref={lift_run_frame_4}>
              <LiftRunning4 />
            </div>
            <div className="h-20"></div>

            <div className="w-full h-full relative" ref={lift_run_frame_5}>
              <LiftRunning5 />
            </div>
            <div className="h-20"></div>

            <div className="w-full h-full relative" ref={lift_run_frame_6}>
              <LiftRunning6 />
            </div>
            <div className="h-20"></div>
          </div>
          {/* <div className="w-full h-full relative" ref={jump_frame_1}>
              <Jump1/>
            </div>
            <div className="w-full h-full relative" ref={jump_frame_2}>
              <Jump2/>
            </div>
            <div className="w-full h-full relative" ref={jump_frame_3}>
              <Jump3 />
            </div> */}
        </div>
      </div>
      {/* </div> */}
    </>
  );
};

export default CharacterPreview;
