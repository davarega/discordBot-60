module.exports = {
	name: "error",

	async execute(err) {
		console.error("Masuk" + err);
		// channel.send(`An error encoutered: ${err}`);
	}
}