// Simple Node/Express server to proxy requests to OpenAI and handle Stripe webhook / checkout creation.
// Install: npm i express axios dotenv body-parser
const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')
require('dotenv').config()

const app = express()
app.use(bodyParser.json())

const OPENAI_KEY = process.env.OPENAI_API_KEY

app.post('/api/chat', async (req, res) => {
  try{
    const { messages, from, to } = req.body
    const system = `You are ChineseEasy assistant. Translate when requested and keep responses clear. From:${from} To:${to}. Always be helpful.`
    const userMessages = messages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }))

    const payload = {
      model: 'gpt-4o-mini',
      messages: [ { role: 'system', content: system }, ...userMessages ],
      max_tokens: 800
    }

    const resp = await axios.post('https://api.openai.com/v1/chat/completions', payload, {
      headers: { 'Authorization': `Bearer ${OPENAI_KEY}` }
    })

    const reply = resp.data.choices?.[0]?.message?.content || 'لا يوجد رد'
    res.json({ reply })
  }catch(e){
    console.error(e.response?.data || e.message)
    res.status(500).json({ error: 'OpenAI request failed' })
  }
})

app.post('/api/create-checkout-session', async (req,res)=>{
  // Implement Stripe server side: create Checkout session and send session.url to client
  res.json({ url: 'https://your-checkout.example' })
})

app.listen(3001, ()=> console.log('Server running on port 3001'))
