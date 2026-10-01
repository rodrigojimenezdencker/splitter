# Trip splitter (prototype)

A small expense splitter for group trips: add who paid and who shares each expense, and it shows the fewest-ish transfers needed to settle up.

## How this was built (honest version)

This is an AI-assisted prototype. I built it with Claude Code from a short written brief, in a couple of hours, to test how far an agent gets on a small, well-defined problem. I steered the scope, and the generated code was reviewed and run by me.

What the AI wrote well: the settle-up logic, the unit tests, the basic form and layout.
What I had to check or correct: rounding (money is handled in cents, leftover cents are assigned deterministically), input validation, and the greedy settle-up, which is simple but not always minimal.

## Status and limits

- No backend, no accounts; state lives in memory and resets on reload.
- Fixed list of three people, EUR only.
- Greedy settle-up: correct (everyone ends at zero) but not guaranteed to use the fewest possible transfers.
- Not tested with screen readers; basic labels and keyboard use only.

## Run it

    npm install
    npm run dev
    npx vitest run
