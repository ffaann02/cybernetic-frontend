import Body from "../../../../create-character/Body";
import CharacterHead from "../../../../create-character/CharacterHead";
import LeftFoot from "../../../../create-character/LeftFoot";
import LeftHand from "../../../../create-character/LeftHand";
import LeftTopArm from "../../../../create-character/LeftTopArm";
import LeftTopLeg from "../../../../create-character/LeftTopLeg";
import RightFoot from "../../../../create-character/RightFoot";
import RightHand from "../../../../create-character/RightHand";
import RightTopArm from "../../../../create-character/RightTopArm";
import RightTopLeg from "../../../../create-character/RightTopLeg";

const Running3 = () => {
  return (
    <>
      <div className="absolute top-[2.5rem] left-[48%] transform -translate-x-1/2 rotate-[-10deg] bg-transparent">
        <CharacterHead />
      </div>
      {/* BODY */}
      <div className="absolute top-[8.5rem] left-[51%] transform -translate-x-1/2 rotate-[-5deg] z-[4] bg-transparent">
        <Body />
      </div>
      {/* LEFT ARM */}
      <div className="absolute top-[38.5%] right-[26%] transform -translate-x-1/2 w-14 rotate-[65deg] z-[3] bg-transparent">
        <LeftTopArm />
      </div>
      <div className="absolute top-[43%] right-[16%] transform -translate-x-1/2 w-[5rem] rotate-[-10deg] scale-y-[-1] z-[3] bg-transparent">
        <LeftHand />
      </div>
      {/* RIGHT ARM */}
      <div className="absolute top-[40%] left-[42%] transform -translate-x-1/2 w-14 rotate-[-110deg] z-10 bg-transparent">
        <RightTopArm />
      </div>
      <div className="absolute top-[44%] left-[52%] transform -translate-x-1/2 w-[5rem] rotate-[-20deg] scale-x-[-1] z-10 bg-transparent">
        <RightHand />
      </div>
      {/* LEFT LEG */}
      <div className="absolute top-[54%] right-[31.5%] transform -translate-x-1/2 w-6 rotate-[-80deg] z-[5] bg-transparent">
        <LeftTopLeg />
      </div>
      <div className="absolute top-[59%] right-[30%] transform -translate-x-1/2 w-8 rotate-[45deg] z-[5] bg-transparent">
        <LeftFoot />
      </div>
      {/* RIGHT LEG */}
      <div className="absolute top-[58%] left-[44%] transform -translate-x-1/2 w-6 rotate-[30deg] z-[5] bg-transparent">
        <RightTopLeg />
      </div>
      <div className="absolute top-[66.5%] left-[38%] transform -translate-x-1/2 w-8 rotate-[35deg] z-[5] bg-transparent">
        <RightFoot />
      </div>
    </>
  );
};
export default Running3;
