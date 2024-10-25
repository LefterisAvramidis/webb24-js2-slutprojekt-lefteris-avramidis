const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

let bikes = require('./products'); // Importerar produktinformationen

app.use(express.static(path.join(__dirname, '../../frontend/docs/build'))); // Statiska filer
app.use(bodyParser.json()); // Hanterar inkommande JSON-förfrågningar

// Endpoint för att hämta alla produkter
app.get('/api/products', (req, res) => {
  res.json(bikes); // Returnerar den aktuella listan av cyklar med uppdaterat lager
});

// Endpoint för att uppdatera lagret
app.post('/api/update-stock', (req, res) => {
  const { id, quantity } = req.body; // Hämtar id och kvantitet från förfrågan

  // Hitta cykeln genom ID och uppdatera lagret
  const bike = bikes.find(b => b.id === id);
  if (bike) {
    if (quantity < 0 && bike.stock + quantity < 0) {
      // Inte tillräckligt med lager för att ta bort
      res.status(400).json({ success: false, message: 'Otillräckligt lager' });
    } else {
      // Uppdatera lagret
      bike.stock += quantity;
      res.json({ success: true, message: 'Lagret uppdaterat', bike });
    }
  } else {
    res.status(404).json({ success: false, message: 'Cykel ej funnen' });
  }
});

// Hanterar alla andra förfrågningar för client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/docs/build/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server kör på port ${PORT}`); // Startar servern på angiven port
});
