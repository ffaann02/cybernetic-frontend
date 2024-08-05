import { Fieldset } from "primereact/fieldset";
import { useContext, useEffect, useState } from "react";
import TypeWriter from "./TypeWriter";
import { Checkbox } from "primereact/checkbox";
import { GameContext } from "../../../contexts/GameContext";
import { useLevel1Context } from "../../../contexts/SceneContext/Level1Context";

const ChatwithGoodBot = () => {
  const [dialogLists, setDialogLists] = useState([
    {
      step: 1,
      dialog: "Hello! How can we help you?",
    },
  ]);
  const { setCurrentHit, setIsInteracting } = useContext(GameContext);
  const {
    confirmSelectedItems,
    dataCollectNotify,
    textCollectedList,
    setTextCollectedList,
    audioCollectedList,
    setAudioCollectedList,
  } = useLevel1Context();

  console.log(confirmSelectedItems);

  const [buttonInteraction, setButtonInteraction] = useState([
    {
      step: 1,
      dialog: "Who are you?",
      response:
        "I'm a friendly worker bot. I'm here to help you with anything you need.",
    },
    {
      step: 1,
      dialog: "What are you guys doing?",
      response:
        "We are currently having a break from work. Do you have any questions or need help with anything?",
    },
    {
      step: 2,
      dialog: "How can I find the data source?",
      response:
        "You can find the data source in the data lab. It's located all around in many rooms.",
    },
    {
      step: 2,
      dialog: "Can I record the audio or context of our conversation?",
      response:
        "Yes, you can. But do you have any voice recorder or text memory?",
    },
    {
      step: 3,
      dialog: "I don't have any of them, what should I do?",
      response:
        "You can find the text note in the data lab. It's located loot box.",
    },
    {
      step: 3,
      dialog: "Tell me more about this data lab. Are there any danger?",
      response:
        "The data lab is a place where you can find many data sources. But be careful, there are some dangers robotic guard around. If you're NOT worker robot, they will not let you in.",
    },
    {
      step: 3,
      dialog: "Can we be friends?",
      response: "Of course! I'm here to help you. We can be friends.",
    },
    {
      step: 4,
      dialog: "Thank you for your help. I will find the data source now.",
      response: "You're welcome! If you need any help, feel free to ask me.",
    },
    {
      step: 5,
      dialog: "Goodbye!",
      response: "Goodbye! Have a nice day!",
    },
  ]);

  const [currentText, setCurrentText] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [clearText, setClearText] = useState(false);
  const [isRecordAudio, setIsRecordAudio] = useState(false);
  const [isSaveText, setIsSaveText] = useState(false);

  useEffect(() => {
    // Set the initial text for the first step
    const initialDialog = dialogLists.find(
      (dialog) => dialog.step === currentStep
    )?.dialog;
    if (initialDialog) {
      setCurrentText(initialDialog);
    }
  }, [currentStep]);

  const handleButtonClick = (index) => {
    if (currentStep === 5) {
      console.log("end");
      setIsInteracting(false);
      setCurrentHit("");
      return;
    }

    // Append text to textCollectedList before showing the toast notification
    if (isRecordAudio) {
      setAudioCollectedList((prevList) => [
        ...prevList,
        {
          index: currentStep,
          text: "GoodBotAudio_DataLab/" + currentStep,
          source: "RobotNPC",
        },
      ]);

      dataCollectNotify.current.show({
        unstyled: true,
        closable: false,
        life: 2000,
        content: (props) => (
          <div className="flex relative z-[100] rounded-lg px-2.5 py-2 gap-x-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/9380/9380416.png"
              className="w-16 h-16 bg-white rounded-xl"
            />
            <div className="">
              <p className="text-2xl font-semibold text-white">
                Data Collected!
              </p>
              <p className="text-lg font-semibold text-white">
                received 1 audio file.
              </p>
            </div>
          </div>
        ),
      });
    }

    if (isSaveText) {
      const filteredButtons = buttonInteraction.filter(
        (button) => button.step === currentStep
      );
      const selectedButton = filteredButtons[index];
      setTextCollectedList((prevList) => [
        ...prevList,
        {
          index: currentStep,
          text: selectedButton.response,
          source: "RobotNPC",
        },
      ]);

      dataCollectNotify.current.show({
        unstyled: true,
        closable: false,
        life: 2000,
        content: (props) => (
          <div className="flex relative z-[100] rounded-lg px-2.5 py-2 gap-x-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3721/3721819.png"
              className="w-16 h-16 bg-white rounded-xl"
            />
            <div className="">
              <p className="text-2xl font-semibold text-white">
                Data Collected!
              </p>
              <p className="text-lg font-semibold text-white">
                received 1 text file.
              </p>
            </div>
          </div>
        ),
      });
    }

    const filteredButtons = buttonInteraction.filter(
      (button) => button.step === currentStep
    );
    const selectedButton = filteredButtons[index];
    setClearText(true); // Clear the text

    setTimeout(() => {
      setClearText(false); // Set clearText to false after 100 ms
      setCurrentText(selectedButton.response); // Set the new text after 100 ms
      setCurrentStep(selectedButton.step + 1); // Advance to the next step
    }, 200);
  };

  // Check if "Text Note" or "Voice Recorder" is in confirmSelectedItems
  const hasTextNote = confirmSelectedItems.some(
    (item) => item.name === "Text Note"
  );
  const hasVoiceRecorder = confirmSelectedItems.some(
    (item) => item.name === "Voice Recorder"
  );

  const handleRecordAudioChange = (e) => {
    setIsRecordAudio(e.checked);
  };

  const handleSaveTextChange = (e) => {
    setIsSaveText(e.checked);
  };

  return (
    <div className="w-full h-screen bg-black/50 absolute z-50 flex items-center justify-center">
      <div className="max-w-5xl w-full mb-20 flex">
        <Fieldset
          legend="Friendly Worker Bot"
          style={{ paddingBottom: "0" }}
          className="bg-cyan-600/50 border-2 w-full items-center justify-center rounded-3xl"
        >
          <div className="grid grid-cols-5">
            <div className="col-span-2 h-[50vh] -mb-5">
              <img
                src="images/GoodBotProfile.png"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="col-span-3 h-full w-full bg-white/50 rounded-xl border-2 p-4 relative">
              <p className="text-3xl">
                <TypeWriter
                  text={currentText}
                  delay={50}
                  clearText={clearText}
                />
              </p>
              <div>
                {buttonInteraction
                  .filter((button) => button.step === currentStep)
                  .map((button, index) => (
                    <button
                      key={index}
                      className="bg-cyan-400/50 hover:bg-cyan-300/50 border-2 hover:border-cyan-600 border-white rounded-lg p-2 mt-2 w-full text-white"
                      onClick={() => handleButtonClick(index)}
                    >
                      {button.dialog}
                    </button>
                  ))}
              </div>
              <div
                className="flex gap-x-6 bg-cyan-400/50 border-2 rounded-lg py-2 absolute 
                w-[97.5%] px-2 bottom-2 left-2"
              >
                <div className="">
                  <div className="flex">
                    <Checkbox
                      disabled={!hasVoiceRecorder}
                      inputId="recordAudio"
                      name="recordAudio"
                      className="my-auto"
                      checked={isRecordAudio}
                      onChange={handleRecordAudioChange}
                    />
                    <label htmlFor="recordAudio" className="ml-2 text-xl">
                      Record Audio
                    </label>
                  </div>
                  {!hasVoiceRecorder && (
                    <p className="text-sm text-red-500">
                      You don't have a voice recorder.
                    </p>
                  )}
                </div>
                <div className="">
                  <div className="flex">
                    <Checkbox
                      disabled={!hasTextNote}
                      inputId="saveText"
                      name="saveText"
                      className="my-auto"
                      checked={isSaveText}
                      onChange={handleSaveTextChange}
                    />
                    <label htmlFor="saveText" className="ml-2 text-xl">
                      Save Text
                    </label>
                  </div>
                  {!hasTextNote && (
                    <p className="text-sm text-red-500">
                      You don't have a text note.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Fieldset>
      </div>
    </div>
  );
};

export default ChatwithGoodBot;
