import { useContext } from "react";
import Modal from "./UI/Modal";
import CartContext from "../store/CartContext";
import UserProgressContext from "../store/UserProgressContext";
import { currencyFormatter, totalAmount } from "../util/formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";
import useHttp from "../hooks/useHttp";
import Error from "./Error";


const requestConfig = {
 method: 'POST', 
 headers: {
  'Content-Type': 'application/json'
 },
}

export default function Checkout() {

  const cartCtx = useContext(CartContext)
  const userProgressCtx = useContext(UserProgressContext)

  const {data, isLoading: isSending, error, sendRequest, clearData} = useHttp(
    'http://localhost:3000/orders', 
    requestConfig
  );
  
  const cartTotal = totalAmount(cartCtx.items)

  function handleClose() {
    userProgressCtx.hideCheckout()
  }

  function finish() {
    userProgressCtx.hideCheckout()
    cartCtx.clearCart()
    clearData()
  }

  function handleSubmit(event) {
    event.preventDefault()

    const fd = new FormData(event.target)
    const customerData = Object.fromEntries(fd.entries()); // { email : test@test.com}

    sendRequest(JSON.stringify({
      order: {
        items: cartCtx.items,
        customer: customerData
      }
    }))
  } 

  let actions = (
    <>
      <Button type="button" textOnly onClick={handleClose}>Close</Button>
      <Button>Submit the Order</Button>
    </>
  )

  if(isSending) {
    actions = <span>Sending data...</span>
  }

  if(data && !error) {
    return <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
      <h2>Success</h2>
      <p>Your order was submitted successfully!</p>
      <p className="modal-actions">
        <Button onClick={finish}>Okay</Button>
      </p>
    </Modal>
  }

  return <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
    <form onSubmit={handleSubmit}>
      <h2>Checkout</h2>
      <p>Total amount: {currencyFormatter.format(cartTotal)} </p>

      <Input label="Full Name" type="text" id="name" />
      <Input label="E-mail Address" type="email" id="email" />
      <Input label="Street" type="text" id="street" />
      <div className="control-row">
        <Input label="Postal Code" type="text" id="postal-code" />
        <Input label="City" type="text" id="city" />
      </div>
      {error && <Error title="Error to submit order" message={error} />}
      <p className="modal-actions">{actions}</p>
    </form>
  </Modal>
}