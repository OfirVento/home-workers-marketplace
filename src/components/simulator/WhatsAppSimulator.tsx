"use client";

import React, { useState, useEffect, useRef } from 'react';
import { YONI_SCRIPT } from '../../lib/yoni_script';
import { FLOW_IDS, Step } from '../../lib/types';

interface Message {
    sender: 'bot' | 'user';
    text?: string;
    image?: string;
    timestamp: string;
}

export default function WhatsAppSimulator() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentStepId, setCurrentStepId] = useState<string>(FLOW_IDS.WELCOME);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const currentStep = YONI_SCRIPT[currentStepId];

    // Auto-scroll
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(scrollToBottom, [messages]);

    // Initial bot message on load (or when step changes to a bot message step)
    useEffect(() => {
        if (!currentStep) return;

        // Add bot message
        const newMessage: Message = {
            sender: 'bot',
            text: currentStep.text || '',
            image: currentStep.imageArg,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // Prevent duplicate messages if re-rendering (simple check)
        setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last?.text === newMessage.text && last?.image === newMessage.image && last?.sender === 'bot') return prev;
            return [...prev, newMessage];
        });

    }, [currentStepId]);

    const handleUserResponse = (response: string, isButton = false) => {
        if (!currentStep) return;

        // Add user message
        const userMsg: Message = {
            sender: 'user',
            text: response,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, userMsg]);

        // Save answer
        if (currentStep.saveField) {
            setAnswers(prev => ({ ...prev, [currentStep.saveField!]: response })); // For multiselect this needs logic, implementing basic overwrite for now
        }

        // Determine next step
        if (currentStep.next) {
            const nextId = currentStep.next(response);

            // Delay for "typing" effect
            setTimeout(() => {
                if (nextId === 'MATCH_FLOW') {
                    // End of flow demo
                    const finalMsg: Message = {
                        sender: 'bot',
                        text: "(End of MVP Flow - In real app, match cards would appear here)",
                        timestamp: new Date().toLocaleTimeString()
                    };
                    setMessages(prev => [...prev, finalMsg]);
                } else if (nextId === 'IDLE') {
                    // Do nothing
                } else {
                    setCurrentStepId(nextId);
                }
            }, 800);
        }
    };

    const handleSendText = () => {
        if (!inputText.trim()) return;
        handleUserResponse(inputText);
        setInputText('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSendText();
    };

    if (!currentStep) return <div>Loading...</div>;

    return (
        <div className="whatsapp-container" style={{
            width: '100%',
            maxWidth: '400px',
            height: '800px',
            margin: '0 auto',
            border: '12px solid #333',
            borderRadius: '40px',
            backgroundColor: '#e5ddd5', // WhatsApp default bg color
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }}>
            {/* Phone Notch/Status Bar Simulation */}
            <div style={{ background: '#075e54', padding: '10px 15px', color: 'white', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 10 }}>
                <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#075e54', fontWeight: 'bold' }}>
                    Y
                </div>
                <div>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Yoni (יוני)</div>
                    <div style={{ fontSize: '11px', opacity: 0.8 }}>עסקי • מחובר כעת</div>
                </div>
            </div>

            {/* Chat Area */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', // Generic whatsapp pattern
                backgroundSize: '400px',
                backgroundBlendMode: 'soft-light'
            }}>
                {messages.map((msg, idx) => (
                    <div key={idx} style={{
                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '80%',
                        backgroundColor: msg.sender === 'user' ? '#dcf8c6' : '#ffffff',
                        color: '#111',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
                        position: 'relative',
                        fontSize: '14px',
                        lineHeight: '1.4'
                    }}>
                        {msg.image && (
                            <div style={{ marginBottom: '8px', borderRadius: '8px', overflow: 'hidden' }}>
                                <img src={msg.image} alt="simulated media" style={{ width: '100%', height: 'auto', display: 'block' }} />
                            </div>
                        )}
                        <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
                        <div style={{
                            fontSize: '10px',
                            color: '#999',
                            textAlign: msg.sender === 'user' ? 'right' : 'right',
                            marginTop: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            gap: '4px'
                        }}>
                            {msg.timestamp}
                            {msg.sender === 'user' && <span style={{ color: '#4fc3f7' }}>✓✓</span>}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input / Buttons Area */}
            <div style={{ background: '#f0f0f0', padding: '10px' }}>
                {/* Render Buttons if simulated */}
                {(currentStep.inputType === 'buttons' || currentStep.inputType === 'mixed') && currentStep.buttons && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px', justifyContent: 'center' }}>
                        {currentStep.buttons.map(btn => (
                            <button
                                key={btn}
                                onClick={() => handleUserResponse(btn, true)}
                                style={{
                                    background: 'white',
                                    border: '1px solid #ddd',
                                    borderRadius: '20px',
                                    padding: '8px 16px',
                                    color: '#075e54',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                    fontSize: '14px'
                                }}
                            >
                                {btn}
                            </button>
                        ))}
                    </div>
                )}

                {/* Image Upload Simulation */}
                {currentStep.inputType === 'image' && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                        <button
                            onClick={() => handleUserResponse("📷 [תמונה נשלחה]", false)}
                            style={{
                                background: 'white',
                                border: '1px dashed #075e54',
                                borderRadius: '8px',
                                padding: '15px 30px',
                                color: '#075e54',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <span>📷</span> לחץ להעלאת תמונה
                        </button>
                    </div>
                )}

                {/* Text Input */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '8px 12px', borderRadius: '24px' }}>
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="הקלד הודעה..."
                        style={{ border: 'none', flex: 1, outline: 'none', direction: 'rtl', color: '#111' }}
                        disabled={currentStep.inputType === 'buttons'} // Disable text if strictly buttons (unless mixed)
                    />
                    <button
                        onClick={handleSendText}
                        style={{
                            background: '#075e54',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '36px',
                            height: '36px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        ➤
                    </button>
                </div>
            </div>
        </div>
    );
}
