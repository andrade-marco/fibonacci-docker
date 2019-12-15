const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const redis = require("redis");
const {
	pgUser,
	pgPassword,
	pgDatabase,
	pgHost,
	pgPort,
	redisHost,
	redisPort
} = require("./keys");

// Express setup
const app = express();
app.use(cors());
app.use(bodyParser.json());

// DB connection
const pgClient = new Pool({
	user: pgUser,
	password: pgPassword,
	host: pgHost,
	database: pgDatabase,
	port: pgPort
});

pgClient.on("error", () => console.log("Lost PG connection..."));
pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)')
		.catch(err => console.log(err));

// Setup Redis Client
const redisClient = redis.createClient({
	host: redisHost,
	port: redisPort,
	retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();


// Express route handlers
app.get("/", (req, res) => {
	res.send("Hello");
});

app.get("/values/all", async (req, res) => {
	const values = await pgClient.query('SELECT * FROM values');
	res.send(values.rows);
});

app.get("/values/current", async (req, res) => {
	redisClient.hgetall("values", (err, values) => {
		res.send(values);
	});
});

app.post("/values", async (req, res) => {
	const { index } = req.body;
	if (parseInt(index) > 40) {
		return res.status(422).send("Index too high!");
	}

	redisClient.hset("values", index, "Nothing yet...");
	redisPublisher.publish("insert", index);
	pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

	res.send({ working: true });
});

app.listen(5000, err => console.log("Listening..."));