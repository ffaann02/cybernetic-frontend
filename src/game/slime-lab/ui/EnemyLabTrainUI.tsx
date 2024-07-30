import React, { useContext, useState } from 'react'
import { GameContext } from '../../../contexts/GameContext';
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { Steps } from 'primereact/steps';
import { Checkbox } from 'primereact/checkbox';
import useAxios from '../../../hooks/useAxios';
import axiosInstanceAiService from '../../../api/aiService';

interface Category {
    name: string;
    key: string;
}

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

const EnemyLabTrainUI = ({
    predictionModelChoices,
    collectedEnemyData,
    predictionModelSelected,
    setPredictionModelSelected,
    setCollectedEnemyData,
}) => {

    const { currentHit, isInteracting } = useContext(GameContext);
    const { axiosFetch } = useAxios();

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

    const categories: Category[] = [
        { name: 'Element', key: 'element' },
        { name: 'Size', key: 'size' },
        { name: 'Speed', key: 'speed' },
        { name: 'Mass', key: 'mass' },
        { name: 'Armor', key: 'armor' },
        { name: 'Weakness', key: 'weakness' },
        { name: 'Detection Range', key: 'detectionRange' }
    ];
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([categories[1]]);

    const handleBackStep = () => {
        if (trainActiveIndex == 0) return;
        setTrainActiveIndex((prev) => prev - 1);
    }

    const handleNextStep = () => {
        if (trainActiveIndex == 2) return;
        setTrainActiveIndex((prev) => prev + 1);
    }

    const handleSelectTrainData = (data) => {
        if (selectedTrainData.includes(data)) return;
        else {
            setSelectedTrainData((prev) => {
                return [...prev, data]; // Add the new parameter if it's not a duplicate
            });
        }
    }

    const handleRemoveTrainData = (data) => {
        setSelectedTrainData((prev) => {
            return prev.filter(item => item.id !== data.id);
        });
    }

    const handleSelectModel = (model) => {
        setSelectedModel(model);
    }

    const onCategoryChange = (e: CheckboxChangeEvent) => {
        let _selectedCategories = [...selectedCategories];

        if (e.checked)
            _selectedCategories.push(e.value);
        else
            _selectedCategories = _selectedCategories.filter(category => category.key !== e.value.key);

        setSelectedCategories(_selectedCategories);
    };

    const [trainPercentage, setTrainPercentage] = useState(80);

    const handleTrainSliderChange = (e) => {
        setTrainPercentage(parseInt(e.target.value));
    };

    const handleTestSliderChange = (e) => {
        setTrainPercentage(100 - parseInt(e.target.value));
    };

    const handleModelChange = (e) => {
        const selectedModel = predictionModelChoices.find((item) => item.value === e.target.value);
        if (selectedModel) {
            setPredictionModelSelected({
                name: selectedModel.name,
                value: selectedModel.value,
            });
        }
    };

    const isDataSelected = (data) => {
        return selectedTrainData.some(
            (item) => item.id === data.id &&
                item.name === data.name &&
                item.element === data.element &&
                item.size === data.size
        );
    };

    const handleTrainModel = async (modelName: string) => {
        console.log("Training model: ", modelName);
        console.log("Collected data: ", predictionModelSelected);

        try {
            const modifiedCollectedData = collectedEnemyData.map((data) => {
                return {
                    element: data.element,
                    size: data.size,
                    speed: data.speed,
                    mass: data.mass,
                    armor: data.armor,
                    weakness: data.weakness,
                    detectionRange: data.detectionRange,
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
                        targetVariable: "weakness"
                    },
                    data: modifiedCollectedData
                },
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            {currentHit === "ComputerTrainingEnemyLab" && isInteracting &&
                < div className='absolute w-full h-full z-[10000] flex justify-center'>
                    <div className='flex justify-center items-center max-w-7xl py-32 gap-x-4 relative '>
                        <div
                            style={{ backdropFilter: 'blur(8px)' }}
                            className='min-w-[960px] max-w-6xl h-[80vh] rounded-xl border-4 border-white shadow-md shadow-white'>
                            <div className='bg-cyan-400/50 py-4'>
                                <h1 className='text-center text-3xl font-bold text-white'>Train Your AI Model</h1>
                            </div>
                            <div className='w-full flex justify-center items-center mt-4 text-white'>
                                <div className='w-[95%] h-[95%]  bg-black/40 rounded-md border '>
                                    <div className='relative w-full h-24 top-2'>
                                        <div className='flex justify-between'>
                                            <button className={`flex p-2 z-10 ${trainActiveIndex == 0 ? "cursor-not-allowed text-slate-400" : "cursor-pointer"}`}
                                                onClick={handleBackStep}
                                                disabled={trainActiveIndex == 0}>
                                                <IoChevronBack className='my-auto mr-1 text-xl' />
                                                <span>Back</span>
                                            </button>
                                            <button className={`flex p-2 z-10 ${(trainActiveIndex == 2 || (selectedTrainData && selectedTrainData.length < 1)) ? "cursor-not-allowed text-slate-400" : "cursor-pointer"}`}
                                                onClick={handleNextStep}
                                                disabled={(trainActiveIndex == 2 || (selectedTrainData && selectedTrainData.length < 1))}>
                                                <span>Next</span>
                                                <IoChevronForward className='my-auto mr-1 text-xl' />
                                            </button>
                                        </div>
                                        <div className='absolute text-white flex justify-center w-full texct-center -z-5 top-0 bg-red-20'>
                                            <div>
                                                <h2 className='text-xl text-center font-medium top-2'>ML Classification</h2>
                                                <p className='top-4 text-center'>A classification algorithm is used to predict the category of a new instance</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='mb-4'>
                                        <Steps
                                            model={trainingSteps}
                                            activeIndex={trainActiveIndex}
                                            onSelect={(e) => setTrainActiveIndex(e.index)}
                                            readOnly={true}
                                            style={{ fontSize: "14px" }} />
                                    </div>
                                    <div className='w-full h-full flex justify-center items-center  '>
                                        {trainActiveIndex == 0 &&
                                            <div className='w-[90%] h-[90%] mb-8 bg-white/20 rounded-md '>

                                                <div className='grid grid-cols-4 gap-2 p-4 '>
                                                    <div className='col-span-2'>
                                                        <p className=' font-bold'>Avaliable Data List</p>
                                                        {collectedEnemyData && collectedEnemyData.length > 0 && collectedEnemyData.map((data, index) => (
                                                            <div key={index} className={`flex justify-between border border-white rounded-md p-2 my-2 
                                                                ${isDataSelected(data) ? "bg-cyan-600/60 opacity-35" : ""}`}>
                                                                <p className='font-bold my-auto'>{data.name}({data.element})</p>
                                                                <button className={` px-3 py-1 rounded-md shadow-md
                                                                            ${isDataSelected(data) ? "cursor-not-allowed bg-cyan-200/20 text-slate-200" : "bg-white text-cyan-500 hover:bg-cyan-400"}`}
                                                                    onClick={() => handleSelectTrainData(data)}
                                                                    disabled={isDataSelected(data)}>
                                                                    <span className='text-md font-bold'>Select</span>
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className='col-span-2'>
                                                        <p className=' font-bold'>Selected Data</p>
                                                        {selectedTrainData && selectedTrainData.length > 0 && selectedTrainData.map((data, index) => (
                                                            <div key={index} className='flex justify-between border border-white rounded-md p-2 my-2'>
                                                                <p className='font-bold my-auto'>{data.name}({data.element})</p>
                                                                <div className='bg-white text-red-400 px-3 py-1 rounded-md shadow-md cursor-pointer'
                                                                    onClick={() => handleRemoveTrainData(data)}>
                                                                    <span className='text-md font-bold'>Remove</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>


                                            </div>
                                        }

                                        {trainActiveIndex == 1 &&
                                            <div className='w-[90%] h-[90%] mb-8'>
                                                <div className='grid grid-cols-4 gap-2 p-4'>
                                                    <div className='col-span-2'>
                                                        {modelList && modelList.length > 0 && modelList.map((model, index) => (
                                                            <button key={index}
                                                                className={`flex w-full justify-between border border-white rounded-md p-2 my-2 ${(selectedModel && selectedModel.value) === model.value ? "bg-cyan-400/50" : "bg-white/20"}`}
                                                                onClick={() => handleSelectModel(model)}>
                                                                <p className='font-bold my-auto'>{model.name}</p>
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className='col-span-2'>
                                                    </div>
                                                </div>
                                            </div>
                                        }

                                        {trainActiveIndex == 2 &&
                                            <div className='w-[90%] h-[90%] mb-8'>
                                                <div className='grid grid-cols-6'>
                                                    <div className='col-span-2'>
                                                        <div className="card flex justify-content-center">
                                                            <div className="card flex justify-content-center">
                                                                <div className="flex flex-column gap-3">
                                                                    <p className='text-lg'>Select Parameters</p>
                                                                    {categories.map((category) => {
                                                                        return (
                                                                            <div key={category.key} className="flex align-items-center">
                                                                                <Checkbox inputId={category.key} name="category" value={category} onChange={onCategoryChange} checked={selectedCategories.some((item) => item.key === category.key)} />
                                                                                <label htmlFor={category.key} className="ml-2">
                                                                                    {category.name}
                                                                                </label>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='col-span-4'>
                                                        <div className="flex flex-column gap-2">
                                                            <p className='text-lg mb-2'>Adjust Train/Test Split</p>
                                                            <div className="flex flex-column gap-2">
                                                                <label htmlFor="trainSlider">Training Set: {trainPercentage}%</label>
                                                                <input
                                                                    type="range"
                                                                    id="trainSlider"
                                                                    min="0"
                                                                    max="100"
                                                                    value={trainPercentage}
                                                                    onChange={handleTrainSliderChange}
                                                                    className="w-full accent-cyan-400"
                                                                    style={{ cursor: "pointer" }}
                                                                />
                                                            </div>
                                                            <div className="flex flex-column gap-2">
                                                                <label htmlFor="testSlider">Test Set: {100 - trainPercentage}%</label>
                                                                <input
                                                                    type="range"
                                                                    id="testSlider"
                                                                    min="0"
                                                                    max="100"
                                                                    value={100 - trainPercentage}
                                                                    onChange={handleTestSliderChange}
                                                                    className="w-full accent-cyan-400"
                                                                    style={{ cursor: "pointer" }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className='mt-4 ml-2'>
                                                            <DropdownComponent
                                                                label="Prediction Model"
                                                                value={predictionModelSelected.value}
                                                                options={predictionModelChoices}
                                                                onChange={handleModelChange} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='w-full text-right mt-4'>
                                                    <button className='bg-cyan-400/60 p-2 rounded-md border text-lg hover:bg-cyan-800'
                                                        disabled={selectedCategories.length < 1}
                                                        onClick={() => handleTrainModel(predictionModelSelected.value)}>
                                                        <span>Start Training</span>
                                                    </button>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            }
        </>
    )
}

export default EnemyLabTrainUI;