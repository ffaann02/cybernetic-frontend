import { useContext } from "react";
import OrangeBody from "../../assets/orange-variant/Body.svg";
import RedBody from "../../assets/red-variant/Body.svg";
import { CreateCharacterContext } from "../../contexts/CreateCharacterContext";

const BodyPreview = ({ choice = 1 }) => {
  const { choices, setChoices } = useContext(CreateCharacterContext);

  return (
    <div>
      {choice === 1 && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 273.99 416">
          <defs>
            {/* <style>
            .cls-1{fill:#6d6e71;}.cls-2{fill:#58595b;}.cls-3,.cls-6{fill:#231f20;}.cls-4{fill:#414042;}.cls-5{fill:#269dd0;}.cls-6{opacity:0.2;}</style> */}
          </defs>
          <g id="Layer_2" data-name="Layer 2">
            <g id="Layer_3" data-name="Layer 3">
              <g id="Body">
                <path
                  className="cls-1"
                  fill="#6d6e71"
                  d="M258.43,75.38c-.05.17-.1.34-.16.5l-.27.65c-6.65,13.4-63.89,10.22-130.37-7.5C60.06,51,8.25,24.7,10.93,9.89c0-.16.07-.32.11-.48C15-5.29,73.52-2.45,141.84,15.76S262.35,60.67,258.43,75.38Z"
                />
                <rect
                  id="Neck"
                  className="cls-2"
                  fill="#58595b"
                  x="98.14"
                  y="5.58"
                  width="85.86"
                  height="79.21"
                />
                <path
                  className="cls-3"
                  fill="#231f20"
                  d="M184,5.58V84.79H129.05A122.82,122.82,0,0,1,110.21,63,123.94,123.94,0,0,1,98.14,41V5.58Z"
                />
                <path
                  className="cls-4"
                  fill="#414042"
                  d="M274,103.16V415.9H10.22L12.37,73.14l8.08-5.53L0,38.57,10.93,9.89C8.25,24.7,60.06,51,127.63,69c15,4,29.6,7.27,43.22,9.76q2.9.54,5.73,1l1.8.3q3.83.63,7.52,1.19c39,5.81,67.52,4.44,72.1-4.78l-3.41,8.26Z"
                />
                <path
                  className="cls-4"
                  fill="#414042"
                  d="M185,106.72,180.75,415.9l-3.32-267.64L176.87,103l-.29-23.2,1.8.3Z"
                />
                <path
                  className="cls-1"
                  fill="#6d6e71"
                  d="M192,105.91v.9L187.75,415.9v.1l-7-.1-7-.1,3.68-267.54.56-40.73L176.87,103l-6-24.23q2.9.54,5.73,1l1.8.3q3.83.63,7.52,1.19Z"
                />
                <polygon
                  className="cls-5"
                  fill="#269dd0"
                  points="107.26 96.35 107.26 382.27 10.43 382.27 12.37 73.14 20.45 67.61 107.26 96.35"
                />
                <polygon
                  className="cls-5"
                  fill="#269dd0"
                  points="273.99 103.16 273.99 382.27 243.41 382.27 243.41 103.16 266.11 95.7 273.99 103.16"
                />
                <path
                  className="cls-6"
                  fill="#231f20"
                  opacity={0.2}
                  d="M266.11,95.7l-22.7,7.46-4.4-19c10.24-1.06,17-3.6,19-7.68l-3.41,8.26Z"
                />
              </g>
            </g>
          </g>
        </svg>
      )}

      {choice === 2 && <img src={OrangeBody} alt="Left Top Arm" />}
      {choice === 3 && <img src={RedBody} alt="Left Top Arm" />}
    </div>
  );
};
export default BodyPreview;
