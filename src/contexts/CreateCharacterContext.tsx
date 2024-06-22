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
}

export const CreateCharacterContext =
  createContext<CreateCharacterContextProps>({
    character: null,
    setCharacter: () => {},
  });

export const CreateCharacterProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [character, setCharacter] = useState<Character | null>(null);

  return (
    <CreateCharacterContext.Provider value={{ character, setCharacter }}>
      {children}
    </CreateCharacterContext.Provider>
  );
};
