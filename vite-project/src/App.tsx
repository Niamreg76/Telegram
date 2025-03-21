import { useState, useEffect, useRef } from 'react'
import './App.css'
import ContactList from './components/contactList'
import { Contact } from './models/contact.model'
import * as NOSTRService from './service/nostr.service'
import { Send } from 'lucide-react'

function App() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [message, setMessage] = useState<string>("")
  const [messages, setMessages] = useState<{ sender: string; text: string; timestamp: Date }[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    NOSTRService.connect().catch(err => alert(err))
  }, [])

  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() !== "" && selectedContact) {
      const newMessage = { 
        sender: "Moi", 
        text: message,
        timestamp: new Date()
      }
      setMessages([...messages, newMessage])
      setMessage("")
      
      // Simuler une réponse après 1-3 secondes
      if (Math.random() > 0.7) {
        setTimeout(() => {
          const replyMessage = {
            sender: selectedContact.username,
            text: `Ceci est une réponse automatique de ${selectedContact.username}`,
            timestamp: new Date()
          }
          setMessages(prev => [...prev, replyMessage])
        }, 1000 + Math.random() * 2000)
      }
    }
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
                      className={`message-bubble ${msg.sender === "Moi" ? "sent" : "received"}`}
                    >
                      <div className="message-content">{msg.text}</div>
                      <div className="message-timestamp">{formatTime(msg.timestamp)}</div>
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