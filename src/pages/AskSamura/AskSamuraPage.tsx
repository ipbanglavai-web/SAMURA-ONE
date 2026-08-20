import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, ArrowRight, CornerDownLeft } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const AskSamuraPage: React.FC = () => {
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: "Assalamu Alaikum Sabuz. I am ASK SAMURA, your executive AI command assistant. You can ask me anything regarding today's sales, bank liquidity, cold storage temperatures, import shipments, or pending approvals.",
      time: '09:00 AM'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const sampleQuestions = [
    "What is today's total sales and collection ratio?",
    "Why does the Egyptian citrus shipment have a cost variance?",
    "Which cold room has an active temperature excursion?",
    "Show me the total cash balance across all 13 bank accounts."
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = "I analyzed AL SAMURA Group's live ERP data across all 6 business units.";
      const qLower = query.toLowerCase();

      if (qLower.includes('sales') || qLower.includes('collection')) {
        reply = "📊 Today's Gross Sales stand at ৳ 42.8 Lakhs (+8.4% vs yesterday). Total realization collections are ৳ 31.6 Lakhs, representing a healthy 73.8% Collection Ratio. Elenga Fruits is leading with ৳ 11.8L, followed by Dhaka Mad at ৳ 9.2L.";
      } else if (qLower.includes('egypt') || qLower.includes('shipment') || qLower.includes('variance') || qLower.includes('cost')) {
        reply = "🚢 Consignment LC-2026-EGY-0941 (Egyptian Navel Oranges, 12 Containers on vessel MSC ANNA) has a +6.8% landed cost variance (৳ 1.98Cr actual vs ৳ 1.85Cr budget). This was driven by Chittagong port detention and increased clearing tariffs. It is currently in Port Clearance.";
      } else if (qLower.includes('cold') || qLower.includes('temperature') || qLower.includes('excursion') || qLower.includes('chamber')) {
        reply = "❄️ Chamber C-02 (storing 380 Tons of South African Royal Gala Apples) logged 2 temperature deviations (reaching 3.4°C against the 0.5°C setpoint) during an automated defrost cycle. The plant maintenance engineer has acknowledged the alert and restored the compressor.";
      } else if (qLower.includes('bank') || qLower.includes('cash') || qLower.includes('balance') || qLower.includes('islami')) {
        reply = "🏦 Total Group Liquid Cash & Bank balance is ৳ 3.74 Crores across 13 verified accounts. The largest balance is held at Islami Bank Bangladesh Ltd (Dilkusha Corporate Branch) with ৳ 1.45 Crores, followed by Eastern Bank PLC at ৳ 88.4 Lakhs.";
      } else {
        reply = `I have cross-checked your inquiry with AL SAMURA Group's real-time databases. All 6 operating business units are reporting stable status, with 7 executive approvals currently pending your authorization.`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="space-y-4 pb-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl p-5 border border-[#E5EAE8] shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#073F37] text-[#22A06B] flex items-center justify-center border border-[#0E5A4F]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#18211F]">ASK SAMURA Executive Intelligence</h2>
            <p className="text-xs text-[#71807B]">Group-wide synthesized ERP analysis & instant intelligence</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#DCFCE7] text-[#166534] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#22A06B] animate-pulse"></span>
          <span>Online</span>
        </span>
      </div>

      {/* Chat Messages Card */}
      <div className="bg-white rounded-xl border border-[#E5EAE8] shadow-2xs p-5 min-h-[380px] flex flex-col justify-between">
        <div className="space-y-4 overflow-y-auto max-h-[480px] pr-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  m.sender === 'ai'
                    ? 'bg-[#073F37] text-white border border-[#0E5A4F]'
                    : 'bg-[#0E5A4F] text-white'
                }`}
              >
                {m.sender === 'ai' ? <Bot className="w-4 h-4 text-[#22A06B]" /> : <User className="w-4 h-4" />}
              </div>

              <div
                className={`p-3.5 rounded-xl max-w-xl text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'ai'
                    ? 'bg-[#F6F8F7] border border-[#E5EAE8] text-[#18211F]'
                    : 'bg-[#0E5A4F] text-white'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                <span
                  className={`text-[10px] block mt-1.5 ${
                    m.sender === 'ai' ? 'text-[#71807B]' : 'text-[#A3B8B0]'
                  }`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-[#71807B] p-2">
              <span className="w-2 h-2 rounded-full bg-[#0E5A4F] animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-[#0E5A4F] animate-bounce delay-100"></span>
              <span className="w-2 h-2 rounded-full bg-[#0E5A4F] animate-bounce delay-200"></span>
              <span className="ml-1 font-medium">SAMURA Intelligence synthesizing ERP data...</span>
            </div>
          )}
        </div>

        {/* Input Bar & Suggested Questions */}
        <div className="pt-4 border-t border-[#F1F5F4] mt-4 space-y-3">
          {/* Quick Prompts */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {sampleQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="text-[11px] px-2.5 py-1 bg-[#F6F8F7] hover:bg-[#E5EAE8] text-[#18211F] border border-[#E5EAE8] rounded-full whitespace-nowrap transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything about sales, finances, inventory, or shipments..."
              className="flex-1 text-xs sm:text-sm px-4 py-2.5 bg-[#F6F8F7] border border-[#E5EAE8] rounded-xl text-[#18211F] placeholder-[#71807B] focus:outline-none focus:border-[#0E5A4F] focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="p-2.5 bg-[#0E5A4F] hover:bg-[#135E54] active:bg-[#0B4A40] text-white rounded-xl disabled:opacity-50 transition-all cursor-pointer shadow-sm"
              aria-label="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
