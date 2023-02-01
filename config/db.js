const dotenv = require("dotenv");
dotenv.config();

const { Client } = require("pg");
const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "todo",
  password: process.env.PASSWORD,
  port: 5432,
});

client.connect();

module.exports = client;
