async function initPaymentRquest() {
    const details = {
      total: {
        label: "Total",
        amount: {
          currency: "USD",
          value: "0.00",
        },
      },
    };
  
    const supportsApplePay = new PaymentRequest(
      [{ supportedMethods: "https://apple.com/apple-pay" }],
      details
    ).canMakePayment();
  
    // Supports Apple Pay?
    if (await supportsApplePay) {
      // show Apple Pay logo, for instance
      console.log("supports apple pay");
    }
  
    // Otherwise... let's see if we can use basic card
    const supportsBasicCard = await new PaymentRequest(
      [{ supportedMethods: "basic-card" }],
      details
    ).canMakePayment();
  
    if (supportsBasicCard) {
      console.log("supports basics card");
    }
  
    // Otherwise, make payments using HTML form element
  }