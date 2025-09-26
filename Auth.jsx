import React, {useEffect, useState} from 'react'
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth'
import { firebaseConfig } from '../firebaseConfig'

initializeApp(firebaseConfig)
const auth = getAuth()

export default function AuthPage(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [mode, setMode] = useState('login')

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, u => setUser(u))
    return ()=>unsub()
  },[])

  const handleAuth = async ()=>{
    try{
      if(mode === 'login'){
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
    }catch(e){
      alert(e.message)
    }
  }

  if(user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 rounded-lg border border-white/10 w-full max-w-md text-center">
        <h2 className="text-2xl mb-4">مرحباً، {user.email}</h2>
        <p className="mb-6">اضغط تسجيل الخروج لتجربة حساب آخر</p>
        <button className="px-4 py-2 border rounded" onClick={()=>signOut(auth)}>تسجيل خروج</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 border border-white/10 rounded">
        <h1 className="text-xl mb-4">ChineseEasy — تسجيل الدخول / إنشاء حساب</h1>
        <div className="mb-3">
          <input className="w-full p-2 bg-black border border-white/10 rounded" placeholder="البريد الإلكتروني" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <input type="password" className="w-full p-2 bg-black border border-white/10 rounded" placeholder="كلمة المرور" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <div className="flex gap-2 mb-4">
          <button className="flex-1 p-2 border rounded" onClick={()=>{setMode('login')}}>دخول</button>
          <button className="flex-1 p-2 border rounded" onClick={()=>{setMode('signup')}}>إنشاء حساب</button>
        </div>
        <button className="w-full p-2 border rounded" onClick={handleAuth}>{mode === 'login' ? 'دخول' : 'سجل الآن'}</button>
      </div>
    </div>
  )
}
