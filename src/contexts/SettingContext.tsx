import React, { createContext, useState } from 'react'

interface SettingContextProps {
    musicVolume: number;
    setMusicVolume: (volume: number) => void;
    soundEffectVolume: number;
    setSoundEffectVolume: (volume: number) => void;
    forwardButton: string;
    setForwardButton: (button: string) => void;
    backwardButton: string;
    setBackwardButton: (button: string) => void;
    leftButton: string;
    setLeftButton: (button: string) => void;
    rightButton: string;
    setRightButton: (button: string) => void;
    jumpButton: string;
    setJumpButton: (button: string) => void;
    inventoryButton: string;
    setInventoryButton: (button: string) => void;
    computerButton: string;
    setComputerButton: (button: string) => void;
    itemSlot1Button: string;
    setItemSlot1Button: (button: string) => void;
    itemSlot2Button: string;
    setItemSlot2Button: (button: string) => void;
    itemSlot3Button: string;
    setItemSlot3Button: (button: string) => void;
}

const initialSettingContext: SettingContextProps = {
    musicVolume: 25,
    setMusicVolume: () => { },
    soundEffectVolume: 50,
    setSoundEffectVolume: () => { },
    forwardButton: 'W',
    setForwardButton: () => { },
    backwardButton: 'S',
    setBackwardButton: () => { },
    leftButton: 'A',
    setLeftButton: () => { },
    rightButton: 'D',
    setRightButton: () => { },
    jumpButton: 'Space',
    setJumpButton: () => { },
    inventoryButton: 'I',
    setInventoryButton: () => { },
    computerButton: 'E',
    setComputerButton: () => { },
    itemSlot1Button: 'J',
    setItemSlot1Button: () => { },
    itemSlot2Button: 'K',
    setItemSlot2Button: () => { },
    itemSlot3Button: 'L',
    setItemSlot3Button: () => { },
}

export const SettingContext = createContext<SettingContextProps>(initialSettingContext);

export const SettingProvider = ({ children }: { children: React.ReactNode }) => {

    const [musicVolume, setMusicVolume] = useState<number>(initialSettingContext.musicVolume);
    const [soundEffectVolume, setSoundEffectVolume] = useState<number>(initialSettingContext.soundEffectVolume);

    const [forwardButton, setForwardButton] = useState<string>('W');
    const [backwardButton, setBackwardButton] = useState<string>('S');
    const [leftButton, setLeftButton] = useState<string>('A');
    const [rightButton, setRightButton] = useState<string>('D');
    const [jumpButton, setJumpButton] = useState<string>('Space');

    const [inventoryButton, setInventoryButton] = useState<string>('I');
    const [computerButton, setComputerButton] = useState<string>('E');
    const [itemSlot1Button, setItemSlot1Button] = useState<string>('J');
    const [itemSlot2Button, setItemSlot2Button] = useState<string>('K');
    const [itemSlot3Button, setItemSlot3Button] = useState<string>('L');

    const value = {
        musicVolume,
        setMusicVolume,
        soundEffectVolume,
        setSoundEffectVolume,
        forwardButton,
        setForwardButton,
        backwardButton,
        setBackwardButton,
        leftButton,
        setLeftButton,
        rightButton,
        setRightButton,
        jumpButton,
        setJumpButton,
        inventoryButton,
        setInventoryButton,
        computerButton,
        setComputerButton,
        itemSlot1Button,
        setItemSlot1Button,
        itemSlot2Button,
        setItemSlot2Button,
        itemSlot3Button,
        setItemSlot3Button
    }

    return (
        <SettingContext.Provider value={value}> {children} </SettingContext.Provider>
    )
}