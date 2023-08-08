const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const client = require('../../index');
const { logHandler } = require("../../Handlers/logHandler");
const { errorEmbed } = require('../../Handlers/messageEmbed');

module.exports = {
	inVoiceChannel: true,
	sameVoiceChannel: true,
	data: new SlashCommandBuilder()
		.setName("loop")
		.setDescription("Looping the song/queue.")
		.addStringOption(option =>
			option.setName("type")
				.setDescription("Set the looping type")
				.setRequired(true)
				.addChoices(
					{ name: "off", value: "off" },
					{ name: "song", value: "song" },
					{ name: "queue", value: "queue" }
				)
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
		const queue = client.distube.getQueue(interaction);
		const value = options.getString("type");
		let type = value;

		if (!queue) {
			embed.setDescription("\`📛\` | **No one is playing music right now!**");

			logHandler("error", "0", user.tag, interaction.commandName, "", "no one is playing music at this moment");
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		};

		switch (type) {
			case "off": {
				type = 0
			}
				break;

			case "song": {
				type = 1
			}
				break;

			case "queue": {
				type = 2
			}
				break;
		};

		try {
			mode = queue.setRepeatMode(type);
			mode = mode ? (mode === 2 ? 'Repeat queue' : 'Repeat song') : 'Off';
			embed.setDescription(`\`🔁\` | Success set loop mode to \`${mode}\``)

			logHandler("distube", "9", user.tag, "", value);
			return interaction.followUp({ embeds: [embed] });

		} catch (err) {
			console.log(err);

			logHandler("error", "1", user.tag, "", "", err);
			return interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
		};
	}
};