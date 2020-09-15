const stripeConnection = (state = {}, action) => {
    switch (action.type) {
      case 'STRIPE_ACTION':
        return {
          ...state,
          stripeConnection: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default stripeConnection;