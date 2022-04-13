####################################################################################################
## Builder
####################################################################################################
FROM rust:latest AS builder

ARG TARGETPLATFORM
RUN if [ "$TARGETPLATFORM" = "linux/amd64" ]; then export ARCHITECTURE=x86_64-unknown-linux-musl; elif [ "$TARGETPLATFORM" = "linux/arm64" ]; then export ARCHITECTURE=aarch64-unknown-linux-gnu; else export ARCHITECTURE=aarch64-unknown-linux-gnu; fi \
    && rustup target add ${ARCHITECTURE}

RUN apt update && apt install -y musl-tools musl-dev
RUN update-ca-certificates

# Create appuser
ENV USER=rconconnector
ENV UID=10001

RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    "${USER}"


WORKDIR /rconconnector

COPY ./ .

RUN if [ "$TARGETPLATFORM" = "linux/amd64" ]; then export ARCHITECTURE=x86_64-unknown-linux-musl && echo "openssl = { version = \"0.10\", features = [\"vendored\"] }" >> ./Cargo.toml; elif [ "$TARGETPLATFORM" = "linux/arm64" ]; then export ARCHITECTURE=aarch64-unknown-linux-gnu; else export ARCHITECTURE=aarch64-unknown-linux-gnu; fi \
    && cargo build --target ${ARCHITECTURE} --release \
    && mv /rconconnector/target/${ARCHITECTURE}/release/rcon-connector /rconconnector/target/release/rcon-connector

####################################################################################################
## Final image
####################################################################################################
# TODO: One day figure out a way to run on Scratch or Alpine base image to get a smaller image
FROM debian:buster-slim

# Import from builder.
COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder /etc/group /etc/group

WORKDIR /rconconnector

RUN apt-get update && apt install libssl-dev -y

# Copy our build
COPY --from=builder /rconconnector/target/release/rcon-connector ./

# Use an unprivileged user.
USER rconconnector:rconconnector

CMD ["/rconconnector/rcon-connector"]
