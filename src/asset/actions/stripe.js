const stripeConnection = (data) => ({
    type: 'STRIPE_ACTION',
    payload: data,
  });
  
  
  export default {
    stripeConnection,
  };