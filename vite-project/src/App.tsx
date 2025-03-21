import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'
import ContactList from './components/contactList'
import { Contact } from './models/contact.model'
import * as NOSTRService from './service/nostr.service'
import * as MessageService from './service/message.service'
import { Send } from 'lucide-react'
import { Message } from './models/message.models'
import { nip19 } from 'nostr-tools'

function App() {
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessages, setNewMessages] = useState<Message[]>([]);

    const messagesEndRef = useRef<HTMLDivElement>(null)

    const [message, setMessage] = useState<string>("")


    const handleMessageReception = useCallback((msg: Message) => {
        setNewMessages((prev) => [...prev, msg]);
    }, [selectedContact]);

    useEffect(() => {
        NOSTRService.connect().catch(err => alert(err))
        MessageService.addListener((a: Message) => handleMessageReception(a))
    }, []) 
    
    useEffect(() => {
        const news = newMessages.filter(x => nip19.npubEncode(x.from) == selectedContact?.pk);
        setMessages([...messages, ...news ])
    }, [newMessages])

    useEffect(() => {
        if (!selectedContact) return;

        setMessages(MessageService.getMessagesFromContact(selectedContact));
        setNewMessages([...newMessages.filter(x => x.from == selectedContact.pk)]);
    }, [selectedContact])

    useEffect(() => {
        // Scroll to bottom whenever messages change
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()

        let content = message.trim();

        if (!content || content === '' || !selectedContact) return;

        NOSTRService.sendMessage(selectedContact.pk, content)
            .then(msg => {
                MessageService.addMessage(msg);
                setMessages([...messages, msg]);
            })
            .catch(err => alert(err));
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    return (
        <div className="app-container">
            <div className="messenger-layout">
                <div className="sidebar-container">
                    <ContactList
                        selectedContact={selectedContact}
                        setSelectedContact={setSelectedContact}
                        newMessages={newMessages}
                    />
                </div>

                <div className="chat-area">
                    {selectedContact ? (
                        <>
                            <div className="chat-header">
                                <div className="contact-info">
                                    <div className="contact-avatar">
                                        {selectedContact.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h2>{selectedContact.username}</h2>
                                        <span className="status-indicator">En ligne</span>
                                    </div>
                                </div>
                            </div>

                            <div className="messages-container">
                                {messages.length === 0 ? (
                                    <div className="empty-chat">
                                        <p>Commencez à discuter avec {selectedContact.username}</p>
                                    </div>
                                ) : (
                                    messages.map((msg, index) => (
                                        <div
                                            key={index}
                                            className={`message-bubble ${nip19.npubEncode(msg.from) === selectedContact.pk ? "received" : "sent"}`}
                                        >
                                            <div className="message-content">{msg.content}</div>
                                            <div className="message-timestamp">{formatTime(new Date(msg.at * 1000))}</div>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <form onSubmit={handleSendMessage} className="message-input-container">
                                <input
                                    type="text"
                                    placeholder={`Message à ${selectedContact.username}...`}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="message-input"
                                />
                                <button
                                    type="submit"
                                    className="send-button"
                                    disabled={!message.trim()}
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="no-chat-selected">
                            <h2>Sélectionnez un contact pour commencer une conversation</h2>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default App