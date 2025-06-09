const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 10 * 1024 * 1024,
		files: 1,
	},
});

const { getVideo, postVideo } = require("../controllers/video");

router.get("/static/video/:filename", getVideo);
router.post("/upload/video", upload.single("video"), postVideo);

module.exports = router;
