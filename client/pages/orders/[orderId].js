import { useState, useEffect } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import useRequest from '../../hooks/use-request'
import Router from 'next/router'

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0)
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date()
      setTimeLeft(Math.round(msLeft / 1000))
    }

    findTimeLeft()
    const timerId = setInterval(findTimeLeft, 1000)

    return () => clearInterval(timerId)
  }, [])

  if (timeLeft <= 0) {
    return <div>Order has expired.</div>
  }

  return (
    <div>
      <p>
        <b>Time left to pay: {timeLeft}</b> seconds
      </p>
      {errors}
      <StripeCheckout
        token={(token) => doRequest({ token: token.id })}
        stripeKey="pk_test_51LZ3DSJyhrJKMp6HwHhqmDnT2VXTmxJhO5elwV9YhMLVmcnYLt2VhirkNNlv0NquAXCVKhJUgyxfB4gq5YpOAwXO00MuvlPRG0"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
    </div>
  )
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query
  const { data } = await client.get(`/api/orders/${orderId}`)

  return { order: data }
}

export default OrderShow
