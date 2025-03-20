
import { generateSecretKey, getPublicKey, finalizeEvent } from 'nostr-tools/pure'
import { Relay } from 'nostr-tools/relay'

const sk = generateSecretKey() // `sk` is a Uint8Array
const pk = getPublicKey(sk) // `pk` is a hex string

let relay: Relay | null = null;
export async function connect() {
    if (relay) {
        return
    }
    relay = await Relay.connect('wss://relay.mememaps.net/')
    console.log(`connected to ${relay.url}`)
    }

export async function subscribe() {
    if (!relay) {
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
    if (!relay) {
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