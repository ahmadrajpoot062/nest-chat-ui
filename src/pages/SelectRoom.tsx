import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Avatar from "../components/Avatar";
import Colors from "../theme/colors";

export default function SelectRoomPage() {
  const [room, setRoom] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const joinRoom = () => {
    if (room.trim()) navigate(`/chat/${room.trim()}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: Colors.light.background }}>
      <div className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-lg" style={{ backgroundColor: Colors.light.card }}>
        {user && (
          <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: Colors.light.primaryLight }}>
            <div className="flex items-center space-x-3">
              <Avatar name={user.username} src={user.avatar} size={40} />
              <span className="font-semibold" style={{ color: Colors.light.textDark }}>{user.username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded text-sm font-medium hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: Colors.light.error,
                color: '#FFFFFF',
              }}
            >
              Logout
            </button>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center" style={{ color: Colors.light.textDark }}>Join a Chat Room</h2>
          <p className="text-sm text-center" style={{ color: Colors.light.textLight }}>Enter a room name to start chatting</p>
          
          <div className="space-y-2">
            <input
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="Enter room name"
              className="w-full px-4 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: Colors.light.background,
                borderColor: Colors.light.input,
                color: Colors.light.textDark,
              }}
            />
            <button
              onClick={joinRoom}
              disabled={!room.trim()}
              className={`w-full py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 hover:opacity-90 transition-opacity ${
                room.trim() ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              style={{
                color: '#FFFFFF',
              }}
            >
              Join Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}