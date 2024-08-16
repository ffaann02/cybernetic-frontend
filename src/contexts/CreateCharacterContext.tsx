import React, { createContext, useState } from "react";
import { Choice } from "../components/ui/create-character/ToolsBar";

export interface Character {
    skin: Choice;
    face: Choice;
    shirt: Choice;
    pants: Choice;
    shoes: Choice;
}

interface CreateCharacterContextProps {
  character: Character | null;
  setCharacter: (character: Character | null) => void;
  choices: any;
  setChoices: (choices: any) => void;
}

export const CreateCharacterContext =
  createContext<CreateCharacterContextProps>({
    character: null,
    setCharacter: () => {},
    choices: {},
    setChoices: () => {}
  });

export const CreateCharacterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [choices ,setChoices] = useState<any>({
    head: 1,
    body: 1,
    top_left_arm: 1,
    bottom_left_arm: 1,
    top_left_leg: 1,
    bottom_left_leg: 1,
    top_right_arm: 1,
    bottom_right_arm: 1,
    top_right_leg: 1,
    bottom_right_leg: 1
  });

  return (
    <CreateCharacterContext.Provider value={{ character, setCharacter, choices, setChoices }}>
      {children}
    </CreateCharacterContext.Provider>
  );
};
