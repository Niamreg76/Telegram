import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { generateSecretKey, getPublicKey, finalizeEvent } from 'nostr-tools/pure'
import { Relay } from 'nostr-tools/relay'

const sk = generateSecretKey() // `sk` is a Uint8Array
const pk = getPublicKey(sk) // `pk` is a hex string

function App() {
  const [count, setCount] = useState(0)

  Relay.connect('wss://relay.mememaps.net/').then((relay) => {
    console.log(`connected to ${relay.url}`)

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

    const eventTemplate = {
      kind: 1,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: 'hello worlds',
    }
    
    // this assigns the pubkey, calculates the event id and signs the event in a single step
    const signedEvent = finalizeEvent(eventTemplate, sk)
    relay.publish(signedEvent).then((event) => {
      console.log('published event:', event)
    })
  })

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Dispatch</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <div>
        <h1>Secret Key</h1>
        <p>{sk}</p>
        
        <h1>Public Key</h1>
        <p>{pk}</p>
      </div>
    </>
  )
}

export default App
