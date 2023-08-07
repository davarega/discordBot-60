module.exports = {
	name: "noRelated",

	async execute(client, queue) {

		queue.textChannel.send(`\`❌\` | Can't find related video to play. Stop playing music.`);
	}
}