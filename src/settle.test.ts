import { describe, expect, it } from 'vitest'
import { balances, settle, type Expense } from './settle'

const ppl = ['Ana', 'Ben', 'Cris']
const ex = (payer: string, amount: number, participants = ppl): Expense => ({ id: payer + amount, payer, amount, participants, note: '' })

describe('balances', () => {
  it('splits evenly', () => {
    expect(balances(ppl, [ex('Ana', 30)])).toEqual({ Ana: 2000, Ben: -1000, Cris: -1000 })
  })
  it('keeps cents consistent (balances always sum to 0)', () => {
    const b = balances(ppl, [ex('Ana', 10), ex('Ben', 0.05)])
    expect(Object.values(b).reduce((a, c) => a + c, 0)).toBe(0)
  })
  it('ignores empty or non-positive expenses', () => {
    expect(balances(ppl, [ex('Ana', -5), ex('Ana', 10, [])])).toEqual({ Ana: 0, Ben: 0, Cris: 0 })
  })
})
describe('settle', () => {
  it('turns balances into transfers that clear everything', () => {
    const t = settle(balances(ppl, [ex('Ana', 30), ex('Ben', 12)]))
    const net: Record<string, number> = { Ana: 0, Ben: 0, Cris: 0 }
    t.forEach((x) => { net[x.from] -= x.amount; net[x.to] += x.amount })
    const b = balances(ppl, [ex('Ana', 30), ex('Ben', 12)])
    for (const k of ppl) expect(Math.round(net[k] * 100)).toBe(b[k])
  })
  it('returns nothing when all is even', () => { expect(settle({ Ana: 0, Ben: 0 })).toEqual([]) })
})
