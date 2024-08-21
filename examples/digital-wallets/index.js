const DEBUG = true;
const debug = (...output) => DEBUG && console.log('[DEBUG]', ...output);

const displayOutput = (...output) => (document.querySelector('#output').innerHTML += `${output.join(' ')}</br>`);
const displayError = (error) => displayOutput(`<em>${error.code}: ${error.message}</em>`);

seamlesspay.client.create(
  {
    environment: 'sandbox',
    authorization: 'pk_FFFFFFFFFFFFFFFFFFFFFFFFFF',
  },
  (error, client) => {
    if (error) {
      debug('[client.create]', error);
      displayError(error);
      return;
    }
    debug('client:', client);
    displayOutput(`Client initialized.`);

    seamlesspay.digitalWallets.create(
      {
        client: client,
        supportedWalletTypes: ['apple_pay'],
        paymentData: {
          totalAmount: 10500, // in currency subunits
        },
        paymentButtonContainer: { selector: '#payment-button-container' },
      },
      digitalWalletsDidCreate
    );
  }
);

function digitalWalletsDidCreate(error, digitalWalletsInstance) {
  if (error) {
    // Handle error in Digital Wallets creation
    debug('[digitalWallets.create]', error);
    displayError(error);
    return;
  }

  debug('digitalWallets:', digitalWalletsInstance);
  displayOutput(`Digital Wallets initialized.`);

  // Register the payment response handler function. This function will be triggered when the payment response is received.
  digitalWalletsInstance.addPaymentResponseHandler(paymentResponseHandler);
}

function paymentResponseHandler(error, paymentResponse) {
  if (error) {
    // Handle error if the payment request failed.
    debug('[paymentResponse]', error);
    displayError(error);
    return;
  }

  debug('paymentResponse:', paymentResponse);
  displayOutput('Payment Response:', paymentResponse);
}
