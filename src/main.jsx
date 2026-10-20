import React from 'react'
import { createRoot } from 'react-dom/client'
import Presentaties from './Presentaties.jsx'
import './style.css'

class ErrorBoundary extends React.Component {
  state = { error: null }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) return <main className="error"><h1>Presentatie kan niet laden</h1><p>{this.state.error.message}</p><p>Controleer het compacte meetingbestand.</p></main>
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(<ErrorBoundary><Presentaties /></ErrorBoundary>)
