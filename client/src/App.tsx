import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

interface User {
  id: number
  name: string
  email: string
  phone: string
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('http://localhost:8000/api/user')
      .then(res => res.json())
      .then(data => {
        setUser(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>

        <div style={{ marginTop: '40px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <h2>User Information</h2>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
          {user && (
            <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '3px', overflow: 'auto' }}>
              {JSON.stringify(user, null, 2)}
            </pre>
          )}
        </div>
      </section>
    </>
  )
}

export default App
