import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar({ farmName, onFarmNameChange, isEditor }) {
  const location = useLocation()
  const [editing, setEditing] = useState(false)
  const [nameInput, setNameInput] = useState(farmName)

  function handleNameClick() {
    if (isEditor) {
      setNameInput(farmName)
      setEditing(true)
    }
  }

  function handleNameSubmit() {
    const trimmed = nameInput.trim()
    if (trimmed && trimmed !== farmName) {
      onFarmNameChange(trimmed)
    }
    setEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleNameSubmit()
    if (e.key === 'Escape') setEditing(false)
  }

  return (
    <nav className="bg-white border-b border-green-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left: Logo + Farm Name */}
        <div className="flex items-center gap-3">
          <span className="text-2xl select-none">🌾</span>
          <span className="font-bold text-green-800 text-lg tracking-wide">农场设计</span>
          <span className="text-green-300 select-none">|</span>
          {editing ? (
            <input
              autoFocus
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={handleKeyDown}
              className="border border-green-400 rounded-lg px-2 py-0.5 text-gray-800 text-sm font-medium outline-none focus:ring-2 focus:ring-green-300 w-40"
            />
          ) : (
            <span
              onClick={handleNameClick}
              className={`text-gray-700 font-medium text-sm ${
                isEditor ? 'cursor-pointer hover:text-green-700 hover:underline underline-offset-2 transition-colors' : ''
              }`}
              title={isEditor ? '点击编辑农场名称' : ''}
            >
              {farmName}
            </span>
          )}
        </div>

        {/* Right: Nav links */}
        <div className="flex items-center gap-1">
          <Link
            to="/"
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              location.pathname === '/'
                ? 'bg-green-100 text-green-800 shadow-inner'
                : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
            }`}
          >
            预览
          </Link>
          <Link
            to="/editor"
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              location.pathname === '/editor'
                ? 'bg-green-100 text-green-800 shadow-inner'
                : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
            }`}
          >
            编辑器
          </Link>
        </div>
      </div>
    </nav>
  )
}
