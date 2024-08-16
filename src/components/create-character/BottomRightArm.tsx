import { useContext } from "react";
import OrangeBottomRightArm from "../../assets/orange-variant/Right_Hand.svg";
import RedBottomRightArm from "../../assets/red-variant/Right-Hand.svg";
import { CreateCharacterContext } from "../../contexts/CreateCharacterContext";

const Bottom_RightArm = ({ choice = 2 }) => {
  const { choices, setChoices } = useContext(CreateCharacterContext);

  return (
    <div>
      {choices.body === 1 && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 207.28 92.37">
          <defs>
            {/* <style>.cls-1{fill:#f6cdaa;}.cls-2{fill:#414042;}.cls-3{fill:#27aae1;}</style> */}
          </defs>
          <g id="Layer_2" data-name="Layer 2">
            <g id="Layer_3" data-name="Layer 3">
              <g id="RightHand">
                <rect
                  className="cls-1"
                  fill="#f6cdaa"
                  y="15.22"
                  width="75.11"
                  height="39.56"
                  rx="11.56"
                />
                <path
                  className="cls-2"
                  fill="#414042"
                  d="M17.56,14.56H63.89A11.56,11.56,0,0,1,75.44,26.11V43.56A11.56,11.56,0,0,1,63.89,55.11H17.56a0,0,0,0,1,0,0V14.56A0,0,0,0,1,17.56,14.56Z"
                />
                <rect
                  className="cls-1"
                  fill="#f6cdaa"
                  x="25.56"
                  y="49.65"
                  width="42.74"
                  height="27.03"
                  rx="11.56"
                  transform="translate(-30.92 51.68) rotate(-45)"
                />
                <path
                  className="cls-2"
                  fill="#414042"
                  d="M38.13,42.9H57A11.56,11.56,0,0,1,68.57,54.45v5.85A11.56,11.56,0,0,1,57,71.86H38.13a0,0,0,0,1,0,0v-29A0,0,0,0,1,38.13,42.9Z"
                  transform="translate(-24.95 54.53) rotate(-45)"
                />
              </g>
              <path
                className="cls-2"
                fill="#414042"
                d="M184.66,10.17l10.78,9.27a33.89,33.89,0,0,1,11.81,25.47l0,4.28a33.91,33.91,0,0,1-16.7,29.48l-11.15,6.56-50.31,7.14L108,83.3,50,86.88,52.42,6l58,4.18L136.27,0Z"
              />
              <polygon
                className="cls-3"
                fill="#27aae1"
                points="52.42 5.99 64.93 6.89 62.4 86.11 49.95 86.88 52.42 5.99"
              />
            </g>
          </g>
        </svg>
      )}
      {choices.body === 2 && <img src={OrangeBottomRightArm} alt="Left Top Arm" />}
      {choices.body === 3 && <img src={RedBottomRightArm} alt="Left Top Arm" />}
    </div>
  );
};
export default Bottom_RightArm;
