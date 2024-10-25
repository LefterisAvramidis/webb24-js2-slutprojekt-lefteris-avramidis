------------------------------------------------------------------------------------------------------------------------
Förkrav

- Node.js 
- npm (Node Package Manager)
------------------------------------------------------------------------------------------------------------------------
Installations- och Startinstruktioner

STEG 1
Installera alla projektets dependencies i root mappen:
-npm install

STEG 2
Installera dependencies för backend:
-cd backend
-npm install

STEG 3 
Installera dependencies för frontend:
-cd ../frontend                        OBS! ../ Är utifrån att du fortfarande är i backend mappen :) 
-npm install

STEG 4
Återgå till rotmappen:
-npm start

EXTRA: 
Jag har kopplat Backend och Frontend så att du endast behöver skriva in "npm start" 
för att starta backend samt frontend tillsammans och slippa navigerings processen. 

Backend-servern körs med Express på http://localhost:5000.
Frontend React-applikationen körs på en annan port http://localhost:3000.
------------------------------------------------------------------------------------------------------------------------