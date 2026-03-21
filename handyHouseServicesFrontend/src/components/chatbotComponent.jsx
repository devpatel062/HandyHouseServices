import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, Loader2, X } from 'lucide-react';
import { Button /*, ButtonGroup, Tooltip */ } from '@chakra-ui/react';
import ServiceModal from '../pages/serviceproviderModal.jsx';

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hi! I'm HandyBot. How can I help you with home services today?",
      recommendedService: null
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  
  // ... existing state ...

  const [showModal, setShowModal] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // ... handlers ...

  const handleBookNow = (serviceType) => {
    if (!serviceType) return;
    setSelectedServiceType(serviceType);
    setShowModal(true);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;

    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setLoading(true);
    setInput('');

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/chatbot/`,
        { message: userMessage }
      );

      const data = res.data || {};
      const payload = data.recommendation ?? data;

      const botText =
        payload.reply ??
        payload.recommendation ??
        'Sorry, I couldn’t understand that.';

      let recommendedService =
        payload.recommended_service ??
        payload.recommendedService ??
        null;
        
      // Filter out invalid recommendations
      if (
        recommendedService && 
        (recommendedService.toLowerCase().includes('apology') || 
         recommendedService.toLowerCase().includes('statement') || 
         recommendedService.toLowerCase().includes('sorry'))
      ) {
        recommendedService = null;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botText,
          recommendedService
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Sorry, something went wrong. Please try again.',
          recommendedService: null
        }
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <div className="w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden font-sans border border-gray-100 ring-1 ring-black/5">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded-full ring-1 ring-blue-400/30">
              <Bot className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base leading-tight tracking-wide">HandyBot AI</h3>
              <p className="text-slate-400 text-[11px] font-medium uppercase tracking-wider">Service Assistant</p>
            </div>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-5 bg-slate-50 space-y-5 scroll-smooth relative">
          {/* Welcome timestamp or divider */}
          <div className="flex justify-center">
            <span className="text-[10px] text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded-full">Today</span>
          </div>

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-4 py-3 text-[14px] leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm'
                    : 'bg-white border border-gray-100 text-gray-700 rounded-2xl rounded-tl-sm'
                }`}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: String(msg.text || '').replace(/\n/g, '<br/>')
                  }}
                />

                {msg.sender === 'bot' && msg.recommendedService && (
                  <div className="mt-4 pt-3 border-t border-gray-100/50">
                    <div className="flex items-center justify-between gap-2 mb-2">
                       <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Recommended</span>
                       <span className="text-xs font-bold text-gray-800">{msg.recommendedService}</span>
                    </div>
                    
                    <Button
                      size="sm"
                      width="full"
                      colorScheme="blue"
                      variant="solid"
                      background="blue.600"
                      _hover={{ background: 'blue.700' }}
                      onClick={() => handleBookNow(msg.recommendedService)}
                      rightIcon={<span className="text-xs">→</span>}
                    >
                      Book {msg.recommendedService}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-2.5">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-xs text-slate-500 font-semibold tracking-wide">GENERATING RESPONSE...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask for help..."
              className="flex-1 bg-transparent border-none outline-none text-slate-700 px-1 placeholder-slate-400 text-sm font-medium"
              disabled={loading}
              autoFocus
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center mt-3">
             <p className="text-[10px] text-slate-400 font-medium">✨ AI-Powered • Responses may vary</p>
          </div>
        </div>
      </div>

      {showModal && selectedServiceType && (
        <ServiceModal
          serviceType={selectedServiceType}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default Chatbot;
