import React, { useContext, useState } from 'react'
import Setting from './Setting';
import { GameContext } from '../../../contexts/GameContext';
import { RiSettings5Fill } from "react-icons/ri";

type Props = {}

const HomeMenu: React.FC<Props> = () => {

    const { currentScene, setScene } = useContext(GameContext);
    const [selectedMenu, setSelectedMenu] = useState('main-menu');

    return (
        <>
            {selectedMenu === 'main-menu' &&
                <>
                    <div className='w-full min-h-screen absolute top-0 flex'>
                        <div className='w-1/2 bg-opacity-30 relative'>

                            </div>
                        <div className='w-1/2 flex justify-center items-center'>
                            <div className='text-center'>
                                <div className='flex justify-center'>
                                    <img src='/images/Logo_V1.png' alt='logo' className='w-96 my-10' />
                                </div>
                                <div
                                    id='level-preview-container'
                                    className='w-full my-8 bg-cyan-600 bg-opacity-30 text-white py-6 px-24 rounded-md border-4 border-cyan-800 shadow-lg shadow-white/50 cursor-pointer'
                                    onClick={() => setScene && setScene(currentScene, 'level-selection')}>
                                    <h1 className='text-white text-4xl'>Resume</h1>
                                </div>
                                <div
                                    id='level-preview-container'
                                    className='w-full my-8 bg-cyan-600 bg-opacity-30 text-white py-6 px-24 rounded-md border-4 border-cyan-800 shadow-lg shadow-white/50 cursor-pointer'
                                    onClick={() => setScene && setScene(currentScene, 'level-selection')}>
                                    <h1 className='text-white text-4xl'>New Game</h1>
                                </div>
                                <div
                                    onClick={() => setSelectedMenu('setting')}
                                    id='level-preview-container'
                                    className='w-full my-8 bg-cyan-600 bg-opacity-30 text-white py-6 px-24 rounded-md border-4 border-cyan-800 shadow-lg shadow-white/50 cursor-pointer'>
                                    <h1 className='text-white text-4xl'>Setting</h1>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='w-full absolute bottom-0 py-2 px-4'>
                        <p className='text-white text-lg'>Cybernetic 2024.</p>
                    </div>
                </>}


            {selectedMenu === 'setting' &&
                <Setting setSelectedMenu={setSelectedMenu} />
            }
        </>
    )
}

export default HomeMenu