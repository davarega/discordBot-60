const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const client = require('../../index');
const { logHandler } = require("../../Handlers/logHandler");
const { errorEmbed } = require("../../Handlers/messageEmbed");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("queue")
		.setDescription("Show the list of songs added to the queue.")
		.addIntegerOption(option =>
			option.setName("page")
				.setDescription("Page number of the queue")
				.setMinValue(1)
		),
	/**
	 * 
	 * @param {ChatInputCommandInteraction} interaction 
	 * @param {client} client 
	 */
	async execute(interaction, client) {
		logHandler("client", "2", interaction.user.tag, interaction.commandName);
		await interaction.deferReply();

		const { options, user } = interaction;
		const embed = new EmbedBuilder();
		const pageIndex = (options.getInteger("page") || 1) - 1;
		const queue = client.distube.getQueue(interaction);

		if (!queue) {
			embed.setDescription("\`📛\` | **No one is playing music right now!**");

			logHandler("error", "0", user.tag, interaction.commandName, "", "no one is playing music at this moment");
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		};

		const queueLength = queue.songs.length;
		const totalPages = Math.ceil(queueLength / 10) || 1;

		if (pageIndex > totalPages) {
			embed.setDescription(`\`📛\` | Oops! page \`${pageIndex + 1}\` is not a valid page number.\nThey are only a total of \`${totalPages}\` pages in the queue.`);

			logHandler("error", "0", user.tag, interaction.commandName, "", "Page was higher than total pages.");
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		};

		if (queueLength === "0") {
			embed.setDescription("\`📛\` | The queue is empty, add some songs with **`/play`**!");

			logHandler("error", "0", user.tag, interaction.commandName, "", "the queue is empty");
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		};

		try {
			const queueString = queue.songs
				.slice(pageIndex * 10, pageIndex * 10 + 10)
				.map((song, index) => {
					return `${pageIndex * 10 + index + 1}. \`${song.formattedDuration}\` - [${song.name}](${song.url})`;
				}).join('\n');

			const playNow = queue.songs[0];

			embed.setAuthor({ name: "📑 Current Queue" })
				.setTitle("**Queue list:**")
				.setDescription(`**Now Playing:** [${playNow.name}](${playNow.url}) - \`${playNow.formattedDuration}\` • request by **${playNow.user.tag}**\n\n${queueString}`)
				.setTimestamp()
				.setFooter({
					text: `Page ${pageIndex + 1} of ${totalPages} (${queueLength} songs)`
				});

			logHandler("client", "3", user.tag, interaction.commandName);
			return interaction.followUp({ embeds: [embed] });

		} catch (error) {
			console.log(error);

			logHandler("error", "1", user.tag, "", "", error);
			return interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
		};
	}
}