import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { MessageSquare, X, Send, Bot, Sparkles, User, Loader2 } from 'lucide-react';
import axiosInstance from '@/services/axiosInstance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

const AIChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 'initial', sender: 'ai', text: 'Hello! I am your Sisenco Assistant. I can summarize team reports, find blockers, or check workload distribution. How can I help?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const suggestedPrompts = [
        "Summarize this week's completed work.",
        "Are there any recurring blockers?",
        "Who has the highest workload?"
    ];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (textToSend = input) => {
        if (!textToSend.trim()) return;
        
        const userMsg = { id: `user-${Date.now()}`, sender: 'user', text: textToSend };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await axiosInstance.post('/ai/chat', { prompt: textToSend });
            const aiMsg = { id: `ai-${Date.now()}`, sender: 'ai', text: res.data.reply };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error(error);
            const errorMsg = { id: `err-${Date.now()}`, sender: 'ai', text: 'Sorry, I am having trouble connecting to the server.' };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen && (
                <Card className="w-80 sm:w-96 h-[500px] mb-4 shadow-2xl border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
                    <CardHeader className="bg-slate-900 text-white p-4 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-blue-400" /> Sisenco Intelligence
                        </CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white hover:bg-slate-800 h-8 w-8 rounded-full">
                            <X className="w-4 h-4" />
                        </Button>
                    </CardHeader>
                    
                    <CardContent className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-blue-600 shadow-sm'}`}>
                                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </div>
                                <div className={`p-3 rounded-2xl text-sm font-medium leading-relaxed max-w-[80%] ${
                                    msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-700 shadow-sm rounded-tl-sm'
                                }`}>
                                    <ReactMarkdown components={{
                                        p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                                        strong: ({children}) => <strong className="font-bold text-slate-900">{children}</strong>,
                                        ul: ({children}) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                                        li: ({children}) => <li className="mb-1">{children}</li>
                                    }}>
                                        {msg.text}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-center gap-2 text-slate-500 text-sm italic">
                                <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </CardContent>

                    <CardFooter className="p-3 bg-white border-t border-slate-100 flex flex-col gap-3">
                        {messages.length < 3 && (
                            <div className="flex flex-wrap gap-2 w-full">
                                {suggestedPrompts.map((prompt, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => handleSend(prompt)}
                                        className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-1.5 rounded-lg hover:bg-blue-100 transition-colors text-left"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        )}
                        <form 
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="flex items-center gap-2 w-full"
                        >
                            <Input 
                                placeholder="Ask about team activity..." 
                                value={input} 
                                onChange={(e) => setInput(e.target.value)}
                                className="rounded-full bg-slate-50 border-slate-200 h-10"
                            />
                            <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="rounded-full bg-blue-600 hover:bg-blue-700 h-10 w-10 shrink-0">
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            )}

            <Button onClick={() => setIsOpen(!isOpen)} className="h-14 w-14 rounded-full shadow-2xl transition-all duration-300 bg-blue-600 hover:bg-blue-700">
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </Button>
        </div>
    );
};

export default AIChatWidget;