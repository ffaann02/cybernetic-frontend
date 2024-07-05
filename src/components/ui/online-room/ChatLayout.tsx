import React from 'react'
import { ChatMessage } from '../../../pages/OnlineRoom'
import { IoSend } from "react-icons/io5";

interface ChatLayoutProps {
    chatMessages: ChatMessage[]
    newMessage: string
    setNewMessage: React.Dispatch<React.SetStateAction<string>>
    sendMessage: () => void
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ chatMessages, newMessage, setNewMessage, sendMessage }) => {

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div className='w-full h-full bg-white relative'>
            <h1 className="text-2xl p-4 bg-blue-400 text-white">แชท/แจ้งเตือน</h1>
            <div className="p-4 overflow-auto text-black" style={{ maxHeight: '300px' }}>
                {chatMessages.map((msg, index) => (
                    <div key={index} className='mb-2 flex gap-1'>
                        <p>[{formatTime(msg.Time)}]</p>
                        <p>{msg.Name}: </p>
                        <p>{msg.Msg}</p>
                    </div>
                ))}
            </div>
            <div className='absolute bottom-0 w-full flex p-2'>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder='พิมพ์ข้อความของคุณ...'
                    className='w-full h-10 px-2 border-2 focus:outline-none focus:border-blue-200'
                />
                <button onClick={sendMessage} className='bg-blue-400 text-white px-4 py-2 ml-2'>
                    <IoSend />
                </button>
            </div>
        </div>
    )
}

export default ChatLayout