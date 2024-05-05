#!/bin/bash

set -x

# RPC credentials and server configuration
RPC_USER='omarjarkas'
RPC_PASSWORD='a7a5ecf254455094f48d24001029cd37$e0bc346f3fd8d476b3d5f088e704efb81a33d97016085707c67d405b2e9bc3f4'
SERVER_IP='localhost'
SERVER_PORT='8332'

# Create a JSON request string
JSON_RPC_DATA='{"jsonrpc":"1.0","id":"curltext","method":"getblockchaininfo","params":[]}'

# Use curl to post the RPC request
# Basic Authentication is used for RPC calls
curl --user $RPC_USER:$RPC_PASSWORD \
     --data-binary "$JSON_RPC_DATA" \
     -H 'content-type: text/plain;' \
     http://$SERVER_IP:$SERVER_PORT/

# Note: Ensure that your Bitcoin Core is configured to accept RPC calls from this server

set +x