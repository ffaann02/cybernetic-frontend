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
      <div className="absolute top-[2.45rem] left-[54%] transform -translate-x-1/2 rotate-[7deg] bg-transparent">
        <CharacterHead />
      </div>
      {/* BODY */}
      <div className="absolute top-[8.5rem] left-1/2 transform -translate-x-1/2 rotate-[7deg] z-[4] bg-transparent">
        <Body />
      </div>
      {/* LEFT ARM */}
      <div className="absolute top-[40%] right-[30%] transform -translate-x-1/2 w-14 rotate-[150deg] z-[3] bg-transparent">
        <LeftTopArm />
      </div>
      <div className="absolute top-[44%] left-[40%] transform -translate-x-1/2 w-[5rem] rotate-[100deg] scale-y-[-1] z-[3] bg-transparent">
        <LeftHand />
      </div>
      {/* RIGHT ARM */}
      <div className="absolute top-[38.7%] left-[44%] transform -translate-x-1/2 w-14 rotate-[-110deg] z-10 bg-transparent">
        <RightTopArm />
      </div>
      <div className="absolute top-[43%] left-[53%] transform -translate-x-1/2 w-[5rem] rotate-[-190deg] z-10 bg-transparent">
        <RightHand />
      </div>
      {/* LEFT LEG */}
      <div className="absolute top-[59%] right-[40%] transform -translate-x-1/2 w-6 z-[5] rotate-[-10deg] bg-transparent">
        <LeftTopLeg />
      </div>
      <div className="absolute top-[70%] right-[35.5%] transform -translate-x-1/2 w-8 z-[5] rotate-[-5deg] bg-transparent">
        <LeftFoot />
      </div>
      {/* RIGHT LEG */}
      <div className="absolute top-[58.5%] left-[44%] transform -translate-x-1/2 w-6 z-[5] rotate-[5deg] bg-transparent">
        <RightTopLeg />
      </div>
      <div className="absolute top-[61%] left-[36%] transform -translate-x-1/2 w-8 z-[5] rotate-[100deg] bg-transparent">
        <RightFoot />
      </div>
    </>
  );
};
export default Running3;
