const fs = require("fs");
const path = require("path");
mimeTypes = require("mime-types");
const filePath = path.resolve(__dirname, "../uploads");
const loadVideoLocal = (fileName, range, res) => {
	const stream = fs.createReadStream(path.join(filePath, fileName), {
		start: range?.start || 0,
		end: range?.end || undefined,
	});
	stream.on("error", (err) => {
		console.log(err);
		if (err.code === "ENOENT") {
			res.status(404).send("File not found");
			return;
		}
		res.status(404).send(err);
		stream.destroy();
		return;
	});
	stream.on("open", () => {
		res.set({
			"Content-Type": mimeTypes.lookup(fileName),
		});
		return stream.pipe(res.status(range ? 206 : 200));
	});
};
const saveVideoLocal = (fileName, file) => {
	fs.writeFile(path.join(filePath, fileName), file, (err) => {
		if (err) {
			console.log(err);
		}
	});
};

module.exports = { loadVideoLocal, saveVideoLocal };
