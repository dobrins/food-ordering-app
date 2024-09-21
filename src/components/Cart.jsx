import { useContext } from 'react'
import { currencyFormatter, totalAmount } from "../util/formatting.js";
import Modal from "./UI/Modal.jsx";
import Button from "./UI/Button.jsx";
import CartContext from "../store/CartContext.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";
import CartItem from './CartItem.jsx';

export default function Cart() {

  const cartCtx = useContext(CartContext)
  const userProgressCtx = useContext(UserProgressContext)
  const cartTotal = totalAmount(cartCtx.items)

  function handleCloseCart() {
    userProgressCtx.hideCart()
  }

  function handleGoToCheckout() {
    userProgressCtx.showCheckout()
  }

  const isCart = () => userProgressCtx.progress === 'cart'

  return (
    <Modal 
      className="cart" 
      open={isCart()} 
      onClose={isCart() ? handleCloseCart : null}
    >
      <h2>Your Cart</h2>
      <ul>
        {cartCtx.items.map(item => (
          <CartItem 
            key={item.id} 
            name={item.name} 
            quantity={item.quantity} 
            price={item.price} 
            onIncrease={() => cartCtx.addItem(item)}
            onDecrease={() => cartCtx.removeItem(item.id)}
          />
        ))}
      </ul>
      
      <p className="cart-total">{currencyFormatter.format(cartTotal)}</p>
      <p className="modal-actions">
        <Button textOnly onClick={handleCloseCart}>Close</Button>
        {cartCtx.items.length > 0 && <Button onClick={handleGoToCheckout}>Go to Checkout</Button>}
      </p>
    </Modal>
  )
}