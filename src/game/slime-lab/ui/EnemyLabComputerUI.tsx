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

    const elementChoices = [
        { name: "fire", value: "fire" },
        { name: "water", value: "water" },
        { name: "earth", value: "earth" },
        { name: "air", value: "air" },
    ];
    const sizeChoices = [
        { name: "tiny", value: "tiny" },
        { name: "small", value: "small" },
        { name: "medium", value: "medium" },
        { name: "large", value: "large" },
    ];
    const speedChoices = Array.from({ length: 10 }, (_, i) => ({ name: i + 1, value: i + 1 }));
    const massChoices = Array.from({ length: 10 }, (_, i) => ({ name: (i + 1) * 10, value: (i + 1) * 10 }));
    const armorChoices = Array.from({ length: 10 }, (_, i) => ({ name: i + 1, value: i + 1 }));
    const energyChoices = Array.from({ length: 10 }, (_, i) => ({ name: (i + 1) * 50, value: (i + 1) * 50 }));
    const weaknessChoices = [
        { name: "fire", value: "fire" },
        { name: "water", value: "water" },
        { name: "earth", value: "earth" },
        { name: "air", value: "air" },
    ];
    const detectionRangeChoices = Array.from({ length: 10 }, (_, i) => ({ name: i + 1, value: i + 1 }));
    const [currentPredictionModel, setCurrentPredictionModel] = useState(predictionModelChoices[0]);

    const [isDisplayModal, setIsDisplayModal] = useState(false);
    const [predictionResponse, setPredictionResponse] = useState(null);

    const handleCollectData = () => {
        if (collectedEnemyData.includes(selectedEnemy)) return;
        const id = collectedEnemyData.length + 1;
        selectedEnemy.id = id;
        setCollectedEnemyData((prev) => [...prev, selectedEnemy]);
    }

    useEffect(() => {
        console.log(collectedEnemyData);
    }, [collectedEnemyData])

    const handlePredict = async () => {
        const modelName = currentPredictionModel.value;
        console.log("Predict model: ", modelName);
        try {
            const modifiedCollectedData = {
                element: selectedEnemy.element,
                size: selectedEnemy.size,
                speed: selectedEnemy.speed,
                mass: selectedEnemy.mass,
                armor: selectedEnemy.armor,
                detectionRange: selectedEnemy.detectionRange,
            };
            console.log(modifiedCollectedData);
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
            if(response.weakness === selectedEnemy.weakness) {
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
                    title={predictionResponse.accurate ? "Prediction is correct" : "Prediction is not correct" }
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
                            className='min-w-[960px] max-w-6xl h-[80vh] rounded-xl border-4 border-white shadow-md shadow-white'>
                            <div className='bg-cyan-400/50 py-4'>
                                <h1 className='text-center text-3xl font-bold text-white'>Enemy Lab</h1>
                            </div>
                            <div className='p-6'>
                                <div className='text-white p-4 bg-black/40 border rounded-md overflow-auto'>
                                    <div className=' h-[300px]'>
                                        <p className='mt-2 mb-4 text-yellow-400'>Guide: You can adjust parameters and collect or test your model with this parameters</p>
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
                                            options={elementChoices}
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
                                        <DropdownComponent
                                            label="Mass"
                                            value={selectedEnemy?.mass}
                                            options={massChoices}
                                            onChange={(e) => setSelectedEnemy({ ...selectedEnemy, mass: e.target.value })}
                                        />
                                        <DropdownComponent
                                            label="Armor"
                                            value={selectedEnemy?.armor}
                                            options={armorChoices}
                                            onChange={(e) => setSelectedEnemy({ ...selectedEnemy, armor: e.target.value })}
                                        />
                                        <DropdownComponent
                                            label="Energy"
                                            value={selectedEnemy?.energy}
                                            options={energyChoices}
                                            onChange={(e) => setSelectedEnemy({ ...selectedEnemy, energy: e.target.value })}
                                        />
                                        <DropdownComponent
                                            label="Weakness"
                                            value={selectedEnemy?.weakness}
                                            options={weaknessChoices}
                                            onChange={(e) => setSelectedEnemy({ ...selectedEnemy, weakness: e.target.value })}
                                        />
                                        <DropdownComponent
                                            label="Detection Range"
                                            value={selectedEnemy?.detectionRange}
                                            options={detectionRangeChoices}
                                            onChange={(e) => setSelectedEnemy({ ...selectedEnemy, detectionRange: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className='p-2 my-4 rounded-md border text-white bg-black/50'>
                                    <div className='ml-3 mr-4'>
                                        <DropdownComponent
                                            label="Prediction Model"
                                            value={currentPredictionModel.name}
                                            options={predictionModelChoices}
                                            onChange={(e) => setCurrentPredictionModel(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className='w-full flex justify-end gap-4'>
                                    <button className={`border border-white text-white rounded-md hover:bg-cyan-400/50 w-3 py-2`}
                                        onClick={handlePredict}>
                                        <span>Predict</span>
                                    </button>
                                    <button className={`border border-white text-white rounded-md hover:bg-cyan-400/50 w-3 py-2`}
                                        onClick={handleCollectData}>
                                        <span>Collect Data</span>
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
