import Body from "../../../../create-character/Body";
import CharacterHead from "../../../../create-character/Head";
import LeftFoot from "../../../../create-character/BottomLeftLeg";
import LeftHand from "../../../../create-character/BottomLeftArm";
import LeftTopArm from "../../../../create-character/LeftTopArm";
import LeftTopLeg from "../../../../create-character/TopLeftLeg";
import RightFoot from "../../../../create-character/RightFoot";
import RightHand from "../../../../create-character/BottomRightArm";
import RightTopArm from "../../../../create-character/TopRightArm";
import RightTopLeg from "../../../../create-character/TopRightLeg";

const Running3 = () => {
  return (
    <>
      <div className="absolute z-[50] top-[2rem] left-1/2 transform -translate-x-[44.5%] w-[8rem] bg-transparent rotate-[5deg]">
        <CharacterHead />
      </div>
      {/* BODY */}
      <div className="absolute top-[8.5rem] left-1/2 transform -translate-x-1/2 w-[5rem] z-[11] bg-transparent rotate-[6deg]">
        <Body />
      </div>
      {/* LEFT ARM */}
      <div className="absolute top-[44%] right-[25.5%] transform -translate-x-[70%] w-[3.25rem] rotate-[100deg] z-[10] bg-transparent">
        <LeftTopArm />
      </div>
      <div className="absolute top-[54%] right-[38.5%] transform -translate-x-[60%] w-[4.5rem] -scale-y-100 rotate-[100deg] z-10 bg-transparent">
        <LeftHand />
      </div>
      {/* RIGHT ARM */}
      <div className="absolute top-[40.5%] left-[40%] transform -translate-x-1/2 w-[3.25rem] rotate-[90deg] z-[12] bg-transparent">
        <RightTopArm />
      </div>
      <div className="absolute top-[47%] left-[47%] transform -translate-x-1/2 w-[4.5rem] scale-y-100 rotate-[170deg] z-[12] bg-transparent">
        <RightHand />
      </div>
      {/* LEFT LEG */}
      <div className="absolute top-[65%] right-[37%] transform -translate-x-1/2 w-[2rem] z-[3] bg-transparent rotate-[-5deg]">
        <LeftTopLeg />
      </div>
      <div className="absolute top-[77%] right-[33.5%] transform -translate-x-1/2 w-[2.5rem] z-[2] bg-transparent rotate-[5deg]">
        <LeftFoot />
      </div>
      {/* RIGHT LEG */}
      <div className="absolute top-[62%] left-[43.5%] transform -translate-x-1/2 w-[2rem] z-[6] bg-transparent rotate-[10deg]">
        <RightTopLeg />
      </div>
      <div className="absolute top-[70%] left-[34.5%] transform -translate-x-1/2 w-[2.5rem] z-[5] bg-transparent rotate-[85deg]">
        <RightFoot />
      </div>
    </>
  );
};
export default Running3;
