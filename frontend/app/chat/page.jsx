'use client';
import { useEffect, useState } from 'react';
import { getSocket } from '@/utils/socket';
import { useAuth } from '@/hooks/useAuth';

export default function ChatPage() {
  const { user } = useAuth();
  const [roomId, setRoomId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [hasJoined, setHasJoined] = useState(false);
  const [socket, setSocket] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  useEffect(() => {
    if (!user) return;

    const sock = getSocket();
    setSocket(sock);

    sock.on('user-joined', (userId) => {
      console.log(`User ${userId} joined the room`);
    });

    // Fetch available rooms
    fetchRooms();

    return () => {
      sock.disconnect();
    };
  }, [user]);

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/chat/room');
      const rooms = await response.json();
      setAvailableRooms(rooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const createRoom = async () => {
    if (!roomName.trim() || !user) return;

    try {
      const response = await fetch('/api/chat/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: roomName,
          userId: user.id
        })
      });

      const newRoom = await response.json();
      setAvailableRooms([...availableRooms, newRoom]);
      setRoomName('');
      setIsCreatingRoom(false);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const joinRoom = async (selectedRoomId) => {
    if (!selectedRoomId || !user) return;

    try {
      const newSocket = getSocket();
      newSocket.emit('join', { roomId: selectedRoomId, userId: user.id });
      setSocket(newSocket);

      const res = await fetch(`/api/chat/messages/${selectedRoomId}`);
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
      setRoomId(selectedRoomId);
      setHasJoined(true);

      newSocket.on('message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      newSocket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    } catch (error) {
      console.error('Error joining room:', error);
    }
  };

  const sendMessage = () => {
    if (!message.trim() || !user) return;

    socket.emit('message', { 
      roomId, 
      senderId: user.id, 
      content: message 
    });
    setMessage('');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#36393f] text-white">
        <p>Please log in to access the chat.</p>
      </div>
    );
  }

  if (!hasJoined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#36393f] text-white p-4">
        <div className="w-full max-w-md space-y-4">
          <h2 className="text-2xl font-bold text-center mb-6">Chat Rooms</h2>
          
          {isCreatingRoom ? (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#40444b] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={createRoom}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg"
                >
                  Create Room
                </button>
                <button
                  onClick={() => setIsCreatingRoom(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => setIsCreatingRoom(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg mb-6"
              >
                Create New Room
              </button>
              
              <div className="space-y-2">
                {availableRooms.map((room) => (
                  <div
                    key={room.id}
                    className="flex items-center justify-between bg-[#40444b] p-4 rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">{room.name}</h3>
                      <p className="text-sm text-gray-400">Created by: {room.createdBy.full_name}</p>
                    </div>
                    <button
                      onClick={() => joinRoom(room.id)}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg"
                    >
                      Join
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#36393f] text-white">
      <div className="p-4 bg-[#40444b] border-b border-gray-700">
        <h2 className="text-xl font-semibold">Chat Room: {roomId}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${msg.senderId === user.id ? 'bg-green-600' : 'bg-[#40444b]'}`}
            >
              <div className="text-sm text-gray-300 mb-1">{msg.sender?.full_name || msg.senderId}</div>
              <div>{msg.content}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-[#40444b]">
        <div className="flex space-x-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-[#36393f] text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={sendMessage}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
