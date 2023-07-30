const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const client = require('../../index');
const { logHandler } = require("../../Handlers/logHandler");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("nowplaying")
		.setDescription("Display info about the currently playing song."),
	/**
	 * 
	 * @param {ChatInputCommandInteraction} interaction 
	 * @param {client} client 
	 */
	async execute(interaction, client) {
		logHandler("client", "2", interaction.user.tag, interaction.commandName);
		await interaction.deferReply();

		const { member, user } = interaction;
		const embed = new EmbedBuilder();

		try {
			const queue = client.distube.getQueue(interaction);
			if (!queue) {
				logHandler("error", "0", user.tag, interaction.commandName, "", "no one is playing music at this moment");
				return interaction.followUp(`no one is playing music at this moment!`);
			};

			const uni = `${queue.songs[0].playing ? '⏸️ |' : '🔴 |'}`;
			const part = Math.floor((queue.currentTime / queue.songs[0].duration) * 30);

			const embed = new EmbedBuilder()
				.setAuthor({ name: queue.songs[0].playing ? 'Song Pause...' : 'Now Playing...', iconURL: "https://cdn.discordapp.com/emojis/741605543046807626.gif" })
				.setColor('#000001')
				.setTitle(`${queue.songs[0].name || 'Unknown Title'}`)
				.setURL(`${queue.songs[0].url}`)
				// .setDescription(`**[${queue.songs[0].name}](${queue.songs[0].url})**`)
				.setThumbnail(`${queue.songs[0].thumbnail}`)
				.addFields(
					// { name: `Duration:`, value: `${queue.songs[0].formattedDuration}`, inline: true },
					{ name: 'Uploader:', value: `[${queue.songs[0].uploader.name}](${queue.songs[0].uploader.url})`, inline: true },
					{ name: 'Requester:', value: `${queue.songs[0].user}`, inline: true },
					{ name: 'Volume:', value: `${queue.volume}%`, inline: true },
					{ name: 'Filters:', value: `${queue.filters.names.join(', ') || "Normal"}`, inline: true },
					{ name: 'Views', value: `${queue.songs[0].views}`, inline: true },
					{ name: 'Likes:', value: `${queue.songs[0].likes}`, inline: true },
				)
				.addFields({ name: `Current Duration: \`[${queue.formattedCurrentTime} / ${queue.songs[0].formattedDuration}]\``, value: `\`\`\`${uni} ${'▬'.repeat(part) + '🎶' + '▬'.repeat(24 - part)}\`\`\``, inline: false })
				.setTimestamp()

				logHandler("client", "3", user.tag, interaction.commandName);
			return interaction.followUp({ embeds: [embed] });

		} catch (error) {
			console.log(error);
			embed.setColor('Red').setDescription("⛔ | Something went wrong... Please try again.");

			logHandler("error", "1", user.tag, "", "", error);
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		};
	}
};