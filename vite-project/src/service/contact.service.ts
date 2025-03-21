import { Contact } from "../models/contact.model";

const KEY = 'dispatch_contacts';

export function getAllContacts() : Contact[] {
    const raw = localStorage.getItem(KEY);
    if(!raw) return [];

    return JSON.parse(raw) as Contact[];
}

export function getContactByPublicKey(pk: string) : Contact | undefined {
    const contacts = getAllContacts();
    return contacts.find(x => x.pk == pk);
}

export function addContact(contact: Contact) : Contact {
    const contacts = getAllContacts();
    const exist = contacts.find(x => x.pk == contact.pk);

    if(exist)
        throw new Error('contact with that public key already added in contact as ' + exist.username);

    contacts.push(contact);
    localStorage.setItem(KEY, JSON.stringify(contacts));
    return contact;
}