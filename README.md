# SeamlessPay Web SDK Examples

Basic examples of using the SeamlessPay Web SDK to perform tokenization.

## Getting Started

### 1. Configure the client

#### Hosted fields

Update the SeamlessPay client config in `index.js` with the appropriate `environment` and `authorization` values for your testing purposes.

#### Digital wallets

- Copy `dw-config.toml.example` to `dw-config.toml`
- Fill `secret_key` value
- Fill `environment` value

### 2. Configure the target SDK

Update script sources in `index.html` to use the correct URL for the desired SDK version. The default is `https://web-sdk.seamlesspay.com/latest`.

_NOTE: Digital Wallets SDK is not intended for modification for now. If you feel adventurous, look for html template in `src/main.rs`_

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
- Copy `examples/digital-wallets/dw/dw-config.toml.example` to `examples/digital-wallets/dw/dw-config.toml` and edit as needed

##### Spinning things up

```sh
docker compose up --watch
```

The examples are then available both locally and via tunnel's external hostname.

##### Modifying templates and configuration

With compose watch on, modifications to configuration file and templates will get syncronised with the container, restarting the app to pick up the changes.
