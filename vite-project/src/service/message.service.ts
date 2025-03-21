import { Message } from "../models/message.models";
import { Contact } from "../models/contact.model";
import { nip19 } from "nostr-tools";

let selfNpub = '';
let listener: any;
export function addListener(a: any) {
    listener = a;
}

export function setSelfNPub(nPub: string) {
    selfNpub = nPub;
}

export function getAllMessages() : Message[] {
    let raw = localStorage.getItem("messages");
    return raw ? JSON.parse(raw)  : [];
}

export function getMessagesFromContact(contact: Contact) : Message[] {
    const messages = getAllMessages();
    const pk = nip19.decode(contact.pk).data;
    return messages.filter(x => x.from == pk || x.to == pk);
}

export function addMessage(message: Message) {
    const messages = getAllMessages();
    messages.push(message);

    localStorage.setItem("messages", JSON.stringify(messages));
}

export function recivedMessage(nPub: string, content: string, timestamp: number) { 
    const message : Message = {
        at: timestamp,
        from: nPub,
        to: selfNpub,
        content
    }

    addMessage(message);
    listener(message);
}
