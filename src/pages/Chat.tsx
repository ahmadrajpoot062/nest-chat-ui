import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Colors from '../theme/colors';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import Avatar from '../components/Avatar';
import { useUser } from '../context/UserContext';
import { api } from '../services/api'; // ✅ ADDED

type Message = {
  _id: string;
  content: string;
  sender: string;
  createdAt: string;
  seen?: boolean;
  avatar?: string;
};

type TypingStatus = {
  user: string;
  typing: boolean;
};

export default function ChatPage() {
  const { room } = useParams<{ room: string }>();
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);

  const colors = isDark ? Colors.dark : Colors.light;

  // ✅ Fetch chat history on room join
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chat/${room}`);
        setMessages(res.data);
        setTimeout(() => scrollToBottom(false), 100);
      } catch (err) {
        toast.error('Failed to load messages');
      }
    };
    fetchMessages();
  }, [room]);

  useEffect(() => {
    const s = io('http://localhost:3000', {
      auth: { token: localStorage.getItem('token') },
    });

    s.on('connect', () => {
      s.emit('join', { room });
      toast.success(`Connected to ${room}`);
    });

    s.on('message', (msg: Message) => {
      const isOwnMessage = msg.sender === user?.username;

      setMessages((prev) => [...prev, msg]);

      if (isOwnMessage || isAtBottomRef.current) {
        setTimeout(() => scrollToBottom(), 100);
      } else {
        setNewMessageCount((prev) => prev + 1);
      }
    });

    s.on('typing', (data: TypingStatus) => {
      setTypingUser(data.typing ? data.user : null);
    });

    s.on('users', (users: string[]) => {
      setOnlineUsers(users);
    });

    s.on('seen', () => {
      setMessages((prev) =>
        prev.map((m) =>
          m.sender === user?.username ? { ...m, seen: true } : m
        )
      );
    });

    setSocket(s);

    return () => {
      s.off();
      s.disconnect();
    };
  }, [room, user]);

  useEffect(() => {
    scrollToBottom(false);
    socket?.emit('seen', { room });
  }, []);

  const handleScroll = () => {
    if (!messageContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = messageContainerRef.current;

    const atBottom = scrollHeight - scrollTop - clientHeight === 0;

    setIsAtBottom(atBottom);
    isAtBottomRef.current = atBottom;
    setShowScrollButton(!atBottom);
  };

  const scrollToBottom = (smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
      });
      setIsAtBottom(true);
      setShowScrollButton(false);
      setNewMessageCount(0);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    socket?.emit('typing', { room, typing: e.target.value.length > 0 });
  };

  const handleEmojiClick = (emojiData: any) => {
    setInput((prev) => prev + emojiData.emoji);
    inputRef.current?.focus();
  };

  // ✅ Updated sendMessage to prevent double-saving
  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      // Send message through socket only
      // The server will handle saving to DB
      socket?.emit('message', {
        room,
        content: input,
        avatar: user?.avatar, // Ensure we're sending the user's avatar
      });

      setInput('');
      scrollToBottom();
      socket?.emit('typing', { room, typing: false });
    } catch (error) {
      console.error(error);
      toast.error('Failed to send message');
    }
  };

  const renderMessage = (m: Message) => {
    const isMine = m.sender === user?.username;
    const messageTime = new Date(m.createdAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <div key={m._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`flex gap-3 max-w-xs lg:max-w-md ${isMine ? 'flex-row-reverse' : ''}`}>
          <div className="flex-shrink-0">
            <Avatar 
              name={m.sender} 
              src={m.avatar || (isMine ? user?.avatar : undefined)} 
              size={40} 
            />
          </div>
          <div
            className={`p-3 rounded-lg shadow-sm relative ${isMine ? 'rounded-tr-none' : 'rounded-tl-none'}`}
            style={{
              backgroundColor: isMine ? colors.senderBg : colors.receiverBg,
              color: colors.textDark,
            }}
          >
            {!isMine && (
              <div className="font-semibold text-sm mb-1 text-left" style={{ color: colors.primary }}>
                {m.sender}
              </div>
            )}
            <p className="text-sm text-left">{m.content}</p>
            <div className={`text-xs mt-1 ${isMine ? 'text-right' : 'text-left'}`}>
              <span style={{ color: colors.textLight }}>{messageTime}</span>
              {isMine && m.seen && (
                <span className="text-xs ml-1" style={{ color: colors.primary }}>
                  ✓ Seen
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleLeaveRoom = () => {
    socket?.emit('leave', { room });
    navigate('/select-room');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

 return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: colors.background, color: colors.textDark }}>
      {/* Header */}
      <div className="flex justify-between items-center p-4 shadow-md" style={{ backgroundColor: colors.primary }}>
        <div className="flex items-center gap-3">
          <button
            onClick={handleLeaveRoom}
            className="p-2 rounded-full hover:bg-opacity-20 hover:bg-white transition-all"
            title="Leave Room"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="white">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-lg font-bold text-white">#{room}</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="text-xs text-white opacity-80">
                {onlineUsers.length} {onlineUsers.length === 1 ? 'user' : 'users'} online
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full hover:bg-opacity-20 hover:bg-white transition-all"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? '🌞' : '🌙'}
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-opacity-20 hover:bg-white transition-all"
            title="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="white">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Online Users */}
      <div className="p-3 overflow-x-auto">
        <div className="flex items-center gap-2">
          {onlineUsers.map((username) => (
            <div key={username} className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: colors.input }}>
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="text-xs" style={{ color: colors.textDark }}>
                {username}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-4 pb-0 relative"
        ref={messageContainerRef}
        onScroll={handleScroll}
      >
        <div className="space-y-3 mb-10">
          {messages.map(renderMessage)}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Typing Indicator - Positioned as fixed element above input area */}
      {typingUser && typingUser !== user?.username && (
        <div 
          className="flex items-center gap-2 px-4 py-2 rounded-full w-fit mx-4 mb-2 z-10"
          style={{ 
            position: 'absolute',
            bottom: '70px',
            left: '20px',
            backgroundColor: colors.input
          }}
        >
          <div className="flex space-x-1">
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="text-sm italic" style={{ color: colors.textLight }}>
            {typingUser} is typing...
          </span>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t relative" style={{ borderColor: colors.input }}>
        {showEmojiPicker && (
          <div className="absolute bottom-20 right-4 z-10">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme={isDark ? Theme.DARK : Theme.LIGHT}
              width={300}
              height={400}
            />
          </div>
        )}
        
        {/* Scroll to Bottom Button with message counter */}
        {showScrollButton && (
          <button
            onClick={() => scrollToBottom()}
            className="absolute -top-16 right-5 p-2 rounded-full shadow-md flex items-center justify-center transition-all z-10"
            style={{
              backgroundColor: colors.primary,
              color: 'white',
              width: '40px',
              height: '40px',
            }}
            title="Scroll to bottom"
          >
            {newMessageCount > 0 && (
              <div 
                className="absolute -top-2 -right-2 rounded-full flex items-center justify-center text-xs font-medium"
                style={{
                  backgroundColor: colors.error,
                  color: 'white',
                  minWidth: '20px',
                  height: '20px',
                  padding: '0 4px'
                }}
              >
                {newMessageCount}
              </div>
            )}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        )}
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-500 transition-all"
            style={{ color: colors.textDark }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          <input
            ref={inputRef}
            value={input}
            onChange={handleInput}
            placeholder="Type a message..."
            className="flex-1 p-3 rounded-full outline-none"
            style={{
              backgroundColor: colors.input,
              color: colors.textDark,
            }}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="p-3 rounded-full flex items-center justify-center transition-all disabled:opacity-50"
            style={{
              backgroundColor: colors.primary,
              color: '#FFFFFF',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

