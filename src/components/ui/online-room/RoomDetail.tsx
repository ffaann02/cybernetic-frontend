import React from 'react'
import { RoomPlayer } from '../../../pages/OnlineRoom';
import { BsStar, BsStarHalf, BsStarFill } from "react-icons/bs";
import { RiSettings3Fill } from "react-icons/ri";
import { BiSolidCopy } from "react-icons/bi";

interface RoomDetailProps {
    roomInfo: any
    players: RoomPlayer[]
}

const RoomDetail: React.FC<RoomDetailProps> = ({ roomInfo, players }) => {

    const imageCover = "https://lh3.googleusercontent.com/proxy/u3HBg4oNmkZ7pW21kOn655WaKRkb-S1Fte6-Ooft5QYrLPSc4fuFPX6Ivs2WoO3Zq1s9zv16DgOMPPKADim38f_wmNwQWE06Wwt2EKgrPGpKxIVo2h-XXdEegySLXw";

    const maxLevel = 5;

    const StarLevel: React.FC<{ difficulty: number }> = ({ difficulty }) => {
        const star = [];
        for (let i = 0; i < maxLevel; i++) {
            if (difficulty >= i + 1) {
                star.push(<BsStarFill key={i} />);
            } else if (difficulty > i && difficulty < i + 1) {
                star.push(<BsStarHalf key={i} />);
            } else {
                star.push(<BsStar key={i} />);
            }
        }

        return (
            <>
                {star.map((starElement, index) => (
                    <span key={index} className='text-white'>{starElement}</span>
                ))}
            </>
        );
    }

    console.log(roomInfo);


    return (
        <div className='h-1/3 bg-white mb-8 flex'>
            <div className='w-1/3 h-full'>
                <img src={roomInfo.mapImage} alt="Room Cover" className="w-full h-full object-cover" />
            </div>
            <div className='w-2/3'>
                <div className='flex justify-between bg-blue-400 text-white p-4'>
                    <div>
                        <p className='text-2xl'>Map: {roomInfo.mapName}</p>
                        <div className='flex gap-2 text-lg'>
                            <p className='my-auto'>Difficulty: </p>
                            <div className='flex mt-1 gap-1'>
                                <StarLevel difficulty={roomInfo.difficulty} />
                            </div>
                        </div>
                    </div>
                    <RiSettings3Fill className='text-4xl text-white my-auto cursor-pointer' />
                </div>
                <div className='text-lg p-4'>
                    <p>Room Name: {roomInfo.name}</p>
                    <div className='flex gap-2 cursor-pointer '>
                        <p>InviteID: {roomInfo.id}</p>
                        <div className='flex gap-1 text-sm my-auto bg-blue-200 text-blue-800 px-2 rounded-lg'>
                            <span className=''>คัดลอกลิงก์</span>
                            <BiSolidCopy className='my-auto' />
                        </div>
                    </div>
                    <p>Players: {Object.keys(players).length}/{roomInfo.maxPlayer}</p>
                </div>
            </div>
        </div>
    )
}

export default RoomDetail