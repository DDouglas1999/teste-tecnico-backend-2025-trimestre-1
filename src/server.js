const express = require("express");
const app = express();

const port = 3000;

const videoRouter = require("./routes/video");

app.use("/", videoRouter);
const start = async () => {
	try {
		app.listen(port, () => {
			console.log(`Servidor rodando na porta ${port}`);
		});
	} catch (error) {
		console.log(error);
	}
};
start();
