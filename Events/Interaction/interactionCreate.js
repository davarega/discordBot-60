const { ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const config = require('../../config.json');
const { logHandler } = require('../../Handlers/logHandler');
const accountSchema = require('../../Mode../../Models/accountSchema');

module.exports = {
	name: "interactionCreate",
	/**
	 * 
	 * @param {ChatInputCommandInteraction} interaction 
	 * @param {*} client 
	 */
	async execute(interaction, client) {
		if (!interaction.isChatInputCommand()) return;

		const { guild, member, user } = interaction;
		const embed = new EmbedBuilder();

		// ========== Check DM's Commands ==========
		if (!interaction.guildId) {
			embed.setDescription("\`📛\` | Sorry Skynara Bot doesn't support private messages yet");

			logHandler("error", "0", user.tag, interaction.commandName, "", "user using command in DM");
			return interaction.reply({ embeds: [embed] });
		};

		// ========== Check Commands ==========
		const command = client.commands.get(interaction.commandName);
		if (!command) {
			embed.setDescription("\`📛\` | Outdated command! Please check in later.");

			logHandler("error", "0", user.tag, interaction.commandName, "", "Outdated command");
			return interaction.reply({ embeds: [embed], ephemeral: true });
		};

		// ========== Developer Commands ==========
		if (command.developer && guild.id !== config.devGuildID || guild.id !== config.supportServerID) {
			embed.setDescription("\`📛\` | This command is only for the SkyNara bot developer!");

			logHandler("error", "0", user.tag, interaction.commandName, "", "user try developer command");
			return interaction.reply({ embeds: [embed], ephemeral: true });
		};

		// ========== Voice Channel Check ==========
		if (command.inVoiceChannel && !member.voice.channel) {
			embed.setDescription("\`📛\` | You need to be in a voice channel to play music!");

			logHandler("error", "0", user.tag, interaction.commandName, "", "user not in voice channel");
			return interaction.reply({ embeds: [embed], ephemeral: true });
		};

		if (command.sameVoiceChannel && member.voice.channel !== guild.members.me.voice.channel) {
			embed.setDescription("\`📛\` | You need to be in a same/voice channel.");

			logHandler("error", "0", user.tag, interaction.commandName, "", "user and bot not in the same/voice channel");
			return interaction.reply({ embeds: [embed], ephemeral: true });
		};

		// ========== Economy Commands ==========
		let data = await accountSchema.findOne({ userId: user.id });
		if (command.economyAccount && !data) {
			embed.setDescription("\`📛\` | Please type **/account** to create your economy account.");

			logHandler("error", "0", user.tag, interaction.commandName, "", "user no have economy account");
			return interaction.reply({ embeds: [embed], ephemeral: true });
		};

		command.execute(interaction, client);
	}
};