const { SlashCommandBuilder, ChatInputCommandInteraction, Client, EmbedBuilder } = require("discord.js");
const { logHandler } = require("../../Handlers/logHandler");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("queue")
		.setDescription("Show the list of tracks added to the queue."),
	/**
	 * 
	 * @param {ChatInputCommandInteraction} interaction 
	 * @param {Client} client 
	 */
	async execute(interaction, client) {
		logHandler("client", "2", interaction.user.tag, interaction.commandName);
		await interaction.deferReply();

		const { user } = interaction;
		const embed = new EmbedBuilder();

		const queue = client.distube.getQueue(interaction);
		if (!queue) {
			embed.setColor('Red').setDescription("no one is playing music at this moment!");

			logHandler("error", "0", user.tag, interaction.commandName, "", "no one is playing music at this moment");
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		};

		try {
			const track = queue.songs.map((song, i) => {
				return `${i === 0 ? "Now Playing:" : `${i}.`} [${song.name}](${song.url}) - \`${song.formattedDuration}\` • ${song.user}`
			}).join("\n");

			embed.setAuthor({ name: "📑 Queue List" })
				.setTitle("**Current queue:**")
				.setDescription(`${track}`)
				.setTimestamp();

			logHandler("client", "3", interaction.user.tag, interaction.commandName);
			return interaction.followUp({ embeds: [embed] });
		} catch (error) {
			console.log(error);
			embed.setColor('Red').setDescription("\`📛\` | Something went wrong... Please try again.");

			logHandler("error", "1", user.tag, "", "", error);
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		};

	}
}