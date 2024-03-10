import React, { useState, useEffect, useReducer } from 'react';
import { io } from 'socket.io-client';

const messageReducer = (state, action) => {
  switch (action.type) {
    case 'addUserMessage':
      return [...state, { text: action.text, sender: 'user' }];
    case 'addServerMessage':
      return [...state, { text: action.text, sender: 'server' }];
    default:
      return state;
  }
};

const Box = () => {
  const socket = io('https://rentry-tp26.onrender.com/');
  const [messages, dispatch] = useReducer(messageReducer, []);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const handleBroadcastMessage = (message) => {
      dispatch({ type: 'addServerMessage', text: message.text });
    };

    socket.on('broadcast-message', handleBroadcastMessage);

    return () => {
      socket.off('broadcast-message', handleBroadcastMessage);
    };
  }, [socket]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === 'server') {
        // Only scroll to the latest message if it's from the server
        // This prevents scrolling when the user sends a message
        scrollToLatestMessage();
      }
    }
  }, [messages]);

  const scrollToLatestMessage = () => {
    const messageList = document.getElementById('message-list');
    if (messageList) {
      messageList.scrollTop = messageList.scrollHeight;
    }
  };

  const handleInputChange = (event) => {
    setNewMessage(event.target.value);
  };

  const send = () => {
    if (newMessage.trim() !== '') {
      dispatch({ type: 'addUserMessage', text: newMessage });
      socket.emit('new-message', newMessage);

      setNewMessage('');
      scrollToLatestMessage();
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      <div
        id="message-list"
        className="flex-1 p-4 overflow-y-auto border-2 m-2 border-neutral-950 rounded-lg"
      >
        <div className="message-list space-y-2 overflow-y-auto">
          <table className="w-full">
            {messages.map((message, index) => (
              <tr key={index}>
                <td>
                  <div
                    className={`flex items-center justify-${
                      message.sender === 'user' ? 'end' : 'start'
                    }`}
                  >
                    <div
                      className={`bg-blue-500 text-white p-3 rounded-lg max-w-xs`}
                    >
                      {message.text}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </table>
        </div>
      </div>
      <div className="p-7 flex items-center">
        <input
          type="text"
          className="flex-1 p-3 border rounded border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ease-in-out"
          placeholder="Type your message..."
          value={newMessage}
          onChange={handleInputChange}
        />
        <button
          className="ml-2 p-3 bg-blue-500 text-white rounded text-lg font-semibold hover:bg-blue-600 transition-all duration-200 ease-in-out"
          onClick={send}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Box;
