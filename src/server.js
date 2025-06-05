const express = require("express");
const app = express();

const port = 3000;

const videoRouter = require("./routes/video");
const multer = require("multer");

app.use("/", videoRouter);
const start = async () => {
	try {
		app.use((err, req, res, next) => {
			if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
				return res.status(400).json({ error: "File too large" });
			}
			next(err);
		});
		app.listen(port, () => {
			console.log(`Servidor rodando na porta ${port}`);
		});
	} catch (error) {
		console.log(error);
	}
};
start();
