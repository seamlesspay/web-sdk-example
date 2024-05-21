const DEBUG = true
const debug = (...output) => DEBUG && console.log('[DEBUG]', ...output)

const displayOutput = (...output) => document.querySelector('#output').innerHTML += `${output.join(' ')}</br>`
const displayError = (error) => displayOutput(`<em>${error.code}: ${error.message}</em>`)

seamlesspay.client.create({
  environment: 'sandbox',
  authorization: 'pk_FFFFFFFFFFFFFFFFFFFFFFFFFF'
},
(error, client) => {
  if (error) {
    debug('[client.create]', error)
    displayError(error)
    return
  }
  debug('client:', client)
  displayOutput(`Client initialized.`)

  seamlesspay.hostedFields.create({
    paymentType: 'credit_card',
    client: client,
    styles: {
      input: {
        'font-size': '16pt'
      },
      '.valid': {
        color: 'green'
      },
      '.invalid': {
        color: 'blue'
      },
      '.potentiallyValid': {
        color: 'orange'
      },
    },
    fields: {
      accountNumber: { selector: '#account-number' },
      cvv: {selector: '#cvv' },
      expDate: { selector: '#exp-date' },
    },
    submitButton: { selector: '#submit-button' }
  }, (error, hostedFields) => {
    if (error) {
      debug('[hostedFields.create]', error)
      displayError(error)
      return
    }
    debug('hostedFields:', hostedFields)
    displayOutput(`Hosted Fields initialized.`)

    const paymentData = {
      billingAddress: {
        line1: '400 Madison Ave',
        line2: '10th Fl',
        city: 'New York',
        country: 'USA',
        state: 'NY'
      },
      name: 'Michael Smith'
    };

    hostedFields.addSubmitHandler(submitHandler, paymentData);
  })
})

function submitHandler(error, payload) {
  if (error) {
    debug('[tokenize]', error)
    displayError(error)
    return
  }
  debug('tokenize response payload:', payload)
  displayOutput('Token:', payload.token)
}
