const mimeTypes = require("mime-types");
const redisCache = require("../fileSystem/redisCache");
const localFileSystem = require("../fileSystem/localFileSystem");

// configuração do fileSystem
const storageConfig = {
	save: localFileSystem.saveVideoLocal,
	load: localFileSystem.loadVideoLocal,
};
const postVideo = async (req, res) => {
	try {
		// checa se um arquivo foi recebido
		if (!req.file) return res.status(400).send("No file uploaded");
		// checa se o arquivo é um video
		const mimeType = mimeTypes.lookup(req.file.originalname);
		if (
			!mimeType ||
			(!mimeType.startsWith("video/") && mimeType !== "application/mp4")
		)
			return res.status(400).send("Uploaded file is not a video");
		// salva o arquivo primeiro no redis e depois no sistema de arquivos
		redisCache.saveFileCache(req.file.originalname, req.file.buffer);
		storageConfig.save(req.file.originalname, req.file.buffer);
		res.status(204).send();
	} catch (error) {
		console.log(error.message);
		res.status(500).send("Internal server error");
	}
};
const getVideo = async (req, res) => {
	try {
		// precisa de função para o caso de a extensão do arquivo nao ter sido definida
		const fileName = req.params.filename;
		// funcão que define o range do arquivo, se houver
		const getRange = (r) => {
			if (!r) return;
			const [start, end] = r?.replace("bytes=", "").split("-");
			const finalRange = {};
			finalRange.start = parseInt(start);
			finalRange.end = parseInt(end);
			return finalRange;
		};
		const range = getRange(req.headers.range);
		// checa se um arquivo existe no cache redis e o retorna
		const cacheFile = await redisCache.getFileCache(fileName);
		if (cacheFile) {
			const contentType = mimeTypes.lookup(fileName);
			res.set({
				// status: 206,
				"Content-Type": contentType,
				// "accept-ranges": "bytes",
				// "content-Range": range ? `bytes=${range?.start}-${range?.end}` : "",
				// "content-Length": cacheFile?.length,
			});
			const finalCacheFile = !range
				? cacheFile
				: cacheFile.subarray(range.start, range.end);
			res.status(range ? 206 : 200).send(finalCacheFile);
			return;
		}
		return storageConfig.load(fileName, range, res);
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	postVideo,
	getVideo,
};
