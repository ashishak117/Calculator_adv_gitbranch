import { useState } from 'react'

export default function App() {
  // Minimal placeholder (we’ll build the real calculator on a feature branch)
  const [message] = useState('Calculator App – Baseline')

  return (
    <div className="app">
      <header className="header">
        <h1>{message}</h1>
        <p>Branching workflow: main → develop → feature/* → release/*</p>
      </header>

      <div className="placeholder">
        <p>Next step: create <code>feature/calculator-ui</code> and build the UI.</p>
      </div>

      <footer className="footer">
        <small>Vite + React • v0.1.0</small>
      </footer>
    </div>
  )
}
