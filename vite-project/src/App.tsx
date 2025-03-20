import { useState } from 'react'
import './App.css'
import ContactList from './components/contactList'
import { Contact } from './models/contact.model';
import * as NOSTRService from './service/nostr.service'

function App() {
  const [selectedContact, setSelectedContact] = useState<Contact|null>();

  NOSTRService.connect().then(_ => {
  
  }).catch(err => alert(err))

  return (
    <>
      <ContactList selectedContact={selectedContact} setSelectedContact={setSelectedContact} />

      <div className="main-content">
        <h1>Welcome to the Contact Page</h1>
        <p>Here is where the main content will be displayed.</p>
        <p>Start a chat with {selectedContact?.username}.</p>
      </div>
    </>
  )
}

export default App
