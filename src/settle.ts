export interface Expense { id: string; payer: string; amount: number; participants: string[]; note: string }
export interface Transfer { from: string; to: string; amount: number }

const cents = (n: number) => Math.round(n * 100)

/** Net balance per person in cents. Positive = is owed money. */
export function balances(people: string[], expenses: Expense[]): Record<string, number> {
  const b: Record<string, number> = Object.fromEntries(people.map((p) => [p, 0]))
  for (const e of expenses) {
    const total = cents(e.amount)
    const n = e.participants.length
    if (!n || total <= 0) continue
    const share = Math.floor(total / n)
    let rest = total - share * n // leftover cents go to the first participants
    b[e.payer] = (b[e.payer] ?? 0) + total
    for (const p of e.participants) {
      const extra = rest > 0 ? 1 : 0
      rest -= extra
      b[p] = (b[p] ?? 0) - share - extra
    }
  }
  return b
}

/** Greedy settle-up: few transfers, not guaranteed minimal in every case. */
export function settle(b: Record<string, number>): Transfer[] {
  const debtors = Object.entries(b).filter(([, v]) => v < 0).map(([k, v]) => ({ k, v: -v })).sort((a, z) => z.v - a.v)
  const creditors = Object.entries(b).filter(([, v]) => v > 0).map(([k, v]) => ({ k, v })).sort((a, z) => z.v - a.v)
  const out: Transfer[] = []
  let i = 0, j = 0
  while (i < debtors.length && j < creditors.length) {
    const pay = Math.min(debtors[i].v, creditors[j].v)
    out.push({ from: debtors[i].k, to: creditors[j].k, amount: pay / 100 })
    debtors[i].v -= pay; creditors[j].v -= pay
    if (debtors[i].v === 0) i++
    if (creditors[j].v === 0) j++
  }
  return out
}
