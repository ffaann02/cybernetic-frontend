import React, { useContext, useState, useEffect } from 'react';
import { GameContext } from '../../../contexts/GameContext';
import { bossAttackPatternsArray } from '../scene-object/BossAttackPattern';
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { Steps } from 'primereact/steps';
import Level5TrainUI from './HologramComputer/Level5TrainUI';
import useAxios from '../../../hooks/useAxios';
import axiosInstanceAiService from '../../../api/aiService';
import ReponseModal from '../../../components/ui/ReponseModal';
import { useLevel5Context } from '../../../contexts/SceneContext/Level5Context';

type Props = {}

const DropdownComponent = ({ label, value, options, onChange }) => (
    <div className='grid grid-cols-4 py-2'>
        <div className='col-span-2 my-auto'>
            <p className='my-auto'>{label}: </p>
        </div>
        <div className='col-span-2 w-[80%]'>
            <select
                value={value}
                onChange={onChange}
                className="bg-gray-700 text-white p-2 rounded w-full">
                {options.map((item, index) => (
                    <option key={index} value={item.value}>{item.name}</option>
                ))}
            </select>
        </div>
    </div>
);

const BossHologramUI = ({ }) => {

    const { axiosFetch } = useAxios();
    const { currentHit, isInteracting } = useContext(GameContext);
    const {
        collectedBossData,
        setCollectedBossData,
        BossAttackPatternPredictModel,
        setBossAttackPatternPredictModel,
        predictionModelChoices,
        isDisplayTrainingModal,
        setIsDisplayTrainingModal,
        trainningResponse,
        setTrainningResponse,
    } = useLevel5Context();
    const [currentTopic, setCurrentTopic] = useState<string>('Information');

    const energySourcesParameter = [...new Set(bossAttackPatternsArray.map(pattern => pattern.energySource))].sort();
    const soundBreathingsParameter = [...new Set(bossAttackPatternsArray.map(pattern => pattern.soundBreathing))].sort();
    const chargingTimesParameter = [...new Set(bossAttackPatternsArray.map(pattern => pattern.chargingTime))].sort((a, b) => a - b);
    const turretsParameter = [...new Set(bossAttackPatternsArray.map(pattern => pattern.lastActiveTurret))].sort();
    const bossHealthParameter = [...new Set(bossAttackPatternsArray.map(pattern => pattern.bossHealth))].sort((a, b) => a - b);

    const energySourcesChoices = energySourcesParameter.map((source) => ({ name: source, value: source }));
    const breathingSoundsChoices = soundBreathingsParameter.map((breathing) => ({ name: breathing, value: breathing }));
    const chargingTimesChoices = chargingTimesParameter.map((time) => ({ name: time, value: time }));
    const turretsChoices = turretsParameter.map((turret) => ({ name: turret, value: turret }));
    const bossHealthChoices = bossHealthParameter.map((health) => ({ name: health, value: health }));

    const [selectedPattern, setSelectedPattern] = useState(bossAttackPatternsArray[0]);

    const [playerAdjustedParameter, setPlayerAdjustedParameter] = useState<any>({});
    const [isPatternFound, setIsPatternFound] = useState(false);

    const trainingSteps = [
        { label: "Data" },
        { label: "Model" },
        { label: "Train" }
    ]
    const [trainActiveIndex, setTrainActiveIndex] = useState(0);
    const [selectedTrainData, setSelectedTrainData] = useState<any>([]);

    const modelList = [
        { name: 'Decision Tree', value: 'decision_tree' },
        { name: 'Random Forest', value: 'random_forest' },
        { name: 'K-Nearest Neighbors', value: 'knn' },
        { name: 'Support Vector Machine', value: 'svm' },
        { name: 'Naive Bayes', value: 'naive_bayes' },
        { name: 'Logistic Regression', value: 'logistic_regression' },
    ]
    const [selectedModel, setSelectedModel] = useState(null);

    const handleTrainModel = async (modelName: string) => {
        console.log("Training model: ", modelName);
        console.log("Collected data: ", collectedBossData);

        try {
            const modifiedCollectedData = collectedBossData.map((data) => {
                return {
                    energySource: data.energySource,
                    soundBreathing: data.soundBreathing,
                    chargingTime: data.chargingTime,
                    lastActiveTurret: data.lastActiveTurret,
                    bossHealth: data.bossHealth,
                    pattern: data.pattern,
                }
            });
            const response = await axiosFetch({
                axiosInstance: axiosInstanceAiService,
                method: "post",
                url: `/classification/train`,
                requestConfig: {
                    userId: "u111362252",
                    model: {
                        name: modelName,
                        targetVariable: "pattern"
                    },
                    data: modifiedCollectedData
                },
            });
            setTrainningResponse({
                isError: false,
                head: "Training Model",
                isAccurate: true,
                title: "Training is successful",
                body: "Your model is trained successfully",
            });
            setIsDisplayTrainingModal(true);
        } catch (error) {
            console.log(error);
            setTrainningResponse({
                isError: true,
                head: "Training Model",
                isAccurate: false,
                title: "Training is failed",
                body: "Your model is failed to train, may be your data is not enough",
            });
            setIsDisplayTrainingModal(true);
        }
    }

    useEffect(() => {
        let isFounded = false;
        bossAttackPatternsArray.map((pattern) => {
            if (isFounded) return;
            else if (!isFounded && pattern.energySource === playerAdjustedParameter.energySource &&
                pattern.soundBreathing === playerAdjustedParameter.soundBreathing &&
                pattern.chargingTime === playerAdjustedParameter.chargingTime &&
                pattern.lastActiveTurret === playerAdjustedParameter.lastActiveTurret) {
                console.log("Pattern found: ", pattern);
                setIsPatternFound(true);
                setSelectedPattern(pattern);
                isFounded = true;
            }
            else {
                setIsPatternFound(false);
            }
        })
    }, [playerAdjustedParameter])

    const handleParameterChange = (property, type) => (e) => {
        if (type === 'number') {
            setPlayerAdjustedParameter((prev) => ({
                ...prev,
                [property]: Number(e.target.value),
            }));
            return;
        }
        setPlayerAdjustedParameter((prev) => ({
            ...prev,
            [property]: e.target.value,
        }));
    };

    // Remove this if you want to keep the player adjusted parameter
    useEffect(() => {
        if (currentHit !== "BossHologramComputer") return;
        setPlayerAdjustedParameter({
            energySource: energySourcesChoices[0].value,
            soundBreathing: breathingSoundsChoices[0].value,
            chargingTime: chargingTimesChoices[0].value,
            lastActiveTurret: turretsChoices[0].value,
            bossHealth: bossHealthChoices[0].value,
        })
    }, [currentHit, isInteracting])

    const handleCollectData = () => {
        setCollectedBossData((prev) => {
            const isDuplicate = prev.some(
                (item) =>
                    item.energySource === playerAdjustedParameter.energySource &&
                    item.soundBreathing === playerAdjustedParameter.soundBreathing &&
                    item.chargingTime === playerAdjustedParameter.chargingTime &&
                    item.lastActiveTurret === playerAdjustedParameter.lastActiveTurret &&
                    item.bossHealth === playerAdjustedParameter.bossHealth
            );

            if (isDuplicate) {
                return prev; // Return the previous state if it's a duplicate
            }

            const data = {
                energySource: playerAdjustedParameter.energySource,
                soundBreathing: playerAdjustedParameter.soundBreathing,
                chargingTime: playerAdjustedParameter.chargingTime,
                lastActiveTurret: playerAdjustedParameter.lastActiveTurret,
                bossHealth: playerAdjustedParameter.bossHealth,
                pattern: selectedPattern.name,
                distribution: selectedPattern.distribution,
            }
            return [...prev, data]; // Add the new parameter if it's not a duplicate
        });
    };

    const handleBackStep = () => {
        if (trainActiveIndex == 0) return;
        setTrainActiveIndex((prev) => prev - 1);
    }

    const handleNextStep = () => {
        if (trainActiveIndex == 2) return;
        setTrainActiveIndex((prev) => prev + 1);
    }

    const handleSelectTrainData = (data) => {
        setSelectedTrainData((prev) => {
            return [...prev, data]; // Add the new parameter if it's not a duplicate
        });
    }

    const handleRemoveTrainData = (data) => {
        setSelectedTrainData((prev) => {
            return prev.filter(item => item.pattern !== data.pattern);
        });
    }

    const handleSelectModel = (model) => {
        setSelectedModel(model);
    }

    return (
        <>
            {isDisplayTrainingModal && trainningResponse &&
                <ReponseModal
                    isError={trainningResponse.isError}
                    head={trainningResponse.head}
                    isAccurate={trainningResponse.isAccurate}
                    title={trainningResponse.title}
                    body={trainningResponse.body}
                    onClose={() => {
                        setIsDisplayTrainingModal(false)
                        setTrainningResponse(null)
                    }}
                    onConfirm={() => {
                        setIsDisplayTrainingModal(false)
                        setTrainningResponse(null)
                    }}
                />}
            {currentHit === "BossHologramComputer" && isInteracting && (
                <div className='absolute w-full h-full z-[10000] flex justify-center'>
                    <div className='flex justify-center items-center max-w-7xl py-32 gap-x-4 relative '>
                        <div
                            style={{ backdropFilter: 'blur(8px)' }}
                            className='min-w-[1280px] max-w-6xl h-[80vh] rounded-xl border-4 border-white shadow-lg shadow-white overflow-y-scroll'>
                            <div className='text-white'>
                                <div className='bg-cyan-600 p-4 sticky top-0 z-50'>
                                    <h1 className='text-center text-3xl font-bold'>Boss Behavior Analysis</h1>
                                    <div className='flex pt-4 pl-2 gap-2'>
                                        <h2 className={`text-center text-xl border rounded-md px-4 py-1 cursor-pointer 
                                            ${currentTopic === "Information" ? "bg-cyan-800/60" : "hover:bg-cyan-800/60"}`}
                                            onClick={() => setCurrentTopic("Information")}>Information</h2>
                                        <h2 className={`text-center text-xl border rounded-md px-4 py-1 cursor-pointer 
                                            ${currentTopic === "Parameter" ? "bg-cyan-800/60" : "hover:bg-cyan-800/60"}`}
                                            onClick={() => setCurrentTopic("Parameter")}>Parameter</h2>
                                        <h2 className={`text-center text-xl border rounded-md px-4 py-1 cursor-pointer 
                                            ${currentTopic === "Collected" ? "bg-cyan-800/60" : "hover:bg-cyan-800/60"}`}
                                            onClick={() => setCurrentTopic("Collected")}>Collected</h2>
                                        <h2 className={`text-center text-xl border rounded-md px-4 py-1 cursor-pointer 
                                            ${currentTopic === "Train" ? "bg-cyan-800/60" : "hover:bg-cyan-800/60"}`}
                                            onClick={() => setCurrentTopic("Train")}>Train</h2>
                                    </div>
                                </div>
                                <div className='mx-6 my-6'>
                                    {currentTopic === 'Information' && (
                                        <>
                                            <h3 className='text-xl'>Boss Overview</h3>
                                            <p className='mt-2'>
                                                The boss you are facing is a formidable foe, It has a laser attack in many different patterns. To defeat the boss, you must analyze its behavior and attack patterns to anticipate its moves and counter them effectively.
                                            </p>
                                            <h2 className='mt-4 text-xl'>Action State</h2>
                                            <ul className='mt-2 ml-4 list-disc list-inside'>
                                                <li><strong>Idle:</strong> The boss will idle and make a breathing sound, this moment will give you a change for attack.</li>
                                                <li><strong>Charging:</strong> Boss will take a little time before bursting.</li>
                                                <li><strong>Bursting(Attack):</strong>Firing many laser object from the top with different pattern.</li>
                                            </ul>
                                            <p className='mt-4'>
                                                By analyzing the boss's energy source, breathing sound, and charging time, you can predict its next attack pattern and plan your strategy accordingly. Stay vigilant and adapt to the boss's changing tactics to defeat it.
                                            </p>
                                        </>
                                    )}

                                    {currentTopic === 'Parameter' && (
                                        <>
                                            <div className='relative w-full h-full'>
                                                <div className='grid grid-cols-12 gap-x-6'>
                                                    <div className='col-span-6'>
                                                        <h2></h2>
                                                        <DropdownComponent
                                                            label='Energy Sources'
                                                            value={playerAdjustedParameter.energySource}
                                                            options={energySourcesChoices}
                                                            onChange={handleParameterChange('energySource')}
                                                        />
                                                        <DropdownComponent
                                                            label='Breathing Sound'
                                                            value={playerAdjustedParameter.soundBreathing}
                                                            options={breathingSoundsChoices}
                                                            onChange={handleParameterChange('soundBreathing')}
                                                        />
                                                        <DropdownComponent
                                                            label='Charging Time'
                                                            value={playerAdjustedParameter.chargingTime}
                                                            options={chargingTimesChoices}
                                                            onChange={handleParameterChange('chargingTime', 'number')}
                                                        />
                                                        <DropdownComponent
                                                            label='Last Active Turret'
                                                            value={playerAdjustedParameter.lastActiveTurret}
                                                            options={turretsChoices}
                                                            onChange={handleParameterChange('lastActiveTurret')}
                                                        />
                                                        <DropdownComponent
                                                            label='Boss Health'
                                                            value={playerAdjustedParameter.bossHealth}
                                                            options={bossHealthChoices}
                                                            onChange={handleParameterChange('bossHealth', 'number')}
                                                        />
                                                    </div>
                                                    <div className='col-span-6 mt-2'>
                                                        <div className='w-full h-full px-2'>
                                                            <div className='grid grid-cols-10 grid-rows-6 gap-1'>
                                                                {isPatternFound ?
                                                                    <>
                                                                        {selectedPattern.distribution.flat().map((isBurst, index) => (
                                                                            <div
                                                                                key={index}
                                                                                className={`border border-gray-400 aspect-square ${isBurst ? 'bg-red-400' : 'bg-gray-300/90'}`}
                                                                            ></div>
                                                                        ))}
                                                                    </>
                                                                    :
                                                                    <>
                                                                        {selectedPattern.distribution.flat().map((isBurst, index) => (
                                                                            <div
                                                                                key={index}
                                                                                className={`border border-gray-400 aspect-square bg-gray-600/90`}
                                                                            ></div>
                                                                        ))}
                                                                    </>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className='mt-4 text-yellow-400'>Guide: If you adjusted until the right value, the attack pattern will display, then you can collect as a trainning data to predict boss's attack!</p>
                                                <div className='mt-4 mr-4 text-right'>
                                                    <button className={`border p-2 rounded-md 
                                                        ${isPatternFound ? "cursor-pointer text-white border-white bg-cyan-400/60 hover:bg-cyan-400/40" : "cursor-not-allowed text-slate-400 border-slate-400"}`}
                                                        disabled={!isPatternFound}
                                                        onClick={handleCollectData}>
                                                        <span>Collect Data</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {(currentTopic === 'Collected' && collectedBossData) &&
                                        <>
                                            {collectedBossData.length > 0
                                                ?
                                                <>
                                                    <h2 className='text-xl mb-4'>Collected Data</h2>
                                                    <div className='mt-2'>
                                                        {collectedBossData.map((data, index) => (
                                                            <div key={index} className='grid grid-cols-6 border border-gray-400 rounded-md my-4'>
                                                                <div className='col-span-2'>
                                                                    <h3 className='text-xl mt-4 ml-4'>Attack Pattern:<strong className='ml-2'>{data.pattern}</strong></h3>
                                                                    <ul className='ml-6 my-4 list-disc list-inside text-lg'>
                                                                        <li>Energy Source: <strong>{data.energySource}</strong></li>
                                                                        <li>Breathing Sound: <strong>{data.soundBreathing}</strong></li>
                                                                        <li>Charging Time: <strong>{data.chargingTime}</strong></li>
                                                                        <li>Last Active Turret: <strong>{data.lastActiveTurret}</strong></li>
                                                                        <li>Boss Health: <strong>{data.bossHealth}</strong></li>
                                                                    </ul>
                                                                </div>
                                                                <div className='col-span-4 p-2 mt-2 mr-2'>
                                                                    <div className='w-full h-full flex justify-end'>
                                                                        <div className='grid grid-cols-10 grid-rows-6 gap-1'>
                                                                            {data.distribution.flat().map((isBurst, index) => (
                                                                                <div
                                                                                    key={index}
                                                                                    className={`border border-gray-400 aspect-square ${isBurst ? 'bg-red-400' : 'bg-gray-300/90'}`}
                                                                                ></div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                                :
                                                <>
                                                    <h2 className='text-xl'>No data collected.</h2>
                                                    <p className='text-yellow-400'>Guide: You have to find attck pattern of boss by tune boss behavior parameter.</p>
                                                </>
                                            }
                                        </>
                                    }
                                    {currentTopic === 'Train' &&
                                        <Level5TrainUI
                                            trainingSteps={trainingSteps}
                                            handleBackStep={handleBackStep}
                                            handleNextStep={handleNextStep}
                                            trainActiveIndex={trainActiveIndex}
                                            setTrainActiveIndex={setTrainActiveIndex}
                                            collectedBossData={collectedBossData}
                                            selectedTrainData={selectedTrainData}
                                            handleSelectTrainData={handleSelectTrainData}
                                            handleRemoveTrainData={handleRemoveTrainData}
                                            modelList={modelList}
                                            selectedModel={selectedModel}
                                            handleSelectModel={handleSelectModel}
                                            BossAttackPatternPredictModel={BossAttackPatternPredictModel}
                                            setBossAttackPatternPredictModel={setBossAttackPatternPredictModel}
                                            handleTrainModel={handleTrainModel}
                                            predictionModelChoices={predictionModelChoices}
                                        />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            )}
        </>
    )
}

export default BossHologramUI;