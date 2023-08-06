module.exports = {
	name: "finish",

	async execute(client, queue) {
		const embed = new EmbedBuilder()
			.setDescription(`\`📛\` | **Song has been:** \`Ended\``)
			.setColor('#000001');

		queue.textChannel.send({ embeds: [embed] });
	}
}