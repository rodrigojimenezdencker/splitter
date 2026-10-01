import { useMemo, useState } from 'react'
import { balances, settle, type Expense } from './settle'
import './index.css'

const people = ['Ana', 'Ben', 'Cris']
const eur = (n: number) => n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', payer: 'Ana', amount: 90, participants: people, note: 'Apartment, night 1' },
    { id: '2', payer: 'Ben', amount: 36.5, participants: ['Ben', 'Cris'], note: 'Dinner' },
  ])
  const [note, setNote] = useState(''); const [amount, setAmount] = useState(''); const [payer, setPayer] = useState(people[0])
  const [who, setWho] = useState<string[]>(people)
  const b = useMemo(() => balances(people, expenses), [expenses])
  const transfers = useMemo(() => settle(b), [b])
  const valid = Number(amount) > 0 && who.length > 0

  const add = (e: React.FormEvent) => {
    e.preventDefault(); if (!valid) return
    setExpenses([...expenses, { id: crypto.randomUUID(), payer, amount: Number(amount), participants: who, note: note || 'Expense' }])
    setNote(''); setAmount('')
  }
  return (
    <main>
      <h1>Trip splitter</h1>
      <form onSubmit={add} className="add">
        <label>What<input value={note} onChange={(e) => setNote(e.target.value)} /></label>
        <label>Amount (EUR)<input inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} /></label>
        <label>Paid by<select value={payer} onChange={(e) => setPayer(e.target.value)}>{people.map((p) => <option key={p}>{p}</option>)}</select></label>
        <fieldset><legend>Split between</legend>
          {people.map((p) => <label key={p} className="chk"><input type="checkbox" checked={who.includes(p)}
            onChange={(e) => setWho(e.target.checked ? [...who, p] : who.filter((x) => x !== p))} />{p}</label>)}</fieldset>
        <button disabled={!valid}>Add expense</button>
      </form>
      <section><h2>Expenses</h2><ul>{expenses.map((x) => <li key={x.id}><span>{x.note} <small>({x.payer} paid, split {x.participants.length})</small></span><b>{eur(x.amount)}</b></li>)}</ul></section>
      <section><h2>Settle up</h2>
        {transfers.length ? <ul>{transfers.map((t, i) => <li key={i}><span>{t.from} pays {t.to}</span><b>{eur(t.amount)}</b></li>)}</ul> : <p>All even.</p>}</section>
    </main>
  )
}
