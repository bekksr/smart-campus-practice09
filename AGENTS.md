# AGENTS.md

## Project Purpose
Smart Campus Room Availability Checker is a React and TypeScript application that checks whether a campus room is available for a requested time interval. It uses fictional sample data and does not save bookings.

## Project Structure
- `src/App.tsx` — main application component and UI state.
- `src/components/` — reusable UI components.
- `src/data/rooms.ts` — room and booking interfaces and sample data.
- `src/lib/availability.ts` — pure booking availability rules.
- `src/lib/time.ts` — time conversion and formatting utilities.
- `src/lib/` — pure application logic and its tests.

## Commands
- `npm test` — run Vitest tests.
- `npm run build` — build the application.
- `npm run typecheck` — check TypeScript types.
- `npm run lint` — run ESLint.
- `npm run dev` — start the development server.

## Functional Constraints
Preserve all acceptance criteria:

- AC1: Reject invalid intervals, including start time greater than or equal to end time, and requests starting at or before the current time.
- AC2: Reject booking durations longer than 120 minutes.
- AC3: Reject bookings for blocked rooms.
- AC4: Reject overlapping bookings but allow intervals that touch at endpoints.
- AC5: Never mutate the original room or booking fixture data.
- AC6: Keep clear availability feedback on desktop and mobile.

## Refactoring Rules
- Keep booking availability rules in `src/lib/availability.ts`.
- Keep business logic separate from React UI components.
- Prefer small, focused changes.
- Do not introduce Strategy or Adapter patterns without a real requirement.
- Keep room and booking data structures unchanged.
- Do not add a database, authentication, or booking persistence.
- Avoid unnecessary dependencies and unrelated UI changes.

## Testing Rules
- Add regression tests for changed behavior.
- Verify room filtering and chronological sorting if booking selectors are changed.
- Verify that fixture data remains unchanged.
- Run tests, build, typecheck, and lint when possible.
- Do not claim a test passed unless it was actually executed.

## Boundaries
- Do not change existing acceptance criteria.
- Do not remove existing tests.
- Do not replace the existing UI unnecessarily.
- Do not invent test results or screenshots.
- Inspect existing code before making changes.
