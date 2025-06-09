const redis = require("redis");
require("dotenv").config();
const env = process.env;
const host = env.REDIS_HOST || "localhost";
const port = env.REDIS_PORT || 6379;
const client = redis.createClient({
	socket: {
		host: host,
		port: port,
	},
});
client.on("error", (err) => console.log("Redis Client Error", err));
client.connect();
const saveFileCache = async (fileName, file) => {
	console.log(fileName);

	client.set(fileName, file.toString("base64"), {
		EX: 60,
	});
};

const getFileCache = async (fileName) => {
	const file = await client.get(fileName);

	if (file) {
		console.log("buffer returned");

		return Buffer.from(file, "base64");
	}
};

module.exports = {
	saveFileCache,
	getFileCache,
};
