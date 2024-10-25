import React, { useState } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';

function Cart({ cart, setCart, bikes, setBikes, updateStock }) {
  const [showMessage, setShowMessage] = useState(false); // Hanterar visning av meddelande efter köp
  const navigate = useNavigate();

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0); // Räknar ut totalpriset för varukorgen

  // Hantera tömning av varukorgen och återställ lager
  const handleClearCart = () => {
    cart.forEach(item => {
      updateStock(item.id, item.quantity, () => {
        setBikes(prevBikes =>
          prevBikes.map(b => (b.id === item.id ? { ...b, stock: b.stock + item.quantity } : b))
        );
      });
    });
    setCart([]); // Töm varukorgen
    navigate('/'); // Navigera till startsidan
  };

  // Hantera betalning av varukorgen
  const handleCheckoutLocal = () => {
    setShowMessage(true); // Visa meddelande om att köpet är klart
    setTimeout(() => {
      setShowMessage(false);
      setCart([]); // Töm varukorgen utan att återställa lagret
    }, 1000);
  };

  // Hantera borttagning av en vara från varukorgen
  const removeItem = (bike) => {
    const updatedCart = cart
      .map(item => (item.id === bike.id ? { ...item, quantity: item.quantity - 1 } : item))
      .filter(item => item.quantity > 0); // Ta bort varan om kvantiteten är noll

    // Uppdatera lagret i backend
    updateStock(bike.id, 1, () => {
      setCart(updatedCart); // Uppdatera varukorgen
      setBikes(prevBikes =>
        prevBikes.map(b => (b.id === bike.id ? { ...b, stock: b.stock + 1 } : b)) // Återställ lagret för borttagna varor
      );
    });
  };

  return (
    <div className="cart">
      <h2>Din Varukorg</h2>
      {showMessage && <p className="checkout-message">Tack för ditt köp!</p>}

      {cart.length === 0 && !showMessage ? (
        <p>Din varukorg är tom.</p>
      ) : (
        <div>
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>Pris: €{item.price}</p>
                <p>Kvantitet: {item.quantity}</p>
              </div>
              <div className="cart-actions">
                <button onClick={() => removeItem(item)} className="remove-button">Ta bort produkt</button>
              </div>
            </div>
          ))}
          <h3 className="cart-total">Totalt Pris: €{totalPrice}</h3>
          <button onClick={handleClearCart} className="cart-button clear-cart-button">Töm Varukorg</button>
          <button onClick={handleCheckoutLocal} className="cart-button checkout-button">Betala</button>
        </div>
      )}
    </div>
  );
}

export default Cart;
