FROM alpine:3.21

RUN apk add --no-cache unzip curl

# Install mc binary for the current architecture
RUN ARCH=$(uname -m | sed 's/x86_64/amd64/;s/aarch64/arm64/') && \
    curl -sSfL "https://dl.min.io/client/mc/release/linux-${ARCH}/mc" \
         -o /usr/local/bin/mc && \
    chmod +x /usr/local/bin/mc

COPY init.sh /init.sh
RUN chmod +x /init.sh

ENTRYPOINT ["/bin/sh", "/init.sh"]
