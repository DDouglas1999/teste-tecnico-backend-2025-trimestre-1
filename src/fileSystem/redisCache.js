const redis = require("redis");
const client = redis.createClient({
	host: "localhost",
	port: 6379,
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
