import React, { useEffect, useState } from 'react'
import { GrDocumentConfig } from "react-icons/gr";
import { useEnemyLabContext } from '../../../contexts/SceneContext/EnemyLabContext';

const DropdownComponent = ({ value, options, onChange }) => (
    <>
        <div className='py-1 my-auto'>
            <select
                value={value}
                onChange={onChange}
                className="bg-gray-200 text-slate-600 rounded">
                {options.map((item, index) => (
                    <option key={index} value={item.value}>{item.name}</option>
                ))}
            </select>
        </div>
    </>
);

type Props = {}

const CollectLabel: React.FC<Props> = ({

}) => {

    const { weaknessLabels, setWeaknessLabels, labelCounts, setLabelCounts } = useEnemyLabContext();

    const [enemyDataList, setEnemyDataList] = useState<any[]>([]);
    const [selectedEnemy, setSelectedEnemy] = useState([]);
    const [enemyChoices, setEnemyChoices] = useState([
        { name: "Slime", value: "Slime" },
        { name: "Spider", value: "Spider" },
        { name: "Golem", value: "Golem" },
    ]);
    const [selectedEnemyChoice, setSelectedEnemyChoice] = useState("Slime");

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

    const randomMultiple = (enemyName: string, count: number) => {
        const result = []
        setEnemyDataList([])
        for (let i = 0; i < count; i++) {
            const parameter = randomParameter(enemyName)
            let imageLink;
            if (enemyName === "Slime") {
                imageLink = "/images/slime_default.png";
            }
            else if (enemyName === "Spider") {
                imageLink = "/images/SpiderHead.png"
            }
            else if (enemyName === "Golem") {
                imageLink = "/images/GolemHead.png"
            }
            const data = {
                id: i,
                ...parameter,
                image: imageLink,
            }
            result.push(randomParameter(data))
            setEnemyDataList((prev) => [...prev, data])
        }
    }

    useEffect(() => {
        randomMultiple("Slime", 12);
    }, [])

    const handleEnemyClick = (enemy) => {
        setSelectedEnemy((prevSelected) => {
            if (prevSelected.includes(enemy)) {
                return prevSelected.filter((item) => item !== enemy);
            } else {
                return [...prevSelected, enemy];
            }
        });
    };

    const handleLabelEnemy = (weakness) => {
        setWeaknessLabels((prevLabels) => {
            const elementGroup = prevLabels[weakness] || [];
            if (!elementGroup.includes(selectedEnemy)) {
                selectedEnemy.forEach((enemy) => {
                    enemy.weakness = weakness;
                });
                return {
                    ...prevLabels,
                    [weakness]: selectedEnemy,
                };
            } else {
                return prevLabels;
            }
        });
        setSelectedEnemy([]);
    };

    useEffect(() => {
        console.log(weaknessLabels)
    }, [weaknessLabels])

    const checkIsLabelEmpty = () => {
        if (Object.keys(weaknessLabels).length === 0) {
            return true;
        }
        return false
    };

    const handleClearLabel = () => {
        setWeaknessLabels({});
    };

    return (
        <div className='w-full h-full  mx-4'>
            <div className='grid grid-cols-10 gap-2'>
                <div className='col-span-7 bg-white/50 border rounded'>
                    <div className='w-full flex'>
                        <div className='w-full bg-white rounded flex justify-between'>
                            <div className='flex justify-start'>
                                <p className='text-xl font-semibold text-slate-600 px-3 my-auto'>Randomly Enemy</p>
                                <DropdownComponent
                                    value={selectedEnemyChoice}
                                    options={enemyChoices}
                                    onChange={(e) => setSelectedEnemyChoice(e.target.value)}
                                />
                            </div>
                            <p className='text-xl font-semibold text-cyan-600 underline px-3 cursor-pointer'
                                onClick={() => randomMultiple(selectedEnemyChoice, 12)}>Regenerate</p>
                        </div>
                    </div>
                    <div className='w-full grid grid-cols-4 gap-2 p-4 mx-auto'>
                        {enemyDataList && enemyDataList.length > 0 && enemyDataList.map((enemyData, index) => {
                            return (
                                <div
                                    key={index}
                                    className={`w-full relative flex flex-col items-center border rounded  cursor-pointer
                                        ${selectedEnemy.includes(enemyData) ? `border-blue-500 border-2` : `border-white`}`}
                                    onClick={() => handleEnemyClick(enemyData)}>
                                    <div className={`absolute w-full h-full rounded ${enemyData.color !== "white" ? `bg-${enemyData.color}-400/50` : "bg-white/50"}  left-0 top-0 z-[50]`}>
                                    </div>
                                    <img src={enemyData.image} className='w-6 rounded-xl z-10' />
                                    <div className='flex my-auto z-[100]'>
                                        <p className='text-xs text-white my-auto'>Energy Source: </p>
                                        <p className='text font-semibold text-white my-auto ml-2'>{enemyData.element}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className='col-span-3 w-full h-full'>
                    <div className='h-full bg-white/50 border rounded-md'>
                        <div className='flex py-2 justify-center items-center gap-2 text-slate-600 font-semibold'>
                            <GrDocumentConfig className='text-2xl' />
                            <p className='text-center text-lg'>Data Label</p>
                        </div>
                        <div className='px-2'>
                            <p className='text-slate-600 font-medium'>Weakness </p>

                            <div className="pl-3 pr-1.5 py-2 bg-red-400/50 border rounded-lg cursor-pointer flex justify-between mt-2"
                                onClick={() => handleLabelEnemy("fire")}>
                                <div className="">
                                    <p className="font-semibold text-red-800">Weakness: Fire</p>
                                    <p className="font-semibold text-red-800 text-sm -mt-1">
                                        Labelled:
                                        {(weaknessLabels["fire"] && weaknessLabels["fire"].length > 0) ? weaknessLabels["fire"].length : 0}
                                    </p>
                                </div>
                                <button className="text-slate-500 bg-white/80 px-3 rounded-lg">
                                    Select
                                </button>
                            </div>

                            <div className="pl-3 pr-1.5 py-2 bg-blue-400/50 border rounded-lg cursor-pointer flex justify-between mt-2"
                                onClick={() => handleLabelEnemy("water")}>
                                <div className="">
                                    <p className="font-semibold text-blue-800">Weakness: Water</p>
                                    <p className="font-semibold text-blue-800 text-sm -mt-1">
                                        Labelled:
                                        {(weaknessLabels["water"] && weaknessLabels["water"].length > 0) ? weaknessLabels["water"].length : 0}
                                    </p>
                                </div>
                                <button className="text-slate-500 bg-white/80 px-3 rounded-lg">
                                    Select
                                </button>
                            </div>

                            <div className="pl-3 pr-1.5 py-2 bg-green-400/50 border rounded-lg cursor-pointer flex justify-between mt-2"
                                onClick={() => handleLabelEnemy("earth")}>
                                <div className="">
                                    <p className="font-semibold text-green-800">Weakness: Earth</p>
                                    <p className="font-semibold text-green-800 text-sm -mt-1">
                                        Labelled:
                                        {(weaknessLabels["earth"] && weaknessLabels["earth"].length > 0) ? weaknessLabels["earth"].length : 0}
                                    </p>
                                </div>
                                <button className="text-slate-500 bg-white/80 px-3 rounded-lg">
                                    Select
                                </button>
                            </div>

                            <div className="pl-3 pr-1.5 py-2 bg-slate-400/50 border rounded-lg cursor-pointer flex justify-between mt-2"
                                onClick={() => handleLabelEnemy("air")}>
                                <div className="">
                                    <p className="font-semibold text-slate-800">Weakness: Air</p>
                                    <p className="font-semibold text-slate-800 text-sm -mt-1">
                                        Labelled:
                                        {(weaknessLabels["air"] && weaknessLabels["air"].length > 0) ? weaknessLabels["air"].length : 0}
                                    </p>
                                </div>
                                <button className="text-slate-500 bg-white/80 px-3 rounded-lg">
                                    Select
                                </button>
                            </div>

                            <div className="pl-3 pr-1.5 py-2 bg-yellow-400/50 border rounded-lg cursor-pointer flex justify-between mt-2"
                                onClick={() => handleLabelEnemy("lightning")}>
                                <div className="">
                                    <p className="font-semibold text-yellow-800">Weakness: Lightning</p>
                                    <p className="font-semibold text-yellow-800 text-sm -mt-1">
                                        Labelled:
                                        {(weaknessLabels["lightning"] && weaknessLabels["lightning"].length > 0) ? weaknessLabels["lightning"].length : 0}
                                    </p>
                                </div>
                                <button className="text-slate-500 bg-white/80 px-3 rounded-lg">
                                    Select
                                </button>
                            </div>

                            <button className={`w-full py-1 mt-6  bottom-0 border border-white rounded 
                            ${checkIsLabelEmpty() ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-cyan-200'}`}
                                disabled={checkIsLabelEmpty()}
                                onClick={handleClearLabel}>
                                <span className='text-center font-semibold0'>Clear Label</span>
                            </button>
                            <button className={`w-full py-1 mt-2 mb-2  bottom-0 bg-cyan-500 rounded 
                            ${checkIsLabelEmpty() ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-cyan-600'}`}
                                disabled={weaknessLabels !== null}>
                                <span className='text-center font-semibold'>Collect Label</span>
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CollectLabel