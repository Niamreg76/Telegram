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
            <img src="src/assets/logo.png" width="150px" class="logo"></img>
            <h2>Connexion</h2>

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

                        <button type="submit">Connexion</button>
                        <button type="button" onClick={() => generateRandomKey()}>Créer un compte</button>
                </form>
            </section>


            <section>
    <h2>Discussions</h2>
    <ul>
        {contacts.map(c => (
            <li
                key={c.pk}
                className={selectedContact && selectedContact.pk == c.pk ? 'activate' : ''}
                onClick={() => setSelectedContact(c)}
            >
                {c.username}
            </li>
        ))}
    </ul>
    <ul>
        {['Alice', 'Bob', 'Charlie'].map((name, index) => (
            <li key={index}>
                <strong>{name}</strong><p>Dernier message reçu : "Coucou, ça va ?"</p>
            </li>
        ))}
    </ul>


        <button type="submit">+ Ajouter un contact</button>
</section>

        </div>
    );
}

export default ContactList;