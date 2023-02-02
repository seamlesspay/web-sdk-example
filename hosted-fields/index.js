const DEBUG = true
const debug = (...output) => DEBUG && console.log('[DEBUG]', ...output)

const displayOutput = (...output) => document.querySelector('#output').innerHTML += `${output.join(' ')}</br>`
const displayError = (error) => displayOutput(`<em>${error.code}: ${error.message}</em>`)

const tokenizeButton = document.getElementById('tokenize-button');

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
    },
    fields: {
      accountNumber: { selector: '#account-number' },
      cvv: {selector: '#cvv' },
      expDate: { selector: '#exp-date' },
    },
  }, (error, hostedFields) => {
    if (error) {
      debug('[hostedFields.create]', error)
      displayError(error)
      return
    }
    debug('hostedFields:', hostedFields)
    displayOutput(`Hosted Fields initialized.`)

    tokenizeButton.addEventListener('click', submitHandler.bind(null, hostedFields))
    tokenizeButton.removeAttribute('disabled')
  })
})

function submitHandler(hostedFields, event) {
  displayOutput('Sending tokenize request...')
  event.preventDefault()
  hostedFields.tokenize((error, payload) => {
    if (error) {
      debug('[tokenize]', error)
      displayError(error)
      return
    }
    debug('tokenize response payload:', payload)
    displayOutput('Token:', payload.token)
  })
}
