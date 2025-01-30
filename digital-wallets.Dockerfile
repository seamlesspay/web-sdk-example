FROM rust:1.81.0 AS dw-build

# Install musl (alpine) libraries
RUN --mount=target=/var/lib/apt/lists,type=cache,sharing=locked \
  --mount=target=/var/cache/apt,type=cache,sharing=locked \
  apt-get update -qq \
  && apt-get install --no-install-recommends -y \
    musl-tools

# Create a new empty shell project
RUN USER=root cargo new --bin digital-wallets
WORKDIR /digital-wallets

# Copy our manifests
COPY examples/digital-wallets/Cargo.lock ./Cargo.lock
COPY examples/digital-wallets/Cargo.toml ./Cargo.toml

# Build only the dependencies to cache them
RUN rustup target add x86_64-unknown-linux-musl
RUN cargo build --release --target=x86_64-unknown-linux-musl \
  && rm src/* \
  && rm target/x86_64-unknown-linux-musl/release/deps/digital_wallets*

# Now that the dependency is built, copy source code
COPY examples/digital-wallets/src ./src

# Build for release.
RUN cargo build --release --target=x86_64-unknown-linux-musl

FROM alpine:3.14

WORKDIR /dw

COPY --from=dw-build /digital-wallets/target/x86_64-unknown-linux-musl/release/digital-wallets ./digital-wallets
COPY examples/digital-wallets/templates ./templates
COPY examples/digital-wallets/dw-config.toml ./dw-config.toml

CMD ["./digital-wallets"]
