import { useEffect, useState } from "react";
import { Contact } from "../models/contact.model";
import * as ContactService from '../service/contact.service';
import { FaClipboard } from 'react-icons/fa';  // Importing the copy icon from react-icons
import * as NOSTRService from '../service/nostr.service'


function ContactList({ selectedContact, setSelectedContact }: any) {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [username, setUsername] = useState('');
    const [pk, setPk] = useState('');

    const [selfPk, setSelfPk] = useState('');
    const [privateKey, setPrivateKey] = useState('');

    useEffect(() => {
        setContacts(ContactService.getAllContacts());
    }, []);

    const addContact = (e: any) => {
        e.preventDefault();

        const contact = ContactService.addContact({ pk, username });
        setContacts([...contacts, contact]);
        setUsername('');
        setPk('');
    }

    const generateRandomKey = () => {
        const [_sk, _pk] = NOSTRService.login(undefined);
        setSelfPk(_pk);
        setPrivateKey(_sk);
        
    }

    const submitLogin = (e: any) => {
        e.preventDefault();

        const [_sk, _pk] = NOSTRService.login(privateKey);
        setSelfPk(_pk);

    }

    const handleCopy = (e: any) => {
        e.preventDefault();

        navigator.clipboard.writeText(selfPk).then(() => {
            alert('Text copied to clipboard!');
        }).catch(() => {
            alert('Failed to copy text: ');
        });
    }

    return (
        <div className="sidebar">
            <section>
                <form onSubmit={addContact}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Public key"
                        value={pk}
                        onChange={(e) => setPk(e.target.value)}
                        required
                    />
                    <button type="submit">Add Contact</button>
                </form>

                <h2>Contacts</h2>
                <ul>
                    {contacts.map(c => (
                        <li key={c.pk} className={selectedContact && selectedContact.pk == c.pk ? 'activate' : ''} onClick={() => setSelectedContact(c)}>{c.username}</li>
                    ))}
                </ul>
            </section>

            <section>
                <form onSubmit={submitLogin}>
                    <input
                        type="text"
                        placeholder="Private key"
                        value={privateKey}
                        onChange={(e) => setPrivateKey(e.target.value)}
                        required
                    />

                    <div className="copy-password-input-container">
                        <input
                            type="text" // Always visible text, since you want the copy functionality
                            value={selfPk}
                            disabled
                            className="copy-password-input"
                        />
                        <button className="copy-btn" onClick={handleCopy}>
                            <FaClipboard /> {/* Using the clipboard icon */}
                        </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
                        <button type="submit">Login</button>
                        <button type="button" onClick={() => generateRandomKey()}>Generate account</button>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default ContactList;