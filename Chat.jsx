import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { firebaseConfig } from '../firebaseConfig'

initializeApp(firebaseConfig)
const auth = getAuth()

const LANGS = [
  { code: 'zh', label: '中文' },
  { code: 'ar', label: 'العربية' }
]

export default function ChatPage(){
  const [user, setUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [fromLang, setFromLang] = useState('ar')
  const [toLang, setToLang] = useState('zh')
  const [loading, setLoading] = useState(false)
  const messagesRef = useRef(null)

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, u => setUser(u))
    return ()=>unsub()
  },[])

  useEffect(()=>{ messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' }) },[messages])

  const send = async ()=>{
    if(!input.trim()) return
    const userMsg = { role: 'user', text: input, from: fromLang, to: toLang, id: Date.now() }
    setMessages(prev=>[...prev, userMsg])
    setInput('')
    setLoading(true)
    try{
      const resp = await axios.post('/api/chat', {
        messages: [...messages, userMsg],
        from: fromLang,
        to: toLang
      })
      const aiText = resp.data.reply
      setMessages(prev=>[...prev, { role: 'assistant', text: aiText, id: Date.now()+1 }])
    }catch(e){
      console.error(e)
      alert('حدث خطأ في الترجمة / المحادثة')
    }finally{ setLoading(false) }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4 border-b border-white/10 flex items-center justify-between">
        <h1 className="text-xl">ChineseEasy</h1>
        <div className="flex gap-2 items-center">
          <select value={fromLang} onChange={e=>setFromLang(e.target.value)} className="p-2 bg-black border rounded">
            {LANGS.map(l=> <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
          <button className="p-2 border rounded" onClick={()=>{ const t=fromLang; setFromLang(toLang); setToLang(t); }}>↔</button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden p-4">
        <div ref={messagesRef} className="h-full overflow-auto flex flex-col gap-3 p-2">
          {messages.map(m=> (
            <div key={m.id} className={`max-w-3/4 p-3 rounded ${m.role==='user' ? 'self-end bg-white text-black' : 'self-start bg-white/10'}`}>
              <div className="whitespace-pre-wrap">{m.text}</div>
            </div>
          ))}
        </div>
      </main>

      <footer className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input value={input} onChange={e=>setInput(e.target.value)} className="flex-1 p-2 bg-black border rounded" placeholder={fromLang==='ar' ? 'اكتب بالعربية...' : '用中文输入...' } />
          <button className="px-4 py-2 border rounded" onClick={send} disabled={loading}>{loading ? '...' : 'إرسال'}</button>
        </div>
      </footer>
    </div>
  )
}
