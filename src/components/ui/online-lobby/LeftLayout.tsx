import React, { useState } from 'react'
import { FaPlay, FaPlus, FaLink } from "react-icons/fa";
import { useAuth } from '../../../hooks/useAuth';
import { GoPersonFill } from "react-icons/go";
import CreateRoomModal from './CreateRoomModal';

interface LeftLayoutProps { }

const LeftLayout: React.FC<LeftLayoutProps> = () => {

    const { user } = useAuth()

    const coverImage = "https://img.freepik.com/free-vector/character-playing-video-games-with-friends_23-2148519979.jpg?t=st=1719826484~exp=1719830084~hmac=57369169963dc991659f0885163c515a7489c32317f5591141b833cf68175ea5&w=740"

    const [isDisplayCreateRoomModal, setIsDisplayCreateRoomModal] = useState(false)

    return (
        <div className='w-full relative'>

            {isDisplayCreateRoomModal && 
                <CreateRoomModal closeModal={() => setIsDisplayCreateRoomModal(false)}/>}

            <div className='w-full h-48 bg-cover bg-center rounded-md' style={{ backgroundImage: `url(${coverImage})` }}></div>
            <div className='w-full p-8'>
                <div className='flex gap-2 text-xl w-full bg-white py-2 text-blue-600 px-4 rounded-md my-4 cursor-pointer'>
                    <FaPlay className='my-auto' />
                    <span className=' font-semibold'>เลือกห้องอัตโนมัติ</span>
                </div>
                <div className='flex gap-2 text-xl w-full bg-white py-2 text-blue-600 px-4 rounded-md my-4 cursor-pointer'
                    onClick={() => setIsDisplayCreateRoomModal(true)}>
                    <FaPlus className='my-auto' />
                    <span className=' font-semibold'>สร้างห้อง</span>
                </div>
                <div className='flex gap-2 text-xl w-full bg-white py-2 text-blue-600 px-4 rounded-md my-4 cursor-pointer'>
                    <FaLink className='my-auto' />
                    <span className=' font-semibold'>เข้าห้องด้วยลิงค์เชิญ</span>
                </div>
            </div>
            <div className='absolute bottom-0 w-full p-8 bg-white rounded-sm'>
                <div className='flex gap-2 text-lg text-blue-600'>
                    <GoPersonFill className='my-auto' />
                    <span className='my-auto'>โปรไฟล์ของคุณ</span>
                </div>
                <div className='flex gap-2 text-lg'>
                    <span>ชื่อตัวละคร:</span>
                    <span>{user?.characterName}</span>
                </div>
            </div>
        </div>
    )
}

export default LeftLayout