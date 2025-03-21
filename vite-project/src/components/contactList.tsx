import { useEffect, useState } from "react";
import { Contact } from "../models/contact.model";
import * as ContactService from '../service/contact.service';
import { FaClipboard } from 'react-icons/fa';  // Importing the copy icon from react-icons
import * as NOSTRService from '../service/nostr.service'

function ContactList({ selectedContact, setSelectedContact }: any) {
    const [contacts, setContacts] = useState<Contact[]>([]);

    const [nPub, setNPub] = useState<string | undefined>();
    const [nSec, setNSec] = useState<string | undefined>();

    const [pk, setPk] = useState<string>('');

    const [username, setUsername] = useState('');
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

        setNPub(_pk);
        setNSec(_sk);

        setIsLoggedIn(true); // Marquer comme connecté après un login réussi
    }

    const submitLogin = (e: any) => {
        e.preventDefault();
        if (!nSec) return;

        const [_sk, _pk] = NOSTRService.login(nSec);

        setNPub(_pk);
        setNSec(_sk);

        setIsLoggedIn(true); // Marquer comme connecté après un login réussi
    }

    const handleCopy = (str: string | undefined) => {
        if (!str) return;

        navigator.clipboard.writeText(str).then(() => {
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
                            value={nSec}
                            onChange={(e) => setNSec(e.target.value)}
                            required
                        />

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
                        <label>Private Key :</label>
                        <div className="copy-password-input-container">
                            <input
                                type="text"
                                value={nSec}
                                disabled
                                className="copy-password-input"
                            />
                            <button className="copy-btn" onClick={() => handleCopy(nSec)}>
                                <FaClipboard />
                            </button>
                        </div>
                        
                        <label>Public Key :</label>
                        <div className="copy-password-input-container">
                            <input
                                type="text"
                                value={nPub}
                                disabled
                                className="copy-password-input"
                            />
                            <button className="copy-btn" onClick={() => handleCopy(nPub)}>
                                <FaClipboard />
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {isLoggedIn && (
                <section className="contact-section">
                    <h3>Mes contacts</h3>
                    <div className="contact-info">
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
                    </div>
                </section>
            )}

            {/* Afficher la section des discussions juste après "Mon profil" */}
            {isLoggedIn && (
                <form className="discussions-section" onSubmit={addContact}>
                    
                    <button type="submit">+ Ajouter un contact</button>
                </form>
            )}
        </div>
    );
}

export default ContactList;
