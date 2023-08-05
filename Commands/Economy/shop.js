const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const { logHandler } = require('../../Handlers/logHandler');
const accountSchema = require('../../Models/accountSchema');
const config = require('../../config.json');

module.exports = {
	economyAccount: true,
	data: new SlashCommandBuilder()
		.setName("shop")
		.setDescription("A shop where you can spend your coins.")
		.addIntegerOption(option =>
			option.setName("buy")
				.setDescription("Please input item number.")
				.setMinValue(1)
		),
	/**
	 * 
	 * @param {ChatInputCommandInteraction} interaction 
	 * @returns 
	 */
	async execute(interaction) {
		logHandler("client", "2", interaction.user.tag, interaction.commandName);
		await interaction.deferReply();

		const { options, user } = interaction;
		const embed = new EmbedBuilder();
		const data = await accountSchema.findOne({ userId: user.id });

		const buyItem = options.getInteger("buy");
		const listItems = config.shopList.map((item, index) => { return `**\`[ ${index + 1} ]\`** :  **${item.name}**  : \`${item.price}🪙\``}).join("\n");
		
		const itemslength = config.shopList.length;

		if (buyItem > itemslength) {
			logHandler("error", "0", user.tag, interaction.commandName, "", `item not found`);
			return interaction.followUp({ content: "Ga ada", ephemeral: true });
		};

		try {
			if (!buyItem) {
				embed.setTitle("\`🛒 | SkyNara Shop\`")
					.setDescription(listItems);

				logHandler("client", "3", user.tag, interaction.commandName);
				return interaction.followUp({ embeds: [embed] });

			} else {
				const item = config.shopList[buyItem - 1];

				if (data.coins < item.price) {
					embed.setDescription(`\`📛\` | You don't have enough Naracoins to buy this item`);

					logHandler("error", "0", user.tag, interaction.commandName, "", `user don't have enough Naracoins to buy item: ${item.name}`);
					return interaction.followUp({ embeds: [embed], ephemeral: true });

				} else if (data.tags.includes(item.name.toLowerCase())) {
					embed.setDescription(`\`📛\` | You already have a ${item.name} tag`);

					logHandler("error", "0", user.tag, interaction.commandName, "", `user already have a ${item.name} tag`);
					return interaction.followUp({ embeds: [embed], ephemeral: true });
				};

				await accountSchema.findOneAndUpdate({ userId: user.id }, {
					$addToSet: {
						tags: `${item.name.toLowerCase()}`
					},
					$inc: {
						coins: -item.price
					}
				});

				embed.setTitle(`\`🛒 | Success buy a ${item.name}\``)
					.setDescription(`Noy you can use \` /${item.name} \` command.`)

				logHandler("economy", "1", user.tag, "", item.name);
				return interaction.followUp({ embeds: [embed], ephemeral: true });
			};

		} catch (error) {
			console.log(error);
			embed.setColor('Red').setDescription("\`📛\` | Something went wrong... Please try again.");

			logHandler("error", "0", user.tag, interaction.commandName, "", error);
			return interaction.followUp({ embeds: [embed], ephemeral: true });
		};
	}
};