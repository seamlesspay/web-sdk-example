# SeamlessPay Web SDK Examples

Basic examples of using the SeamlessPay Web SDK to perform tokenization.

## Getting Started

#### Configure the client

Update the SeamlessPay client config in `index.js` with the appropriate `environment` and `authorization` values for your testing purposes.

#### Configure the target SDK

Update script sources in `index.html` to use the correct URL for the desired SDK version. The default is `https://web-sdk.seamlesspay.com/latest`.

#### Local testing

1. Install serve: `npm install -g serve`
2. Launch an HTTP server for the example app, e.g. to serve the `hosted-fields` example on port 3000, do `serve hosted-fields -p 3000`
3. Open a browser and navigate to http://localhost:3000
