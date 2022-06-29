const fs = require("fs");
const MULTER_UPLOAD_CONF = require("../Configurations/multer.config");
const File = require("../Models/File");
const path = require("path");
const getInfo = require("../Helpers/GetDuration");

const upload = async (req, res, next) => {
	MULTER_UPLOAD_CONF(req, res, async (err) => {
		if (err) {
			console.error(err);
			return res.status(400).json({
				message: `An error occured while saving the file.`,
			});
		}
		const info = await getInfo(req);
		console.log(req.file);
		const newFile = new File({
			fileName: req.file.path,
			info: {
				format: info.fileType,
				duration: info.duration,
				encoding: info.encoding,
				originalname: req.file.originalname,
				size: info.size,
			},
		});
		try {
			await newFile.save();
			res.json({
				message: "File saved successfully.",
			});
		} catch (e) {
			console.log(`[SERVER]: Error while saving the file, ${e.message}`);
			res.json({
				message: `An error occured while saving the file.`,
			});
		}
	});
};

const info = async (req, res, next) => {
	const { id } = req.query;
	console.log(req.query);
	try {
		const doc = await File.findById(id);
		return res.json({
			...doc.info,
			likes: doc.likes,
			comments: doc.comments,
		});
	} catch (e) {
		return res.status(404).json({
			message: `No file with that ID exists`,
		});
	}
};

const stream = async (req, res, next) => {
	try {
		const file = await File.findById(req.query.id);
		file.views += 1;
		await file.save()
		res.setHeader("Content-Type", file.info.format);
		fs.createReadStream(file.fileName).pipe(res);
	} catch (e) {
		console.log(e.message);
		return res.status(404).json({
			message: `Can't find that media.`,
		});
	}
};

const like = async (req, res, next) => {
	console.log(req.body)
	try {
		const file = await File.findById(req.body.id);
		file.likes += 1;
		console.log(file);
		await file.save();
		return res.status(200).json({
			likes: file.likes
		});
	} catch(e) {
		console.error(e.message);
		throw new Error(e)
		return res.status(400).json({
			message: "An error occured while liking the video, Please try again."
		})
	}
}


const comment = async (req, res, next) => {
	try {
		const file = await File.findById(req.body.id);
		file.comments.push(req.body.comment);
		await file.save();
		return res.status(200).json({
			comments: file.comments
		});
	} catch(e) {
		console.error(e.message);
		throw new Error(e)
		return res.status(400).json({
			message: "An error occured while commenting on the video, Please try again."
		})
	}
}

module.exports = {
	upload,
	stream,
	info,
	like,
	comment
};