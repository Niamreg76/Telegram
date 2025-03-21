import { generateSecretKey, getPublicKey, finalizeEvent, EventTemplate, } from 'nostr-tools/pure'
import { bytesToHex, hexToBytes } from '@noble/hashes/utils'
import { Relay, Subscription } from 'nostr-tools/relay'
import { recivedMessage } from './chat.service';

import * as nip19 from 'nostr-tools/nip19'

export const RELAY_NAME = 'wss://relay.mememaps.net/';

type Account = { nPub: string; nSec: Uint8Array }

export let relay: Relay | undefined;
export let account: Account | undefined;
export let subscription: Subscription | undefined;

export async function connect() {
    if (relay) return;

    relay = await Relay.connect(RELAY_NAME);
}

export function login(privateKey: string | null) {
    if (!relay)
        throw new Error("Connection to the relay not establish");

    // generation des clefs
    if (account) logout();

    const nSec = privateKey ? nip19.decode(privateKey).data as Uint8Array : generateSecretKey();
    account = { nSec, nPub: getPublicKey(nSec) };

    // subscribe
    const lastUpdate = Number.parseInt(localStorage.getItem('dispatch_contacts_lastupdate') ?? Math.floor(Date.now() / 1000).toString());

    subscription = relay.subscribe([{
        kinds: [1],
        since: lastUpdate,
        '#t': ['send-to-' + account.nPub]
    }], {
        onevent(event) {
            recivedMessage(event.pubkey, decrypt(event.content, account!.nSec), event.created_at);

            localStorage.setItem('dispatch_contacts_lastupdate', Math.floor(Date.now() / 1000).toString());
        },
    });

    localStorage.setItem('dispatch_contacts_lastupdate', Math.floor(Date.now() / 1000).toString());

    return [nip19.nsecEncode(account.nSec), nip19.npubEncode(account.nPub)];
}

export function logout() {
    if (subscription) {
        subscription.close('logout');
        subscription = undefined;
    }
}

export async function sendMessage(destinationPk: string, message: string) {
    if (!relay || !account) {
        throw new Error('Not connected')
    }

    const eventTemplate = {
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [['t', 'send-to-' + destinationPk]],
        content: encrypt(message, destinationPk),
    }

    console.log('sending message', eventTemplate)
    const signedEvent = finalizeEvent(eventTemplate, account.nSec)
    return relay.publish(signedEvent);
}


// TODO
function encrypt(str: string, nPub: string) { 
    return str;
}

function decrypt(str: string, nSec: Uint8Array) {
    return str;
}