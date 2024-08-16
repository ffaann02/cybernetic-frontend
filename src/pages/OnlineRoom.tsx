import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from "socket.io-client";
import { useAuth } from '../hooks/useAuth';
import PlayerList from '../components/ui/online-room/PlayerList';
import ChatLayout from '../components/ui/online-room/ChatLayout';
import RoomDetail from '../components/ui/online-room/RoomDetail';

const serverEndpoint = import.meta.env.VITE_SERVER_ENDPOINT as string;
const socket = io.connect(`${serverEndpoint}/online_room`);

export interface RoomPlayer {
    ID: string;
    Name: string;
    Status: string;
}

export interface RoomInfo {
    roomName: string;
    roomId: string;
    mapName: string;
    maxPlayer: number;
    minPlayer: number;
    userId: string;
    characterName: string;
}

export interface ChatMessage {
    UserId: string;
    Name: string;
    Msg: string;
    Time: string;
}

export interface Friend {
    ID: string;
    Name: string;
    Status: string;
}

const friendList = [
    {
        ID: '1',
        Name: 'Steve',
        Status: 'online'
    },
    {
        ID: '2',
        Name: 'Alex',
        Status: 'online'
    },
    {
        ID: '3',
        Name: 'Stephen',
        Status: 'offline'
    },
    {
        ID: '4',
        Name: 'John',
        Status: 'offline'
    },
    {
        ID: '5',
        Name: 'Chris',
        Status: 'offline'
    },
    {
        ID: '6',
        Name: 'Robert',
        Status: 'offline'
    },
    {
        ID: '7',
        Name: 'Thomas',
        Status: 'offline'
    }
]

const OnlineRoom = () => {

    const { user } = useAuth();

    const { roomid } = useParams();
    const [roomInfo, setRoomInfo] = useState<RoomInfo>();

    const [players, setPlayers] = useState<RoomPlayer[]>([]);
    const [owner, setOwner] = useState<string>('');
    const [readyStatus, setReadyStatus] = useState<boolean>(false);

    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');

    const sendMessage = () => {
        if (newMessage.trim()) {
            socket.emit('send_chat_message', { roomId: roomid, userId: user?.userId, characterName: user?.characterName, msg: newMessage });
            setNewMessage('');
        }
    };

    const toggleReadyStatus = () => {
        const newStatus = !readyStatus;
        setReadyStatus(newStatus);
        socket.emit('update_ready_status', { roomId: roomid, userId: user?.userId, readyStatus: newStatus });
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

        socket.on('reply', (data: any) => {
            console.log('Emit from server:', data);
        });

        socket.on('update_players', (data: any) => {
            setPlayers(data.players);
            setOwner(data.owner);
        });

        socket.on('room_detail', (data: any) => {
            console.log('Room detail:', data);
            setRoomInfo(data);
        });

        socket.on('chat_client', (message: ChatMessage) => {
            setChatMessages(prevMessages => [...prevMessages, message]);
        });

        socket.emit('join_room', { roomId: roomid, userId: user?.userId, characterName: user?.characterName });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('connect_error');
            socket.off('reply');
            socket.off('update_players');
            socket.off('chat_client');
        };
    }, [roomid, user]);

    return (
        <div className="w-full flex-grow flex flex-col max-h-screen p-12 bg-gradient-to-r from-cyan-400 to-blue-400">
            <div className="grid grid-cols-10 flex-grow border-t-2 border-t-cyan-400 rounded-xl w-full h-full bg-white/80 shadow-xl shadow-slate-200">
                <div className='col-span-6 pl-8 pr-4 py-8 flex flex-col h-full'>
                    {roomInfo &&
                        <RoomDetail
                            roomInfo={roomInfo}
                            players={players} />
                    }
                    <ChatLayout
                        chatMessages={chatMessages}
                        newMessage={newMessage}
                        setNewMessage={setNewMessage}
                        sendMessage={sendMessage} />
                </div>
                <div className='col-span-4 pr-8 pl-4 py-8 flex flex-col'>
                    {roomInfo &&
                        <PlayerList
                            players={players}
                            maxPlayer={roomInfo.maxPlayer}
                            minPlayer={roomInfo.minPlayer}
                            owner={owner}
                            toggleReadyStatus={toggleReadyStatus}
                            readyStatus={readyStatus}
                            friends={friendList} />
                    }
                </div>
            </div>
        </div>
    );
};

export default OnlineRoom;
