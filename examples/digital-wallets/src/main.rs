use indoc::indoc;
use std::{error::Error, fmt};
use rocket::response::content;
use rocket::http::Status;
use rocket_dyn_templates::{Template, context};

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;

#[derive(Debug, Deserialize, Serialize)]
struct Config {
    sdk_version: String,
    secret_key: String,
    environment: String,
    #[serde(default = "empty_string")]
    api_url: String,
    #[serde(default = "empty_string")]
    tokenizer_url: String,
    environments: HashMap<String, Environment>,
}

#[derive(Debug, Deserialize, Serialize)]
struct Environment {
    api_url: String,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct AccessTokenResponse {
    access_token: String,
}

fn empty_string() -> String {
    "".to_string()
}

#[macro_use]
extern crate rocket;

#[derive(Debug)]
struct ConfigFetchError {
    wrapped: String,
}

impl Error for ConfigFetchError {}

impl fmt::Display for ConfigFetchError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "failed to load config file: {}", self.wrapped)
    }
}

// This is entirely suboptimal, but sufficient for an example app
fn get_config() -> Result<Config, ConfigFetchError> {
    let filename = "dw-config.toml";
    let contents = match fs::read_to_string(filename) {
        Ok(c) => c,
        Err(err) => {
            eprintln!("Could not read file `{}`: {}", filename, err);
            return Err(ConfigFetchError{ wrapped: format!("{err}") })
        }
    };
    let config: Config = match toml::from_str(&contents) {
        Ok(d) => d,
        Err(err) => {
            eprintln!("Unable to load data from `{}`: {}", filename, err);
            return Err(ConfigFetchError{ wrapped: format!("{err}") })
        }
    };

    Ok(config)
}

#[get("/")]
fn index() -> Result<content::RawHtml<String>, Status> {
    let config: Config = match get_config() {
        Ok(d) => d,
        Err(err) => {
            eprintln!("Unable to load config: {}", err);
            return Err(Status::InternalServerError)
        }
    };

    let formatted = format!(
        r#"
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="style.css">
</head>

<body>
<h1 id="header">Web SDK Example (Digital Wallets)</h1>

<form action="/" id="my-sample-form" method="post">
    <label for="amount">Amount</label>
    <input id="amount" type="text">

    <div id="payment-button-container"></div>
</form>

<label for="output" id="output-label">OUTPUT:</label>
<pre id="output"></pre>

<script src="https://web-sdk.seamlesspay.com/{}/js/client.min.js"></script>
<script src="https://web-sdk.seamlesspay.com/{}/js/digital-wallets.min.js"></script>
<script src="index.js"></script>
</body>

</html>"#, config.sdk_version, config.sdk_version
    );

    Ok(rocket::response::content::RawHtml(formatted))
}

#[get("/style.css")]
fn stylecss() -> content::RawCss<&'static str> {
    rocket::response::content::RawCss(indoc! {r#"
        body {
          background-color: #FFFFFF;
          color: #333333;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        #output-label {
          margin: 60px 0 0 0;
          padding: 0;
          font-weight: bold;
          font-size: 10pt;
        }

        #output {
          margin: 0;
          padding: 10px;
          background-color: #000000;
          color: #FFFFFF;
          font-family: monospace;
        }

        #output em {
          color: #ff4848;
          font-style: normal;
        }

        label {
          display: block;
          margin: 10px 0 5px 0;
        }

        input {
          margin: 20px 0 20px 0;
          padding: 10px 20px;
          border: none;
          background-color: #006633;
          color: #FFFFFF;
          cursor: pointer;
        }
    "#})
}

#[get("/index.js")]
fn indexjs() -> Result<Template, Status> {
    let config: Config = match get_config() {
        Ok(d) => d,
        Err(err) => {
            eprintln!("Unable to load config: {}", err);
            return Err(Status::InternalServerError)
        }
    };

    let api_url = if config.environment.is_empty() {
        &config.api_url
    } else {
        match config.environments.get(&config.environment) {
            Some(env) => &env.api_url,
            None => ""
        }
    };
    let access_tokens_url = &format!("{}/access-tokens", api_url);

    let maybe_body = ureq::post(access_tokens_url)
        .set("Authorization", &format!("Bearer {}", config.secret_key))
        .send_json(ureq::json!({
            "type": "one_time_password",
            "scope": "init_sdk",
        }));
    let body = match maybe_body {
        Ok(res) => match res.into_json::<AccessTokenResponse>(){
            Ok(atres) => atres,
            Err(err) => {
                eprintln!("Could not fetch access token from `{}`: {}", access_tokens_url, err);
                return Err(Status::InternalServerError)
            }
        },
        Err(err) => {
            eprintln!("Could not fetch access token from `{}`: {}", access_tokens_url, err);
            return Err(Status::InternalServerError)
        }
    };

    let ctx = context! {
        use_urls: config.environment.is_empty(),
        access_token: body.access_token,
        environment: config.environment,
        main_api: config.api_url,
        tokenizer_api: config.tokenizer_url
    };

    Ok(Template::render("index", &ctx))
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .configure(
            rocket::Config::figment()
                .merge(("port", 9797))
                .merge(("address", "0.0.0.0"))
        )
        .mount("/", routes![index, stylecss, indexjs])
        .attach(Template::fairing())
}
