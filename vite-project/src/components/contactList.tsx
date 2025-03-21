import { useEffect, useState } from "react";
import { Contact } from "../models/contact.model";
import * as ContactService from '../service/contact.service';
import { FaClipboard, FaChevronDown, FaChevronUp } from 'react-icons/fa';  // Ajout des icônes pour l'accordéon
import * as NOSTRService from '../service/nostr.service'

function ContactList({ selectedContact, setSelectedContact, newMessages }: any) {
    const [contacts, setContacts] = useState<Contact[]>([]);

    const [nPub, setNPub] = useState<string | undefined>();
    const [nSec, setNSec] = useState<string | undefined>();

    const [pk, setPk] = useState<string>('');

    const [username, setUsername] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false); // État pour l'accordéon du profil

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

        setIsLoggedIn(true);
    }

    const submitLogin = (e: any) => {
        e.preventDefault();
        if (!nSec) return;

        const [_sk, _pk] = NOSTRService.login(nSec);

        setNPub(_pk);
        setNSec(_sk);

        setIsLoggedIn(true);
    }

    const handleCopy = (str: string | undefined) => {
        if (!str) return;

        navigator.clipboard.writeText(str).then(() => {
            alert('Clé copiée dans le presse-papiers!');
        }).catch(() => {
            alert('Échec de la copie de la clé');
        });
    }

    // Fonction pour basculer l'état de l'accordéon
    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
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

            {/* Afficher la section "Mon profil" avec accordéon après le login */}
            {isLoggedIn && (
                <section className="profile-section">
                    <img src="src/assets/logo.png" width="150px" className="logo" />

                    {/* En-tête de l'accordéon avec icône */}
                    <div 
                        className="profile-header" 
                        onClick={toggleProfile}
                        style={{ 
                            cursor: 'pointer', 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            padding: '10px',
                            backgroundColor: '#f5f5f5',
                            borderRadius: '5px',
                            marginBottom: isProfileOpen ? '10px' : '0'
                        }}
                    >
                        <h3 style={{ margin: 0 }}>Mon Profil</h3>
                        {isProfileOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </div>

                    {/* Contenu de l'accordéon qui s'affiche/se cache */}
                    {isProfileOpen && (
                        <div className="profile-info">
                            <label>Ma clé privée :</label>
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
                            
                            <label>Ma clé publique :</label>
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
                    )}
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
                className={selectedContact && selectedContact.pk === c.pk ? 'activate' : ''}
                onClick={() => setSelectedContact(c)}
            >
                <div className="avatar">
                    {c.username.charAt(0).toUpperCase()}
                </div>
                {c.username}
            </li>
        ))}
    </ul>
</div>

                </section>
            )}

            {isLoggedIn && (
                <form className="discussions-section" onSubmit={addContact}>
                    <input 
                        type="text" 
                        placeholder="Nom d'utilisateur" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input 
                        type="text" 
                        placeholder="Clé publique" 
                        value={pk}
                        onChange={(e) => setPk(e.target.value)}
                        required
                    />
                    <button type="submit">+ Ajouter un contact</button>
                </form>
            )}
        </div>
    );
}

export default ContactList;