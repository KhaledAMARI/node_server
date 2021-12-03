# node_server
To use this NodeJs server you have to:
 - Clone the repo.
 - open a terminal within the folder and type `npm install`.
 - You have to add `.env` file that contains:
  * PORT: the server port.
  * DB_PATH: Database Path.
  * JWT_SECRET: a string used to generate the token.
 - Install nodemon globally and run `npm run dev` | Or run `node server.js`