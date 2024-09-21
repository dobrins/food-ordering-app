export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

export function totalAmount(arr) {
 return arr.reduce((totalPrice, item) => {
    return totalPrice + item.quantity * item.price
  }, 0)
}