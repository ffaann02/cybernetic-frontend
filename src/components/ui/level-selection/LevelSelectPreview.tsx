import React, { useContext } from 'react'
import { LevelDetail } from '../../../contexts/SceneContext/LevelContext';
import { GameContext } from '../../../contexts/GameContext'
import { MdGamepad } from "react-icons/md";
import { GiPreviousButton, GiNextButton } from "react-icons/gi";
import { UserLevel } from '../../../non-gameplay-scene/LevelSelection';
import { RiSettings3Fill } from "react-icons/ri";
import { TiHome } from "react-icons/ti";

interface Props {
    levels: LevelDetail[];
    currentLevel: LevelDetail;
    setCurrentLevel: any;
    userLevels: UserLevel;
}

const LevelSelectPreview: React.FC<Props> = ({ levels, currentLevel, setCurrentLevel, userLevels }) => {

    const { currentScene, setScene } = useContext(GameContext);

    const navigateToLevel = (level: LevelDetail) => {
        console.log(level);
        if (setScene) {
            console.log(`game-level-${level.levelNumber}`);
            setScene(currentScene, `game-level-${level.levelNumber}`);
        }
    }

    const isLevelUnlocked = (levelNumber: number) => {
        console.log(userLevels);
        if (levelNumber === 1) {
            return true; // Level 1 is always unlocked
        }
        if (!userLevels || userLevels.levelPlayed.length === 0) {
            return false; // No levels are played, so other levels are locked
        }
        const playedLevels = userLevels.levelPlayed.map(Number);
        return playedLevels.includes(levelNumber - 1);
    };

    const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_LINK;
    // const path = `/scene_environments/items/scene_name/${name}.gltf`;
    const path = `/assets/level-selection/level-1-image.jpg`;
    const url = `${storageBucket}${path}`;
    console.log(url);

    return (
        <div className='w-full min-h-screen absolute top-0 flex'>
            <div className='w-3/5 bg-opacity-30 h-min'>
                <div className='flex justify-start m-8 gap-4'>
                    <div 
                        id='level-preview-container' 
                        className='w-min p-4 bg-cyan-600 bg-opacity-30 rounded-md border-4 border-cyan-800'
                        onClick={() => setScene&& setScene(currentScene, 'home')}>
                        <TiHome className='text-white text-4xl' />
                    </div>
                    <div 
                        id='level-preview-container' 
                        className='w-min p-4 bg-cyan-600 bg-opacity-30 rounded-md border-4 border-cyan-800'
                        onClick={() => setScene&& setScene(currentScene, 'home')}>
                        <RiSettings3Fill className='text-white text-4xl' />
                    </div>
                </div>
            </div>
            <div className='w-2/5 flex items-center mr-24'>
                <div id='level-preview-container' className='w-full bg-cyan-600 bg-opacity-30 text-white p-12 rounded-md border-4 border-cyan-800 shadow-lg shadow-white/50'>
                    <h1 className='text-3xl mx-auto text-center font-medium text-white'>
                        {currentLevel.levelName} (Level{currentLevel.levelNumber})
                    </h1>
                    <div className='w-full my-8'>
                        <img src={url} className='w-96 h-auto mx-auto ' />
                    </div>
                    {currentLevel.description && currentLevel.description.length > 0 &&
                        <div className='mt-4'>
                            {currentLevel.description.map((desc, index) => (
                                <div key={index} className='my-4 p-4 border rounded-md'>
                                    <h2 className='text-lg font-medium'>{desc.head}</h2>
                                    <p className='text-md'>{desc.content}</p>
                                </div>
                            ))}
                        </div>}

                    <div className='flex justify-center gap-4 mt-8'>
                        {currentLevel.levelNumber > 1 &&
                            <div className='border bg-white bg-opacity-25 my-auto p-2 rounded-md flex cursor-pointer'
                                onClick={() => setCurrentLevel(levels[currentLevel.levelNumber - 2])}>
                                <GiPreviousButton className='text-white text-4xl' />
                                <p className='text-white text-2xl my-auto mx-2'>Previous Level</p>
                            </div>
                        }

                        <div className={`border my-auto p-2 rounded-md flex
                        ${currentLevel.isActive
                                ? (isLevelUnlocked(currentLevel.levelNumber)
                                    ? 'bg-cyan-500 hover:bg-cyan-600 cursor-pointer'
                                    : ' bg-black bg-opacity-15 text-slate-400 cursor-not-allowed border-slate-400')
                                : 'bg-black bg-opacity-5 text-slate-400 cursor-not-allowed border-slate-400'}`}
                            onClick={() => navigateToLevel(currentLevel)}>
                            <MdGamepad className=' text-4xl' />
                            <p className={`text-2xl my-auto mx-2`}>Play</p>
                        </div>

                        <div className='border bg-white bg-opacity-25 my-auto p-2 rounded-md flex cursor-pointer'
                            onClick={() => setCurrentLevel(levels[currentLevel.levelNumber])}>
                            <p className='text-white text-2xl my-auto mx-2'>Next Level</p>
                            <GiNextButton className='text-white text-4xl' />
                        </div>
                    </div>
                </div>
            </div>
            {/* Grid layout */}
            {/* <div className="min-h-screen flex flex-col items-center justify-center  text-white">
                <h1 className="text-4xl font-bold mb-8 text-cyan-600">Level Selection</h1>
                <div className="grid grid-cols-4 gap-4 mb-8">
                    {levels.map(level => (
                        <button
                            key={level.id}
                            onClick={() => isLevelUnlocked(level.levelNumber) && navigateToLevel(level)}
                            className={`flex items-center justify-center w-16 h-16 rounded-lg shadow-lg 
                            ${level.isActive ?
                                    (isLevelUnlocked(level.levelNumber)
                                        ? 'bg-cyan-500 hover:bg-cyan-600'
                                        : 'bg-gray-500 cursor-not-allowed') : 'bg-gray-500 cursor-not-allowed'}`}
                            disabled={!isLevelUnlocked(level.levelNumber)}
                        >
                            {level.isActive ? (
                                <span className="text-2xl font-bold">{level.levelNumber}</span>
                            ) : (
                                <span className="text-2xl font-bold">?</span>
                            )}
                        </button>
                    ))}
                </div>
            </div> */}
        </div>
    )
}

export default LevelSelectPreview