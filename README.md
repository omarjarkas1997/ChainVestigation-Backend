# Bitcoin REST API Backend Server

A comprehensive backend server that provides RESTful API endpoints to access various information and operations available on the Bitcoin node. This backend application is built using Express.js and interfaces with the Bitcoin core using the bitcoin-core npm package.


## Features:
1. Blockchain Information: Retrieve the latest details of the bitcoin blockchain.
2. Memory Pool: Get transactions available in the memory pool.
3. Network Information: Fetch the current network status, active connections, and other relevant data.
4. Mining Information: Gather the mining details and statistics.
5. Wallet Information: Access your node's wallet data.
6. Raw Transaction Information: Get details of any raw transactions.
7. Miscellaneous Routes: For other general purposes and utility functions related to the blockchain.
8. The server also logs all the requests in an access log using the morgan middleware.

## Installation:
1. Clone this repository.
2. Run npm install to install all the required dependencies.
3. Update the config file with your bitcoin node's credentials and server's IP and port.


## Configuration:

Inside the config JSON, you can configure:

#### Bitcoin Client:

- `network`: Network type. Example: "mainnet"
- `username`: Your node's RPC username
- `password`: Your node's RPC password
- `port`: The port on which your Bitcoin RPC server is running. Default is 8332.
- `host`: Host address of your Bitcoin node. Default is "127.0.0.1".

#### App Configuration:

- `IP`: The IP where this backend server should run. Default is "0.0.0.0" (which means it will listen on all network interfaces).
-`port`: Port number on which this backend server should run. Default is 4200.



## How to run:

- For development
    ```
    npm run dev
    ```
- For producion
    ```
    npm start
    ```

### Dependencies:

- `bitcoin-core`: To communicate with the Bitcoin RPC server.
- `express`: For creating the server and API endpoints.
- `morgan`: To log API requests.
##### Dev Dependency:
- `nodemon`: To automatically restart the server during development.



## Contribution:

Feel free to fork this repository and add any features or improvements. Pull requests are welcome!




## License:

ISC