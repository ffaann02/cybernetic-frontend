import React, { useEffect } from 'react';
import { RoomPlayer } from '../../../pages/OnlineRoom';
import { FaCrown, FaPlay } from "react-icons/fa";
import { useAuth } from '../../../hooks/useAuth';
import { BiLogOut } from "react-icons/bi";
import { MdMail } from "react-icons/md";

interface PlayerListProps {
    players: RoomPlayer[];
    maxPlayer: number;
    minPlayer: number;
    owner: string;
    toggleReadyStatus: () => void;
    readyStatus: boolean;
    friends: string[];  // Add a new prop for the friend list
}

const PlayerList: React.FC<PlayerListProps> = ({ players, maxPlayer, minPlayer, owner, toggleReadyStatus, readyStatus, friends }) => {

    const [playerCount, setPlayerCount] = React.useState<number>(Object.keys(players).length);

    useEffect(() => {
        setPlayerCount(Object.keys(players).length);
    }, [players]);

    useEffect(() => {
        console.log(playerCount);
    }, [playerCount]);

    const playerArray = Object.values(players);

    const { user } = useAuth();

    return (
        <div>
            <div className=''>
                <h2 className="text-2xl text-white bg-blue-400 p-4">ผู้เล่น</h2>
                <ul>
                    {Array.from({ length: maxPlayer }, (_, index) => {
                        const player = playerArray[index];
                        return player ? (
                            <li key={player.ID} className='bg-white my-2 py-1 px-4'>
                                <div className='flex justify-between'>
                                    <div className='flex gap-2'>
                                        {player.ID === owner
                                            ? <FaCrown className='my-auto text-orange-400' />
                                            : null}
                                        <p className='my-auto'>{player.Name} </p>
                                    </div>
                                    <div>
                                        {player.Status === "Ready"
                                            ? <p className='bg-green-400 px-2 text-white'>พร้อม</p>
                                            : <p className='bg-orange-400 px-2 text-white'>รอก่อน</p>}
                                    </div>
                                </div>
                            </li>
                        ) : (
                            <li key={index} className='bg-white my-2 py-1 px-4'>
                                <div className='flex justify-between'>
                                    <div className='flex gap-2'>
                                        <p className='my-auto'>-</p>
                                    </div>
                                    <div>
                                        <p className='bg-gray-400 px-2 text-white'>ว่าง</p>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className=''>
                <h2 className="text-2xl text-white bg-blue-400 p-4 mt-8">เพื่อน</h2>
                <div className="overflow-auto text-black" style={{ maxHeight: '200px' }}>
                    {friends.map((friend, index) => (
                        <div key={index} className='bg-white border-y-[1px] border-slate-100 py-1 px-4'>
                            <div>
                                <div className='flex gap-2 justify-between'>
                                    <p className='my-auto'>{friend}</p>
                                    <div className='flex gap-1 bg-blue-200 text-blue-800 text-sm px-2 rounded-md'>
                                        <span className='my-auto'>ส่งคำเชิญ</span>
                                        <MdMail className='my-auto'/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className='flex gap-4 justify-end mt-4'>
                <button className="flex gap-1 bg-red-400 text-white rounded-xl px-4 py-2">
                    <BiLogOut className='my-auto' />
                    <span className='my-auto'>ออกจากห้อง</span>
                </button>
                <button onClick={toggleReadyStatus} className={`${readyStatus ? "bg-orange-400" : "bg-green-400"} text-white rounded-xl px-4 py-2`}>
                    {readyStatus ? "รอก่อน" : "พร้อมเล่น"}
                </button>
                {owner === user?.userId &&
                    <button
                        className={`${playerCount >= minPlayer ? "bg-blue-500 cursor-pointer" : "bg-slate-400 cursor-not-allowed"}
                                 text-white rounded-xl px-4 py-2`}
                        disabled={playerCount < minPlayer}>
                        <div className='flex gap-1'>
                            <FaPlay className='my-auto' />
                            <span className='my-auto'>เริ่มเกม</span>
                        </div>
                    </button>}
            </div>
        </div>
    );
}

export default PlayerList;
