import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PaymentComponent.css';

const stripePromise = loadStripe('pk_test_51PhoK1Rq3EYac15Ijmed0HyypIEStQUQSwK63YYkpQOxQhpdvdDaQyL7S9QWX6ZY8cxrAqkVAf3feN5cE3SU36kV00P6pOexMH');

const CheckoutForm = ({ amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!stripe || !elements) {
      return;
    }
  
    try {
      const { data } = await axios.post('http://localhost:5000/create-payment-intent', {
        amount,
        email,
      });
  
      const clientSecret = data.clientSecret;
  
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name,
          },
        },
      });
  
      if (result.error) {
        setError(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          setSuccess(true);
          alert('Thank you for purchasing');
  
          // Send invoice
          await axios.post('http://localhost:5000/send-invoice', {
            email,
            name,
            amount,
          });
  
          // Update user's premium status
          console.log(`Updating premium status for email: ${email} with amount: ${amount}`);
          await axios.post('http://localhost:5000/update-premium', {
            email,
            amount,
          }).then(response => {
            console.log('Premium status update response:', response.data);
          }).catch(error => {
            console.error('Error updating premium status:', error);
          });
  
          navigate('/feed');
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };
  


  const cardElementOptions = {
    style: {
      base: {
        color: 'white',
        backgroundColor: 'rgb(50, 50, 50)',
        fontSize: '16px',
        '::placeholder': {
          color: 'rgba(255, 255, 255, 0.7)',
        },
      },
      invalid: {
        color: 'red',
      },
    },
  };

  return (
    <div className="payment-container">
      <h2>Payment Information</h2>
      <p>Total Amount: ₹{(amount / 100).toFixed(2)}</p> {/* Display selected amount */}
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label htmlFor="name">Cardholder Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john.doe@example.com"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="card">Card Details</label>
          <CardElement options={cardElementOptions} />
        </div>
        <button type="submit" disabled={!stripe}>
          Pay
        </button>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">Payment Successful!</div>}
      </form>
    </div>
  );
};

const PaymentComponent = ({ amount }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} />
    </Elements>
  );
};

export default PaymentComponent;
