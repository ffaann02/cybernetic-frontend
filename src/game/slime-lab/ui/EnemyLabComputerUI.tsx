import React, { useContext, useEffect, useState } from 'react';
import { GameContext } from '../../../contexts/GameContext';
import useAxios from '../../../hooks/useAxios';
import axiosInstanceAiService from '../../../api/aiService';
import ReponseModal from '../../../components/ui/ReponseModal';

const DropdownComponent = ({ label, value, options, onChange }) => (
    <div className='grid grid-cols-4 my-2 ml-1'>
        <div className='col-span-2 my-auto'>
            <p className='my-auto font-medium'>{label}: </p>
        </div>
        <div className='col-span-2 w-[100%]'>
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

const EnemyLabComputerUI = ({
    selectedEnemy,
    setSelectedEnemy,
    enemyNameChoices,
    enemyColorChoices,
    predictionModelChoices,
    collectedEnemyData,
    setCollectedEnemyData,
}) => {

    const { currentHit, isUsingSecurityCamera } = useContext(GameContext);
    const { axiosFetch } = useAxios();

    const elementChoicesDropdown = [
        { name: "fire", value: "fire" },
        { name: "water", value: "water" },
        { name: "earth", value: "earth" },
        { name: "air", value: "air" },
        { name: "lightning", value: "lightning" },
    ];
    const weaknessChoices = [
        { name: "fire", value: "fire" },
        { name: "water", value: "water" },
        { name: "earth", value: "earth" },
        { name: "air", value: "air" },
        { name: "lightning", value: "lightning" },
    ];
    const sizeChoices = [
        { name: "tiny", value: "tiny" },
        { name: "small", value: "small" },
        { name: "medium", value: "medium" },
        { name: "large", value: "large" },
    ];
    const speedChoices = Array.from({ length: 10 }, (_, i) => ({ name: i + 1, value: i + 1 }));

    const [currentPredictionModel, setCurrentPredictionModel] = useState(predictionModelChoices[0]);
    const [isDisplayModal, setIsDisplayModal] = useState(false);
    const [predictionResponse, setPredictionResponse] = useState(null);

    const elementChoices = ["fire", "water", "earth", "air", "lightning"];
    const elementColorMap = {
        fire: ['red', 'orange'],
        water: ['cyan'],
        earth: ['green'],
        air: ['white'],
        lightning: ['yellow'],
    }
    const slimeElementSpeedMap = {
        fire: [3, 4, 5], // Generally faster
        water: [1, 2], // Generally slower
        earth: [2, 3], // Medium speed
        air: [4, 5], // Generally faster
        lightning: [3, 4, 5] // Generally faster
    };
    const slimeSizeChoices = ["tiny", "small", "medium"];
    const spiderElementSpeedMap = {
        fire: [3, 4, 5], // Generally faster
        water: [1, 2], // Generally slower
        earth: [2, 3], // Medium speed
        air: [4, 5], // Generally faster
        lightning: [3, 4, 5] // Generally faster
    };
    const spiderSizeChoices = ["tiny", "small", "medium"];
    const golemElementSpeedMap = {
        fire: [3, 4, 5], // Generally faster
        water: [1, 2], // Generally slower
        earth: [2, 3], // Medium speed
        air: [4, 5], // Generally faster
        lightning: [3, 4, 5] // Generally faster
    };
    const golemSizeChoices = ["medium", "large", "huge"];
    const randomParameter = (enemyName: string) => {
        if (enemyName === "Slime") {
            const randomElement = elementChoices[Math.floor(Math.random() * elementChoices.length)]
            const randomSpeed = slimeElementSpeedMap[randomElement][Math.floor(Math.random() * slimeElementSpeedMap[randomElement].length)]
            const randomColor = elementColorMap[randomElement][Math.floor(Math.random() * elementColorMap[randomElement].length)]
            const randomSize = slimeSizeChoices[Math.floor(Math.random() * slimeSizeChoices.length)]
            return {
                name: enemyName,
                element: randomElement,
                speed: randomSpeed,
                color: randomColor,
                size: randomSize
            }
        }
        else if (enemyName === "Spider") {
            const randomElement = elementChoices[Math.floor(Math.random() * elementChoices.length)]
            const randomSpeed = spiderElementSpeedMap[randomElement][Math.floor(Math.random() * spiderElementSpeedMap[randomElement].length)]
            const randomColor = elementColorMap[randomElement][Math.floor(Math.random() * elementColorMap[randomElement].length)]
            const randomSize = spiderSizeChoices[Math.floor(Math.random() * spiderSizeChoices.length)]
            return {
                name: enemyName,
                element: randomElement,
                speed: randomSpeed,
                color: randomColor,
                size: randomSize
            }
        }
        else if (enemyName === "Golem") {
            const randomElement = elementChoices[Math.floor(Math.random() * elementChoices.length)]
            const randomSpeed = golemElementSpeedMap[randomElement][Math.floor(Math.random() * golemElementSpeedMap[randomElement].length)]
            const randomColor = elementColorMap[randomElement][Math.floor(Math.random() * elementColorMap[randomElement].length)]
            const randomSize = golemSizeChoices[Math.floor(Math.random() * golemSizeChoices.length)]
            return {
                name: enemyName,
                element: randomElement,
                speed: randomSpeed,
                color: randomColor,
                size: randomSize
            }
        }
    }

    const handleRandomParameter = () => {
        setSelectedEnemy(randomParameter(selectedEnemy.name));
    }

    const handlePredict = async () => {
        const modelName = currentPredictionModel.value;
        console.log("Predict model: ", modelName);
        try {
            const modifiedCollectedData = {
                element: selectedEnemy.element,
                color: selectedEnemy.color,
                size: selectedEnemy.size,
                speed: selectedEnemy.speed,
            };
            const response = await axiosFetch({
                axiosInstance: axiosInstanceAiService,
                method: "post",
                url: `/classification/predict`,
                requestConfig: {
                    userId: "u111362252",
                    model: {
                        name: modelName,
                        targetVariable: "weakness"
                    },
                    data: modifiedCollectedData
                },
            });
            console.log(response);
            if (response.weakness === selectedEnemy.weakness) {
                setPredictionResponse({
                    isError: false,
                    model: currentPredictionModel.name,
                    predictResult: response.weakness,
                    actualResult: selectedEnemy.weakness,
                    accurate: true
                })
            }
            else {
                setPredictionResponse({
                    isError: false,
                    model: currentPredictionModel.name,
                    predictResult: response.weakness,
                    actualResult: selectedEnemy.weakness,
                    accurate: false
                })
            }
            setIsDisplayModal(true);
        } catch (error) {
            setPredictionResponse({
                isError: true,
                model: currentPredictionModel.name,
                result: null
            })
            setIsDisplayModal(true);
            if (error.response) {
                console.log('Error Response Data:', error.response.data);
                console.log('Error Response Status:', error.response.status);
            }
        }
    }

    return (
        <>
            {isDisplayModal && predictionResponse &&
                <ReponseModal
                    isError={false}
                    isAccurate={predictionResponse.accurate}
                    head="Prediction Result"
                    title={predictionResponse.accurate ? "Prediction is correct" : "Prediction is not correct"}
                    body={predictionResponse
                        ? `Prediction Result: ${predictionResponse.predictResult},   Actual Result: ${predictionResponse.actualResult}`
                        : "No prediction result"}
                    onClose={() => {
                        setIsDisplayModal(false)
                        setPredictionResponse(null)
                    }}
                    onConfirm={() => {
                        setIsDisplayModal(false)
                        setPredictionResponse(null)
                    }}
                />
            }
            {currentHit === "ComputerEnemyLab" && isUsingSecurityCamera &&
                <div className='absolute w-[95%] h-full z-[10000] flex justify-end'>
                    <div className='flex justify-center items-center max-w-7xl py-32 gap-x-4 relative '>
                        <div
                            style={{ backdropFilter: 'blur(8px)' }}
                            className='min-w-[960px] max-w-6xl h-[80vh] rounded-xl border-4 border-white shadow-md shadow-white overflow-y-auto'>
                            <div className='bg-cyan-400/50 py-4'>
                                <h1 className='text-center text-3xl font-bold text-white'>Predict Enemy Weakness</h1>
                            </div>
                            <div className='p-6'>
                                <div className='flex justify-between'>
                                    <p className='text-white text-lg mb-1'>Parameters</p>
                                    <p 
                                        className='text-cyan-400 font-semibold underline text-lg mb-1 mr-1 cursor-pointer'
                                        onClick={handleRandomParameter}>Random Parameters
                                    </p>
                                </div>
                                <div className='text-white px-4 py-2 bg-black/40 border rounded-md overflow-auto'>
                                    <div className='h-full'>
                                        <DropdownComponent
                                            label="Name"
                                            value={selectedEnemy?.name}
                                            options={enemyNameChoices.map((name) => ({ name, value: name }))}
                                            onChange={(e) => setSelectedEnemy({ ...selectedEnemy, name: e.target.value })}
                                        />
                                        <DropdownComponent
                                            label="Color"
                                            value={selectedEnemy?.color}
                                            options={enemyColorChoices.map((color) => ({ name: color, value: color }))}
                                            onChange={(e) => setSelectedEnemy({ ...selectedEnemy, color: e.target.value })}
                                        />
                                        <DropdownComponent
                                            label="Element"
                                            value={selectedEnemy?.element}
                                            options={elementChoicesDropdown}
                                            onChange={(e) => setSelectedEnemy({ ...selectedEnemy, element: e.target.value })}
                                        />
                                        <DropdownComponent
                                            label="Size"
                                            value={selectedEnemy?.size}
                                            options={sizeChoices}
                                            onChange={(e) => setSelectedEnemy({ ...selectedEnemy, size: e.target.value })}
                                        />
                                        <DropdownComponent
                                            label="Speed"
                                            value={selectedEnemy?.speed}
                                            options={speedChoices}
                                            onChange={(e) => setSelectedEnemy({ ...selectedEnemy, speed: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <p className='text-white text-lg mt-4 mb-1'>Target(Weakness)</p>
                                <div className='text-white px-4 py-2 bg-black/40 border rounded-md overflow-auto'>
                                    <div className='h-full'>
                                        <DropdownComponent
                                            label="Weakness"
                                            value={selectedEnemy?.weakness}
                                            options={weaknessChoices}
                                            onChange={(e) => setSelectedEnemy({ ...selectedEnemy, weakness: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <p className='text-white text-lg mt-4'>Version Model</p>
                                <p className='text-yellow-400 text-sm mb-1'>Note: Your Mine Lander(Skill L) will base on model v1</p>
                                <div className='p-2 rounded-md border text-white bg-black/50'>
                                    <div className='ml-3 mr-4'>
                                        <DropdownComponent
                                            label="Prediction Model"
                                            value={currentPredictionModel.name}
                                            options={predictionModelChoices}
                                            onChange={(e) => setCurrentPredictionModel(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className='w-full flex justify-end gap-4 mt-4'>
                                    <button className={`border border-white text-white rounded-md hover:bg-cyan-400/50 w-3 py-2`}
                                        onClick={handlePredict}>
                                        <span>Predict</span>
                                    </button>
                                </div>
                                <div className='flex justify-end gap-4 pt-4'>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default EnemyLabComputerUI;
