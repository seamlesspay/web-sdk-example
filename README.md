# SeamlessPay Web SDK Examples

Basic examples of using the SeamlessPay Web SDK to perform tokenization.

## Getting Started

### 1. Configure the client

Update the SeamlessPay client config in respective examples' `index.js` with the appropriate `environment` and `authorization` values for your testing purposes.

### 2. Configure the target SDK

Update script sources in `index.html` to use the correct URL for the desired SDK version. The default is `https://web-sdk.seamlesspay.com/latest`.

### 3. Spin up docker compose

#### Local use (no digital wallets)

```sh
docker compose up web-sdk-examples
```

The examples are then available at [localhost](http://localhost) or [127.0.0.1](http://127.0.0.1/).

The local port is configurable via `LOCAL_PORT` environment variable. E.g. to expose server on [localhost:8080](http://localhost:8080):

```sh
LOCAL_PORT=8080 docker compose up web-sdk-examples
```

#### Cloudflare tunnel use (digital wallets)

##### Cloudflare tunnel requirements

Set tunnel `Service` fields to:

- Type: HTTP
- URL: web-sdk-examples

##### Local configuration

- Export or explicitly provide cloudflare tunnel access token in `TUNNEL_TOKEN` environment variable
- Export or explicitly provide tunnel's public hostname in `PUBLIC_HOST` environment variable

##### Spinning things up

```sh
docker compose up web-sdk-examples
```

The examples are then available both locally and via tunnel's external hostname.
