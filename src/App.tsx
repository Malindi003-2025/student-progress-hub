import { useState } from 'react'
import Announcements from './pages/Announcements'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  return (
    <div className="App">
      <nav style={{ 
        padding: '1rem', 
        background: '#1f2937', 
        color: 'white',
        display: 'flex',
        gap: '1rem',
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0 }}>Student Progress Hub</h2>
        <button 
          onClick={() => setCurrentPage('home')}
          style={{ 
            padding: '0.5rem 1rem',
            background: currentPage === 'home'? '#3b82f6' : 'transparent',
            color: 'white',
            border: '1px solid white',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Home
        </button>
        <button 
          onClick={() => setCurrentPage('announcements')}
          style={{ 
            padding: '0.5rem 1rem',
            background: currentPage === 'announcements'? '#3b82f6' : 'transparent',
            color: 'white',
            border: '1px solid white',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Announcements
        </button>
      </nav>

      {currentPage === 'home' && (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Welcome to Student Progress Hub</h1>
          <p>Your academic management system</p>
        </div>
      )}
      
      {currentPage === 'announcements' && <Announcements />}
    </div>
  )
}

export default App
