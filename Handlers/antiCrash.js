const { EmbedBuilder, WebhookClient } = require('discord.js');
const config = require('../config.json');
const { inspect } = require('util');
const webhook = new WebhookClient({ url: config.webhook.error });
const embed = new EmbedBuilder()

module.exports = (client) => {

	client.on("error", (err) => {
		console.log(err);

		embed.setTitle("Discord API Error")
			.setURL("https://discordjs.guide/popular-topics/errors.html")
			.setDescription(`\`\`\` ${inspect(err, { depth: 0 }).slice(0, 1000)} \`\`\``)
			.setTimestamp();

		return webhook.send({ embeds: [embed] });
	});

	process.on('unhandledRejection', (reason, promise) => {
		console.log(reason, "\n", promise);

		embed.setTitle("Unhandled Rejection/Catch")
			.setURL("https://nodejs.org/api/process.html#event-unhandledrejection")
			.addFields(
				{
					name: "Reason",
					value: `\`\`\` ${inspect(reason, { depth: 0 }).slice(0, 1000)} \`\`\``
				},
				{
					name: "Promise",
					value: `\`\`\` ${inspect(promise, { depth: 0 }).slice(0, 1000)} \`\`\``
				}
			)
			.setTimestamp();

		return webhook.send({ embeds: [embed] });
	});

	process.on('uncaughtException', (err, origin) => {
		console.log(err, "\n", origin);

		embed.setTitle("uncaught Exception")
			.setURL("https://nodejs.org/api/process.html#event-uncaughtexception")
			.addFields(
				{
					name: "Error",
					value: `\`\`\` ${inspect(err, { depth: 0 }).slice(0, 1000)} \`\`\``
				},
				{
					name: "Origin",
					value: `\`\`\` ${inspect(origin, { depth: 0 }).slice(0, 1000)} \`\`\``
				}
			)
			.setTimestamp();

		return webhook.send({ embeds: [embed] });
	});

	process.on('uncaughtExceptionMonitor', (err, origin) => {
		console.log(err, "\n", origin);

		embed.setTitle("uncaught Exception Monitor")
			.setURL("https://nodejs.org/api/process.html#event-uncaughtexceptionmonitor")
			.addFields(
				{
					name: "Error",
					value: `\`\`\` ${inspect(err, { depth: 0 }).slice(0, 1000)} \`\`\``
				},
				{
					name: "Origin",
					value: `\`\`\` ${inspect(origin, { depth: 0 }).slice(0, 1000)} \`\`\``
				}
			)
			.setTimestamp();

		return webhook.send({ embeds: [embed] });
	});

	process.on('warning', (warning) => {
		console.log(warning);

		embed.setTitle("Warning")
			.setURL("https://nodejs.org/api/process.html#event-warning")
			.addFields(
				{
					name: "Warning",
					value: `\`\`\` ${inspect(warning, { depth: 0 }).slice(0, 1000)} \`\`\``
				}
			)
			.setTimestamp();

		return webhook.send({ embeds: [embed] });
	});
}