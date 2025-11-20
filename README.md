README — EventSpace

En Airbnb-liknande webbapplikation för att hitta, lägga upp och boka venues för evenemang.
Projektet består av en Express + Prisma + PostgreSQL backend och en React + Vite frontend.

Om projektet

EventSpace är en fullstack-applikation där användare kan lista sina egna venues, samt boka andras venues per timme, ungefär som Airbnb fast för eventlokaler.
Appen har bilduppladdning via Cloudinary, autentisering med JWT, samt en responsiv React-frontend.

Huvudfunktioner - 
Lägg upp egna venues (titel, beskrivning, pris, max capacity, bild)

Sök och filtrera venues (pris, plats m.m.)

Boka venues per timme

Registrering & inloggning med JWT

Cloudinary-uppladdning för bilder

Översikt av sina egna upplagda venues och bokningar


Teknikstack
Backend

Node.js + Express

PostgreSQL

Prisma ORM

Cloudinary (bildhosting)

JWT (autentisering)

Körs på: http://localhost:5050



Installation & körning
1. Klona projektet
Frontend:
git clone https://github.com/andreacalzone/event-spaces-frontend.git

Backend:
git clone https://github.com/andreacalzone/event-spaces-backend.git

Kör Prisma migrations
npx prisma migrate dev

Starta backend
npm run dev

Backend körs sedan på: http://localhost:5050

Starta frontend
npm run dev

Frontend körs på den port som Vite väljer (oftast 5173).





