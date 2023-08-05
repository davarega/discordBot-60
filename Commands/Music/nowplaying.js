const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const client = require('../../index');
const { logHandler } = require("../../Handlers/logHandler");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("nowplaying")
		.setDescription("Show information about the track currently playing."),
	/**
	 * 
	 * @param {ChatInputCommandInteraction} interaction 
	 * @param {client} client 
	 */
	async execute(interaction, client) {
		logHandler("client", "2", interaction.user.tag, interaction.commandName);
		await interaction.deferReply();

		const { member, user } = interaction;

		const queue = client.distube.getQueue(interaction);
		if (!queue) {
			embed.setDescription("\`📛\` | **No one is playing music right now!**");

			logHandler("error", "0", user.tag, interaction.commandName, "", "no one is playing music at this moment");
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		};

		const embed = new EmbedBuilder()
			.setAuthor({ name: queue.songs[0].playing ? 'Song Pause...' : 'Now Playing...', iconURL: "https://cdn.discordapp.com/emojis/741605543046807626.gif" })
			.setColor('#000001')
			.setTitle(`${queue.songs[0].name || 'Unknown Title'}`)
			.setURL(`${queue.songs[0].url}`)
			.setThumbnail(`${queue.songs[0].thumbnail}`)
			.addFields(
				{ name: 'Uploader:', value: `**[${queue.songs[0].uploader.name}](${queue.songs[0].uploader.url})**`, inline: true },
				{ name: 'Requester:', value: `${queue.songs[0].user}`, inline: true },
				{ name: 'Autoplay:', value: `\`${queue.autoplay ? "On" : "Off"}\``, inline: true },
				{ name: 'Volume:', value: `\`${queue.volume}%\``, inline: true },
				{ name: 'Filters:', value: `\`${queue.filters.names.join(', ') || "Normal"}\``, inline: true },
				{ name: 'Views', value: `\`${queue.songs[0].views}\``, inline: true },
				{ name: 'Likes:', value: `\`${queue.songs[0].likes}\``, inline: true },
			)
			.setTimestamp()

		try {
			if (queue.songs[0].formattedDuration === 'Live') {
				embed.addFields({ name: `Current Duration: \`[${queue.formattedCurrentTime} / ${queue.songs[0].formattedDuration}]\``, value: `\`\`\`🔴 | 🧿▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\`\`\``, inline: false })

			} else {
				const part = Math.floor((queue.currentTime / queue.songs[0]?.duration) * 30);
				embed.addFields({ name: `Current Duration: \`[${queue.formattedCurrentTime} / ${queue.songs[0].formattedDuration}]\``, value: `\`\`\`🔴 | ${'▬'.repeat(part) + '🧿' + '▬'.repeat(30 - part)}\`\`\``, inline: false })

			};
			logHandler("client", "3", user.tag, interaction.commandName);
			return interaction.followUp({ embeds: [embed] });

		} catch (error) {
			console.log(error);
			embed.setColor('Red').setDescription("\`📛\` | Something went wrong... Please try again.");

			logHandler("error", "1", user.tag, "", "", error);
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		};
	}
};