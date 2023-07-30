const mongoose = require('mongoose');
const { logHandler } = require('../../Handlers/logHandler');
require('colors');


module.exports = {
	name: "ready",
	once: true,

	async execute(client) {
		await mongoose.connect(process.env.MONGO_DB || "")
		.then(() => {
			logHandler("client", "0", "[MONGODB]");
		}).catch(error =>console.log(error));

		client.user.setActivity("New version");
		logHandler("client", "1", client.user.username);
	}
}