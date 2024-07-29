import React, { useState } from 'react'
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { Steps } from 'primereact/steps';
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";

interface Category {
    name: string;
    key: string;
}

const DropdownComponent = ({ label, value, options, onChange }) => (
    <div className='grid grid-cols-4'>
        <div className='col-span-2 my-auto'>
            <p className='my-auto text-lg'>{label}: </p>
        </div>
        <div className='col-span-2 w-[100%]'>
            <select
                value={value}
                onChange={onChange}
                className="bg-gray-700 text-white p-1 rounded w-full">
                {options.map((item, index) => (
                    <option key={index} value={item.value}>{item.name}</option>
                ))}
            </select>
        </div>
    </div>
);

const Level5TrainUI = ({
    trainingSteps,
    handleBackStep,
    handleNextStep,
    trainActiveIndex,
    setTrainActiveIndex,
    collectedBossData,
    selectedTrainData,
    handleSelectTrainData,
    handleRemoveTrainData,
    modelList,
    selectedModel,
    handleSelectModel,
    BossAttackPatternPredictModel,
    setBossAttackPatternPredictModel,
    handleTrainModel,
    predictionModelChoices,
}) => {

    const categories: Category[] = [
        { name: 'Energy Source', key: 'Energy Source' },
        { name: 'Sound Breathing', key: 'Sound Breathing' },
        { name: 'Charging Time', key: 'Charging Time' },
        { name: 'Last Active Turret', key: 'Last Active Turret' },
        { name: 'Boss Health', key: 'Boss Health' }
    ];
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([categories[1]]);

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

    return (
        <>
            <div className='w-full flex justify-center items-center'>
                <div className='w-[95%] h-[95%] bg-black/40 rounded-md border'>
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
                        <div className='absolute flex justify-center w-full texct-center -z-5 top-0 bg-red-20'>
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
                    <div className='w-full h-full flex justify-center items-center '>
                        {trainActiveIndex == 0 &&
                            <div className='w-[90%] h-[90%] mb-8 bg-white/20 rounded-md'>

                                <div className='grid grid-cols-4 gap-2 p-4'>
                                    <div className='col-span-2'>
                                        <p className=' font-bold'>Avaliable Data List</p>
                                        {collectedBossData && collectedBossData.length > 0 && collectedBossData.map((data, index) => (
                                            <div key={index} className={`flex justify-between border border-white rounded-md p-2 my-2 
                                                                        ${selectedTrainData.includes(data) ? "bg-cyan-600/60 opacity-35" : ""}`}>
                                                <p className='font-bold my-auto'>Pattern: {data.pattern}</p>
                                                <button className={` px-3 py-1 rounded-md shadow-md
                                                                            ${selectedTrainData.includes(data) ? "cursor-not-allowed bg-cyan-200/20 text-slate-200" : "bg-white text-cyan-500 hover:bg-cyan-400"}`}
                                                    onClick={() => handleSelectTrainData(data)}
                                                    disabled={selectedTrainData.includes(data)}>
                                                    <span className='text-md font-bold'>Select</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className='col-span-2'>
                                        <p className=' font-bold'>Selected Data</p>
                                        {selectedTrainData && selectedTrainData.length > 0 && selectedTrainData.map((data, index) => (
                                            <div key={index} className='flex justify-between border border-white rounded-md p-2 my-2'>
                                                <p className='font-bold my-auto'>Pattern: {data.pattern}</p>
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
                                                value={BossAttackPatternPredictModel.value}
                                                options={predictionModelChoices}
                                                onChange={(e) => setBossAttackPatternPredictModel({ name: e.target.value, value: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                                <div className='w-full text-right mt-4'>
                                    <button className='bg-cyan-400/60 p-2 rounded-md border text-lg hover:bg-cyan-800'
                                        disabled={selectedCategories.length < 1}
                                        onClick={() => handleTrainModel(BossAttackPatternPredictModel.value)}>
                                        <span>Start Training</span>
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Level5TrainUI