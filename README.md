# Smart Campus Room Availability Checker

## 1. Project Overview

Smart Campus Room Availability Checker is a client-side web application developed as part of Software Engineering Assignment #04.

The application allows users to browse a fictional campus room catalog, filter rooms by capacity and equipment, and check room availability for a selected time interval.

The project extends the original single-room prototype into a multi-room application while preserving the existing availability validation rules.

## 2. Features

- Display a catalog of four fictional campus rooms.
- Filter rooms by minimum capacity.
- Filter rooms by required equipment.
- Require rooms to contain all selected equipment items.
- Exclude blocked rooms from available room selection.
- Display an empty state when no rooms match the selected filters.
- Display bookings associated with the selected room.
- Check availability for a selected time interval.
- Display clear availability results.
- Responsive user interface.

## 3. Technology Stack

| Technology | Purpose |
|---|---|
| React 18 | User interface |
| TypeScript | Type-safe application development |
| Vite | Development server and build tool |
| Tailwind CSS | Interface styling |
| Vitest | Automated testing |
| ESLint | Code quality checks |
| Lucide React | Interface icons |

## 4. Project Structure

```text
src/
├── components/
│   ├── ResultBanner.tsx
│   ├── RoomCard.tsx
│   └── ScheduleList.tsx
├── data/
│   └── rooms.ts
├── lib/
│   ├── availability.ts
│   ├── availability.test.ts
│   ├── availability.bug-reproduction.test.ts
│   ├── bookingSelectors.ts
│   ├── bookingSelectors.test.ts
│   ├── roomFilters.ts
│   ├── roomFilters.test.ts
│   └── time.ts
├── App.tsx
├── index.css
└── main.tsx
