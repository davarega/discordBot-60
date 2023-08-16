
const { logHandler } = require("../../Handlers/logHandler");

module.exports = {
	name: "error",

	async execute(client, channel, err) {
		console.error(err);
		logHandler("error", "3", "Distube", "error", "", err);
	}
};