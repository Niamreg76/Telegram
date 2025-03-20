import { generateSecretKey, getPublicKey, finalizeEvent,  } from 'nostr-tools/pure'
import { bytesToHex, hexToBytes } from '@noble/hashes/utils'
import { Relay } from 'nostr-tools/relay'

let sk: Uint8Array | undefined;
let pk: string | undefined;

export let relay: Relay | null = null;

export function login(_sk: string | undefined) : string[] {

    sk = _sk ? hexToBytes(_sk) : generateSecretKey();

    pk = getPublicKey(sk);

    return [bytesToHex(sk), pk];
}

export async function connect() {
    if (relay) {
        return
    }

    relay = await Relay.connect('wss://relay.mememaps.net/')
    console.log(`connected to ${relay.url}`)
}

export async function subscribe() {
    if (!relay || !pk || !sk) {
        throw new Error('Not connected')
    }
    relay.subscribe([
        {
            kinds: [1],
            authors: [pk],
        },
    ], {
        onevent(event) {
            console.log('got event:', event)
        }
    })
}

export async function sendMessage(message: string) {
    if (!relay || !pk || !sk) {
        throw new Error('Not connected')
    }
    const eventTemplate = {
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: message,
    }
    const signedEvent = finalizeEvent(eventTemplate, sk)
    return relay.publish(signedEvent)
}