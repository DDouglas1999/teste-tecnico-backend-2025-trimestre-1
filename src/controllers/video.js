// const express = require('express');

const multer = require("multer");
const mimeTypes = require("mime-types");
const fs = require("fs");

// 10mb de tamanho
const upload = multer(
	{
		storage: multer.memoryStorage(),
		limits: {
			fileSize: 10 * 1024 * 1024,
			files: 1,
		},
	},
	{}
);

const postVideoConfig = { directory: "./uploads", overwrite: false };
const getVideoConfig = { directory: "./uploads" };

const saveVideoLocal = (fileName, file) => {
	fs.writeFile(postVideoConfig.directory + "/" + fileName, file);
};
const loadVideoLocal = (fileName) => {
	// return fs.sendFile(getVideoConfig.directory + "/" + fileName);
};
// fs.existsSync(`./uploads/${req.file.originalname}`);
const postVideo = (req, res) => {
	try {
		console.log(req.file);
		if (!req.file) {
			console.log("nofile");
			return res.status(400).send("No file uploaded");
		}
		const mimeType = mimeTypes.lookup(req.file.originalname);
		// checa se o arquivo é um video
		if (
			!mimeType ||
			(!mimeType.startsWith("video/") && mimeType !== "application/mp4")
		) {
			console.log("its not a video");
			return res.status(400).send("Uploaded file is not a video");
		}
		// checa se o arquivo é maior que 10mb
		if (req.file.size > 10 * 1024 * 1024) {
			console.log("its too big");
			return res.status(400).send("Uploaded file is too big");
		}
		saveVideoLocal(`./uploads/${req.file.originalname}`, req.file.buffer);
		console.log("its working");
		res.status(204).send("its working");
		// fs.writeFileSync(
		// 	`./uploads/${req.file.originalname}`,
		// 	req.file.buffer,
		// 	(err) => {
		// 		console.log(err);
		// 	}
		// );
	} catch (error) {
		console.log(error.message);
		res.status(500).send("Internal server error");
	}
};
const getVideo = (req, res) => {
	try {
		const fileName = req.params.filename;
		console.log(fileName);
		const range = req.headers.range;
		if (range) {
			const [start, end] = range.replace("bytes=", "").split("-");
			const startByte = parseInt(start);
			const endByte = end ? parseInt(end) : end;
		}
		// loadVideoLocal(fileName);

		// res.status(200).send("get video");
	} catch (error) {}
};

module.exports = {
	postVideo,
	getVideo,
};
