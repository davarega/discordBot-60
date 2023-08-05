const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const accountSchema = require("../../Models/accountSchema");
const { logHandler } = require("../../Handlers/logHandler");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("account")
		.setDescription("Create or delete your economy account.")
		.addStringOption(option =>
			option.setName("options")
				.setDescription("Choice an option.")
				.setRequired(true)
				.addChoices(
					{ name: "Create", value: "create" },
					{ name: "Delete", value: "delete" },
				)
		),
	/**
	 * 
	 * @param {ChatInputCommandInteraction} interaction 
	 */
	async execute(interaction) {
		logHandler("client", "2", interaction.user.tag, interaction.commandName);
		await interaction.deferReply();

		const { options, user } = interaction;
		const embed = new EmbedBuilder();

		let data = await accountSchema.findOne({ userId: user.id });
		const option = options.getString("options");

		switch (option) {
			case "create": {
				if (data) {
					embed.setDescription("\`📛\` | You already have an economy account.");

					logHandler("error", "3", user.tag, "", option, "user already have economy account.");
					return interaction.followUp({ embeds: [embed], ephemeral: true });
				}

				data = new accountSchema({
					userId: user.id,
					coins: 1,
				});

				await data.save();
				embed.setDescription("\`💳\` | Your account has been successfully created!\nAnd you get \`1\`:coin: Naracoin.");

				logHandler("economy", "0", user.tag, "", option);
				interaction.followUp({ embeds: [embed], ephemeral: true });
			}
				break;
			case "delete": {
				if (!data) {
					embed.setDescription("\`📛\` | Please type **/account** to create your economy account");

					logHandler("error", "3", user.tag, "", option, "user no have economy account.");
					return interaction.followUp({ embeds: [embed], ephemeral: true });
				};

				await data.deleteOne();
				embed.setDescription("\`💳\` | Your account has been successfully deleted!");

				logHandler("economy", "0", user.tag, "", option);
				interaction.followUp({ embeds: [embed], ephemeral: true });
			}
				break;
		}
	}
}