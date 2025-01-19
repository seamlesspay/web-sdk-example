use rocket::http::Status;
use rocket_dyn_templates::{context, Template};
use std::{error::Error, fmt};

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;

#[derive(Debug, Deserialize, Serialize)]
struct Config {
    sdk_version: String,
    #[serde(default = "default_sdk_host")]
    sdk_host: String,
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

fn default_sdk_host() -> String {
    "https://web-sdk.seamlesspay.com".to_string()
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
            return Err(ConfigFetchError {
                wrapped: format!("{err}"),
            });
        }
    };
    let config: Config = match toml::from_str(&contents) {
        Ok(d) => d,
        Err(err) => {
            eprintln!("Unable to load data from `{}`: {}", filename, err);
            return Err(ConfigFetchError {
                wrapped: format!("{err}"),
            });
        }
    };

    Ok(config)
}

#[get("/")]
fn index() -> Result<Template, Status> {
    let config: Config = match get_config() {
        Ok(d) => d,
        Err(err) => {
            eprintln!("Unable to load config: {}", err);
            return Err(Status::InternalServerError);
        }
    };

    Ok(Template::render("index", context! {
        sdk_host: config.sdk_host,
        sdk_version: config.sdk_version,
    }))
}

#[get("/style.css")]
fn stylecss() -> Result<Template, Status> {
    let ctx = context! {};
    Ok(Template::render("css/style", &ctx))
}

#[get("/app.js")]
fn appjs() -> Result<Template, Status> {
    let config: Config = match get_config() {
        Ok(d) => d,
        Err(err) => {
            eprintln!("Unable to load config: {}", err);
            return Err(Status::InternalServerError);
        }
    };

    let api_url = if config.environment.is_empty() {
        &config.api_url
    } else {
        match config.environments.get(&config.environment) {
            Some(env) => &env.api_url,
            None => "",
        }
    };
    let access_tokens_url = &format!("{}/access-tokens", api_url);

    let maybe_body = ureq::post(access_tokens_url)
        .set("Authorization", &format!("Bearer {}", config.secret_key))
        .send_json(ureq::json!({
            "type": "limited_scope",
            "scope": "web-sdk",
        }));
    let body = match maybe_body {
        Ok(res) => match res.into_json::<AccessTokenResponse>() {
            Ok(atres) => atres,
            Err(err) => {
                eprintln!(
                    "Could not fetch access token from `{}`: {}",
                    access_tokens_url, err
                );
                return Err(Status::InternalServerError);
            }
        },
        Err(err) => {
            eprintln!(
                "Could not fetch access token from `{}`: {}",
                access_tokens_url, err
            );
            return Err(Status::InternalServerError);
        }
    };

    let ctx = context! {
        use_urls: config.environment.is_empty(),
        access_token: body.access_token,
        environment: config.environment,
        main_api: config.api_url,
        tokenizer_api: config.tokenizer_url
    };

    Ok(Template::render("js/app", &ctx))
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .configure(
            rocket::Config::figment()
                .merge(("port", 9797))
                .merge(("address", "0.0.0.0")),
        )
        .mount("/", routes![index, stylecss, appjs])
        .attach(Template::fairing())
}
