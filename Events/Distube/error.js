module.exports = {
	name: "error",

	async execute(err) {
		console.error(err);
		// channel.send(`An error encoutered: ${err}`);
	}
}