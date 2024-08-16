import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import io from "socket.io-client";
import { useAuth } from '../../../hooks/useAuth';
import { IoCloseCircle } from "react-icons/io5";
import { Carousel } from 'primereact/carousel';
import { BsStar, BsStarHalf, BsStarFill } from "react-icons/bs";
import { FaPlus, FaMinus } from "react-icons/fa6";

const maps = [
    {
        id:  "map0",
        name: "Fallen Kingdom",
        image: "https://firebasestorage.googleapis.com/v0/b/cybernetic-nsc2024-426807.appspot.com/o/assets%2Fonline_lobby%2Fmap1.png?alt=media&token=62d13054-a3d9-4687-8429-6b4fc85b9b85",
        difficulty: 3.5
    },
    {
        id: "map1",
        name: "Monster Tower",
        image: "https://firebasestorage.googleapis.com/v0/b/cybernetic-nsc2024-426807.appspot.com/o/assets%2Fonline_lobby%2Fmap2.png?alt=media&token=c407ec76-ae3b-4206-9675-c5517b0b15e0",
        difficulty: 4.0
    },
    {
        id: "map3",
        name: "Abandon Land",
        image: "https://firebasestorage.googleapis.com/v0/b/cybernetic-nsc2024-426807.appspot.com/o/assets%2Fonline_lobby%2Fmap3.png?alt=media&token=eb2eaaf5-053b-4de0-a09c-7690b41e7440",
        difficulty: 5.0
    },
    {
        id: "map4",
        name: "Forgotten Village",
        image: "https://firebasestorage.googleapis.com/v0/b/cybernetic-nsc2024-426807.appspot.com/o/assets%2Fonline_lobby%2Fmap4.png?alt=media&token=3735b4ff-a7ee-4527-9e13-38598c2b15d1",
        difficulty: 5.0
    },
]

interface Map {
    id: string;
    name: string;
    image: string;
    difficulty: number;
}

interface CreateRoomModalProps {
    closeModal: () => void;
}

const serverEndpoint = import.meta.env.VITE_SERVER_ENDPOINT as string;
const socket = io.connect(`${serverEndpoint}/online_room`);

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ closeModal }) => {

    const { user } = useAuth();
    const navigate = useNavigate();

    const [selectedMap, setSelectedMap] = useState<Map>(maps[0]);
    const [roomName, setRoomName] = useState<string>('');
    const [maxPlayer, setMaxPlayer] = useState<number>(6);

    const generateRoomId = () => {
        return Math.random().toString(36).substring(2, 7);
    };

    const createRoom = () => {
        const roomId = generateRoomId();
        const data = {
            roomName: roomName,
            roomId: roomId,
            mapId: selectedMap.id,
            mapName: selectedMap.name,
            mapImage: selectedMap.image,
            difficulty: selectedMap.difficulty,
            maxPlayer: maxPlayer,
            minPlayer: 2,
            userId: user?.userId,
            characterName: user?.characterName || "No Name",
        };
        console.log(data);
        socket.emit('create_room', data);
    };

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        socket.on('connect_error', (error: any) => {
            console.log('Connection error:', error);
        });

        socket.on('room_created', (data: any) => {
            console.log('Room created:', data);
            navigate(`/online-room/${data.roomId}`, { state: { roomDetails: data } });
        });

        return () => {
            socket.off('room_created');
        };
    }, []);


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
                    <span key={index} className='text-yellow-500 my-auto'>{starElement}</span>
                ))}
            </>
        );
    }

    const mapsCardTemplate = (map: any) => {
        return (
            <div key={map.id} className='relative'>
                <div className='flex flex-col items-center gap-2 mx-2 cursor-pointer' onClick={() => setSelectedMap(map)}>
                    <div className={`p-1 rounded-md ${selectedMap.id === map.id ? " bg-cyan-400" : ""}`}>
                        <div className='absolute px-4  mt-1 py-1 top-0 bg-black bg-opacity-50 rounded-lg'>
                            <div className='flex text-white gap-1 mb-1'>
                                <StarLevel difficulty={map.difficulty} />
                            </div>

                        </div>
                        <img src={map.image}
                            alt={map.name}
                            className={`w-full h-auto object-cover rounded-lg ${selectedMap.id === map.id ? " " : ""} `} />
                    </div>
                    <span className={`${selectedMap.id === map.id ? " text-cyan-400" : "text-black"}`}>{map.name}</span>
                </div>
            </div>
        );
    }

    const handleMaxPlayer = (type: string) => {
        if (type === 'plus') {
            if (maxPlayer < 6) {
                setMaxPlayer(maxPlayer + 1);
            }
        } else {
            if (maxPlayer > 2) {
                setMaxPlayer(maxPlayer - 1);
            }
        }
    }

    return (
        <div className='fixed flex start-0 top-0 justify-center z-20 bg-black bg-opacity-30 h-screen w-full'>
            <div className='relative bg-white rounded-lg max-w-4xl min-h-[70vh] w-full my-auto'>
                <div className='p-8'>
                    <div className='flex justify-between'>
                        <h1 className="text-2xl">สร้างห้อง</h1>
                        <IoCloseCircle className='absolute top-4 right-4 text-3xl cursor-pointer text-red-400' onClick={closeModal} />
                    </div>
                    <div className='px-8 py-2'>
                        <h2 className='text-xl'>เลือกด่าน</h2>

                        <Carousel
                            value={maps}
                            numVisible={3}
                            numScroll={3}
                            itemTemplate={mapsCardTemplate} />
                    </div>
                    <div className='w-full flex'>
                        <span className='text-xl font-medium'>{selectedMap.name}</span>
                        <div className='flex ml-4'>
                            <span className='my-auto mr-1'>( </span>
                            <span className='text-lg '>ระดับความยาก: {selectedMap.difficulty} </span>
                            <BsStarFill className='text-yellow-500 ml-1 my-auto' />
                            <span className='my-auto ml-1'>)</span>
                        </div>
                    </div>
                    <div className='grid grid-cols-4 gap-8'>
                        <div className='col-span-2 my-auto'>
                            <input
                                type="text"
                                placeholder="ชื่อห้อง"
                                value={roomName}
                                className='border-2 border-slate-200 rounded-md w-full p-2 my-4'
                                onChange={(e) => setRoomName(e.target.value)} />
                        </div>
                        <div className='col-span-2 my-auto flex'>
                            <span className='my-auto'>จำนวนผู้เล่น: </span>
                            <div className='ml-4 flex my-auto'>

                                <div className={`my-auto p-1 text-white  rounded-full ${maxPlayer > 2 ? "bg-cyan-400 cursor-pointer" : "bg-slate-200 cursor-not-allowed"} `}
                                    onClick={() => handleMaxPlayer('minus')}>
                                    <FaMinus className='my-auto' />
                                </div>

                                <span className='my-auto px-4'>{maxPlayer}</span>

                                <div className={`my-auto p-1 text-white  rounded-full ${maxPlayer < 6 ? "bg-cyan-400 cursor-pointer" : "bg-slate-200 cursor-not-allowed"} `}
                                    onClick={() => handleMaxPlayer('plus')}>
                                    <FaPlus className='my-auto' />
                                </div>
                            </div>
                            <span className='my-auto ml-2 text-slate-500'>(สูงสุด 6 คน)</span>
                        </div>
                    </div>
                </div>
                <div className='absolute bottom-4 w-full p-8'>
                    <div className='flex flex-col gap-y-4 w-full'>

                        <button className="bg-cyan-400 text-white rounded-md px-4 py-2" onClick={createRoom}>สร้างห้อง</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateRoomModal