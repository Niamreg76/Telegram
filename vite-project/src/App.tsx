import { useState } from 'react'
import './App.css'
import ContactList from './components/contactList'
import { Contact } from './models/contact.model';
import * as NOSTRService from './service/nostr.service'
import { Send } from 'lucide-react';

function App() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);

  NOSTRService.connect().catch(err => alert(err));

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() !== "") {
      const newMessage = { sender: "Moi", text: message };
      setMessages([...messages, newMessage]); // Ajoute le message à la liste
      setMessage(""); // Réinitialise l'input après envoi
    }
  };

  return (
    <>
      <ContactList selectedContact={selectedContact} setSelectedContact={setSelectedContact} />

      <div className="main-content">
        <h1>Welcome to the Contact Page</h1>
        <p>Here is where the main content will be displayed.</p>
        <p>Start a chat with {selectedContact?.username}.</p>

        {/* Affichage des messages */}
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender === "Moi" ? "sent" : "received"}`}>
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}
        </div>
      </div>



      {/* Input pour envoyer un message */}
      <div className="chat-container">
        <form onSubmit={handleSendMessage} className="chat-form">
          <input
            type="text"
            placeholder="Écrire un message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="chat-input"
          />
          <button type="submit" className="chat-send">
            <Send size={20} />
          </button>
        </form>
      </div>
    </>
  )
}

export default App;
