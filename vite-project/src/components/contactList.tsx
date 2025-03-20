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
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Ajout d'un état pour savoir si l'utilisateur est connecté

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
        const [_sk, _pk] = NOSTRService.login(null);
        setSelfPk(_pk);
        setPrivateKey(_sk);
    }

    const submitLogin = (e: any) => {
        e.preventDefault();
        const [_sk, _pk] = NOSTRService.login(privateKey);
        setSelfPk(_pk);
        setIsLoggedIn(true); // Marquer comme connecté après un login réussi
    }

    const handleCopy = (e: any) => {
        e.preventDefault();
        navigator.clipboard.writeText(selfPk).then(() => {
            alert('Clé publique copiée dans le presse-papiers!');
        }).catch(() => {
            alert('Échec de la copie de la clé publique');
        });
    }

    return (
        <div className="sidebar">
            {/* Afficher le formulaire de connexion si l'utilisateur n'est pas connecté */}
            {!isLoggedIn && (
                <section>
                    <img src="src/assets/logo.png" width="150px" className="logo" />
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
                                type="text"
                                value={selfPk}
                                disabled
                                className="copy-password-input"
                            />
                            <button className="copy-btn" onClick={handleCopy}>
                                <FaClipboard />
                            </button>
                        </div>

                        <button type="submit">Connexion</button>
                        <button type="button" onClick={() => generateRandomKey()}>Créer un compte</button>
                    </form>
                </section>
            )}

            {/* Afficher la section "Mon profil" avec la clé publique après le login */}
            {isLoggedIn && (
                <section className="profile-section">
                    <h3>Mon Profil</h3>
                    <div className="profile-info">
                        <div className="copy-password-input-container">
                            <input
                                type="text"
                                value={selfPk}
                                disabled
                                className="copy-password-input"
                            />
                            <button className="copy-btn" onClick={handleCopy}>
                                <FaClipboard />
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {/* Afficher la section des discussions juste après "Mon profil" */}
            {isLoggedIn && (
                <section className="discussions-section">
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

                    <h3>Discussions</h3>
                    <ul>
                        {['Alice', 'Bob', 'Charlie', 'Maëlys', 'Quentin', 'Roman'].map((name, index) => (
                            <li key={index}>
                                <strong>{name}</strong><p>Dernier message reçu : "Coucou, ça va ?"</p>
                            </li>
                        ))}
                    </ul>

                    <button type="submit">+ Ajouter un contact</button>
                </section>
            )}
        </div>
    );
}

export default ContactList;
