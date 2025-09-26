import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './components/Auth'
import ChatPage from './components/Chat'

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/chat" />} />
        <Route path="/auth" element={<AuthPage/>} />
        <Route path="/chat" element={<ChatPage/>} />
      </Routes>
    </BrowserRouter>
  )
}
