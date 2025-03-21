import { useEffect, useState } from "react";
import { Contact } from "../models/contact.model";
import * as ContactService from '../service/contact.service';
import { FaClipboard, FaChevronDown, FaChevronUp, FaTrash } from 'react-icons/fa';  // Ajout de l'icône de suppression
import * as NOSTRService from '../service/nostr.service'
import { nip19 } from "nostr-tools";
import { Message } from "../models/message.models";

export type ContactListProps = {
    selectedContact: Contact | null,
    setSelectedContact: any,
    newMessages: Message[],
    setNewMessage: any
 }

function ContactList({ selectedContact, setSelectedContact, newMessages, setNewMessage }: ContactListProps) {
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

    useEffect(() => {
        const news: Message[] = newMessages.filter((x: Message) => nip19.npubEncode(x.from) == selectedContact?.pk);

        if (news.length) {
            setNewMessage(newMessages.filter((x: Message) => nip19.npubEncode(x.from) != selectedContact?.pk))
        }
    }, [newMessages])

    const addContact = (e: any) => {
        e.preventDefault();
        const contact = ContactService.addContact({ pk, username });
        setContacts([...contacts, contact]);
        setUsername('');
        setPk('');
    }

    // Nouvelle fonction pour supprimer un contact
    const deleteContact = (contactPk: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Empêche le déclenchement du onClick du li parent
        
        if (window.confirm(`Voulez-vous vraiment supprimer ce contact ?`)) {
            // Appel au service de suppression (à implémenter dans contact.service.ts)
            ContactService.deleteContact(contactPk);
            
            // Mise à jour de l'état local
            const updatedContacts = contacts.filter(c => c.pk !== contactPk);
            setContacts(updatedContacts);
            
            // Si le contact supprimé est celui qui est sélectionné, désélectionner
            if (selectedContact && selectedContact.pk === contactPk) {
                setSelectedContact(null);
            }
        }
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
                                    <section className="contact-header">
                                        <section>
                                            <div className="avatar">
                                                {c.username.charAt(0).toUpperCase()}
                                            </div>
                                            {c.username}
                                        </section>
                                        
                                        <div className="contact-actions">
                                            {newMessages.filter(x => nip19.npubEncode(x.from) == c?.pk).length > 0 && (
                                                <div className="badge">{newMessages.filter(x => nip19.npubEncode(x.from) == c?.pk).length}</div>
                                            )}
                                            <button 
                                                className="delete-btn" 
                                                onClick={(e) => deleteContact(c.pk, e)}
                                                title="Supprimer ce contact"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </section>
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