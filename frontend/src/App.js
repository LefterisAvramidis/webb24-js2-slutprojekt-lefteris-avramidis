import React, { useEffect, useState } from 'react';
import './App.css';
import Cart from './Cart';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function App() {
  const [bikes, setBikes] = useState([]); // Sparar information om cyklarna
  const [cart, setCart] = useState([]); // Sparar varukorgen
  const [errorMessage, setErrorMessage] = useState(''); // Felmeddelanden visas här
  const [sortOption, setSortOption] = useState(''); // Sorteringsalternativ för cyklar

  // Hämtar cyklarna från servern när komponenten laddas in
  useEffect(() => {
    fetch('/api/products')
      .then(response => response.json())
      .then(data => setBikes(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Hanterar felmeddelanden och visar dem under en viss tid
  const triggerErrorMessage = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 2000); // Tar bort meddelandet efter 2 sekunder
  };

  // Funktion för att uppdatera lagret av en produkt
  const updateStock = (id, quantity, successCallback) => {
    fetch('/api/update-stock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, quantity }),
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to update stock');
        return response.json();
      })
      .then(data => {
        if (data.success) {
          successCallback(); // Kör en funktion när uppdateringen lyckas
        } else {
          triggerErrorMessage(data.message);
        }
      })
      .catch(error => console.error('Error updating stock:', error));
  };

  // Hanterar logiken när användaren köper en cykel
  const handlePurchase = (bike) => {
    if (bike.stock <= 0) {
      triggerErrorMessage('Slut i lager, välj en annan produkt');
      return;
    }

    // Uppdatera lagret i backend
    updateStock(bike.id, -1, () => {
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === bike.id);
        return existingItem
          ? prevCart.map(item => item.id === bike.id ? { ...item, quantity: item.quantity + 1 } : item)
          : [...prevCart, { ...bike, quantity: 1 }];
      });
      setBikes(prevBikes =>
        prevBikes.map(b => (b.id === bike.id ? { ...b, stock: b.stock - 1 } : b))
      );
    });
  };

  // Hanterar sortering av cyklar
  const handleSortChange = (option) => {
    setSortOption(option);
    const sortedBikes = [...bikes].sort((a, b) => (option === 'price' ? a.price - b.price : a.stock - b.stock));
    setBikes(sortedBikes);
  };

  // Hanterar refresh-knappen för att återställa lager och webbsida
  const handleRefresh = () => {
    fetch('/api/products')
      .then(response => response.json())
      .then(data => {
        setBikes(data); // Återställ cyklar till originalvärdena från products.js
        setCart([]);    // Töm varukorgen
        setSortOption(''); // Återställ sorteringsalternativ
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Motor"Bikes"</h1>
          <nav>
            <ul>
              <li><Link to="/">Hem</Link></li>
              <li><Link to="/cart">Varukorg ({cart.reduce((total, item) => total + item.quantity, 0)})</Link></li>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <section className="hero">
                    <h2>HITTA DIN INRE SPORTSMAN</h2>
                  </section>
                  <section className="bike-list">
                    <h2>Nyheter</h2>
                    <div className="sort-options">
                      <label htmlFor="sort">Sortera efter: </label>
                      <select id="sort" value={sortOption} onChange={(e) => handleSortChange(e.target.value)}>
                        <option value="price">Pris</option>
                        <option value="stock">Lagerstatus</option>
                      </select>
                    </div>
                    <div className="bike-grid">
                      {bikes.map(bike => (
                        <div key={bike.id} className="bike-card">
                          <img src={bike.image} alt={bike.name} />
                          <h3>{bike.name}</h3>
                          <p>Pris: €{bike.price}</p>
                          <p>Lager: {bike.stock}</p>
                          <button onClick={() => handlePurchase(bike)}>Köp</button>
                        </div>
                      ))}
                    </div>
                  </section>
                  {errorMessage && <div className="error-message">{errorMessage}</div>}
                </>
              }
            />
            <Route
              path="/cart"
              element={<Cart cart={cart} setCart={setCart} bikes={bikes} setBikes={setBikes} updateStock={updateStock} />}
            />
          </Routes>
        </main>
        <footer>
          <p>&copy; 2024 Motor"bikes". Alla rättigheter förbehållna.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
