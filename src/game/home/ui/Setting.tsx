import React, { useContext, useState } from 'react'
import { Slider } from "primereact/slider";
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { SettingContext } from '../../../contexts/SettingContext';
import SettingDropdonwn from './SettingDropdown';

interface SettingProps {
    setSelectedMenu: (menu: string) => void;
}

interface DropdownObject {
    name: string;
    code: string;
}

const Setting: React.FC<SettingProps> = ({ setSelectedMenu }) => {

    const {
        musicVolume, setMusicVolume,
        soundEffectVolume, setSoundEffectVolume,
        forwardButton, setForwardButton,
        backwardButton, setBackwardButton,
        leftButton, setLeftButton,
        rightButton, setRightButton,
        jumpButton, setJumpButton,
        inventoryButton, setInventoryButton,
        computerButton, setComputerButton,
        itemSlot1Button, setItemSlot1Button,
        itemSlot2Button, setItemSlot2Button,
        itemSlot3Button, setItemSlot3Button
    } = useContext(SettingContext);

    const keyboardButtons: DropdownObject[] = [
        { name: 'W', code: 'W' },
        { name: 'A', code: 'A' },
        { name: 'S', code: 'S' },
        { name: 'D', code: 'D' },
        { name: 'Space', code: 'Space' }
    ];


    return (
        <div className='w-full min-h-screen absolute top-0 flex justify-center items-center'>
            <div id='level-preview-container' className='w-[90%] h-[90%] shadow-lg shadow-white/50 cursor-pointer rounded-md border-4 border-cyan-800'>
                <div className='w-full flex justify-center gap-4 py-4 text-white  bg-cyan-500 bg-opacity-50 '>
                    <h1 className='text-white text-4xl font-medium'>Game Settings</h1>
                </div>

                <div className='w-full p-12 text-white bg-cyan-600 bg-opacity-50 border-cyan-800'>
                    <div className='grid grid-cols-5 gap-12'>

                        {/* Audio */}
                        <div className='col-span-3'>
                            <h2 className='text-3xl mb-4 font-medium'>Audio</h2>
                            <div className='grid grid-cols-5'>
                                <div className='col-span-1 my-auto py-4'>
                                    <h3 className='text-2xl'>Music</h3>
                                </div>
                                <div className='col-span-4 my-auto py-4'>
                                    <div className="card flex justify-content-center">
                                        <Slider value={musicVolume} onChange={(e: any) => setMusicVolume(e.value)} className="w-full my-auto" />
                                    </div>
                                </div>
                                <div className='col-span-1 my-auto py-4'>
                                    <h2 className='text-2xl'>Sound Effect</h2>
                                </div>
                                <div className='col-span-4 my-auto py-4'>
                                    <div className="card flex justify-content-center">
                                        <Slider value={soundEffectVolume} onChange={(e: any) => setSoundEffectVolume(e.value)} className="w-full my-auto" />
                                    </div>
                                </div>
                            </div>

                            <h2 className='text-3xl mt-8 mb-4 font-medium'>Key Bindings</h2>
                            <div className='grid grid-cols-5'>
                                <SettingDropdonwn label="Inventory" placeholder={inventoryButton} value={inventoryButton} options={keyboardButtons} onChange={(e) => setInventoryButton(e.value)} />
                                <SettingDropdonwn label="Computer" placeholder={computerButton} value={computerButton} options={keyboardButtons} onChange={(e) => setComputerButton(e.value)} />
                                <SettingDropdonwn label="Item Slot 1" placeholder={itemSlot1Button} value={itemSlot1Button} options={keyboardButtons} onChange={(e) => setItemSlot1Button(e.value)} />
                                <SettingDropdonwn label="Item Slot 2" placeholder={itemSlot2Button} value={itemSlot2Button} options={keyboardButtons} onChange={(e) => setItemSlot2Button(e.value)} />
                                <SettingDropdonwn label="Item Slot 3" placeholder={itemSlot3Button} value={itemSlot3Button} options={keyboardButtons} onChange={(e) => setItemSlot3Button(e.value)} />
                            </div>
                        </div>

                        {/* Control */}
                        <div className='col-span-2 relative'>
                            <h2 className='text-3xl mb-4 font-medium my-auto'>Control</h2>
                            <div className='grid grid-cols-5'>
                                <div className='col-span-2 my-auto py-4'>
                                    <h3 className='text-2xl'>Mouse sentivity</h3>
                                </div>
                                <div className='col-span-3 my-auto py-4'>
                                    <div className="card flex justify-content-center">
                                        <Slider value={musicVolume} onChange={(e: any) => setMusicVolume(e.value)} className="w-full my-auto" />
                                    </div>
                                </div>
                                <SettingDropdonwn label="Forward" placeholder={forwardButton} value={forwardButton} options={keyboardButtons} onChange={(e) => setForwardButton(e.value)} />
                                <SettingDropdonwn label="Backward" placeholder={backwardButton} value={backwardButton} options={keyboardButtons} onChange={(e) => setBackwardButton(e.value)} />
                                <SettingDropdonwn label="Left" placeholder={leftButton} value={leftButton} options={keyboardButtons} onChange={(e) => setLeftButton(e.value)} />
                                <SettingDropdonwn label="Right" placeholder={rightButton} value={rightButton} options={keyboardButtons} onChange={(e) => setRightButton(e.value)} />
                                <SettingDropdonwn label="Jump" placeholder={jumpButton} value={jumpButton} options={keyboardButtons} onChange={(e) => setJumpButton(e.value)} />
                            </div>
                            <div className='absolute bottom-0 right-0'>
                                <div className='w-full flex justify-end gap-4 pt-12'>
                                    <button className='px-8 py-2 rounded-md border border-white' onClick={() => setSelectedMenu('main-menu')}>
                                        <h1 className='text-white text-xl'>Cancle</h1>
                                    </button>
                                    <button className='px-8 py-2 rounded-md border border-white' onClick={() => setSelectedMenu('main-menu')}>
                                        <h1 className='text-white text-xl'>Reset</h1>
                                    </button>
                                    <button className='px-8 py-2 rounded-md bg-cyan-500 border border-cyan-500' onClick={() => setSelectedMenu('main-menu')}>
                                        <h1 className='text-white text-xl'>Save</h1>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Setting