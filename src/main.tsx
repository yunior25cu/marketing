import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app/App'
import './brand/styles/reset.css'
import './brand/styles/typography.css'
import './brand/styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
