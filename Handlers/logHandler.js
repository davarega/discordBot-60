const { WebhookClient } = require('discord.js');
const config = require('../config.json');
require('colors');

function logHandler(type = "undefined", msg = "0", user = "undefined", command = "undefined", query = "undefined", error = "undefined") {
	const str = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
	const logger = `[ ${str.slice(0, 17)} ] `;
	logEmbed(logger, type, msg, user, command, query, error)

	let message = {
		"client": [
			"[MONGODB]".green + " database connected!",
			`${user.green} is online now!`,
			`user: ${user.green} is trying to use command: ${command.cyan}`,
			`user: ${user.green} successfully used command: ${command.cyan}`,
			`user: ${user.green} successfully search: ${query.blue}, in command: ${command.cyan}`,
			`user: ${user.green} gave a suggestion: ${query.cyan}`,
		],
		"distube": [
			`user: ${user.green} searching query: ${query.cyan}`,
			`user: ${user.green} now playing: ${query.cyan}`,
			`user: ${user.green} skip the song: ${command.cyan} to skip number: ${query.green}`,
			`user: ${user.green}, now playing music, query: ${command.cyan}, source url: ${query.blue}`,
			`user: ${user.green} add song: ${query.cyan} to queue`,
			`user: ${user.green} add song: ${command.cyan} to playlist (${query.blue})`,
			`user: ${user.green} pause the song: ${query.cyan}`,
			`user: ${user.green} resume the song: ${query.cyan}`,
			`user: ${user.green} has successfully set the volume to: ${query.cyan}%`,
			`user: ${user.green} has successfilly set the loop mode to: ${query.cyan}`
		],
		"economy": [
			`user: ${user.green} has been successfully ${query.cyan} economy account`,
			`user: ${user.green} successfully to buy: ${query.magenta}`
		],
		"error": [
			`user: ${user.green} failed to use command: ${command.cyan}, because: ${error.red}`,
			`user: ${user.green} failed to search: ${query.cyan}, because: ${error.red}`,
			`user: ${user.green} failed to ${query.cyan} economy account, because: ${error.red}`,
			`user: ${user.green} get some error: ${error.red}`
		],
		"undefined": ["undefined"],
	};
	const textResult = logger.yellow + message[type][msg];

	console.log(textResult);
};

async function logEmbed(logger, type, msg, user, command, query, error) {
	const webhook = new WebhookClient({ url: config.webhook.console });
	const dev = config.devUserID;

	let message = {
		"client": [
			`<@${dev}> [MONGODB] database connected!`,
			`<@${dev}> ${user} is online now!`,
			`user: ${user} is trying to use command: ${command}`,
			`user: ${user} successfully used command: ${command}`,
			`user: ${user} successfully search: ${query}, in command: ${command}`,
			`<@${dev}> user: ${user} gave a suggestion: ${query}`,
		],
		"distube": [
			`user: ${user} searching query: ${query}`,
			`user: ${user} now playing: ${query}`,
			`user: ${user} skip the song: ${query} to skip number: ${query}`,
			`user: ${user}, now playing music, query: ${command}, source url: ${query}`,
			`user: ${user} add song: ${query} to queue`,
			`user: ${user} add song: ${command} to playlist (${query})`,
			`user: ${user} pause the song: ${query}`,
			`user: ${user} resume the song: ${query}`,
			`user: ${user} has successfully set the volume to: ${query}%`,
			`user: ${user} has successfilly set the loop mode to: ${query}`
		],
		"economy": [
			`user: ${user} has been successfully ${query} economy account`,
			`user: ${user} successfully to buy: ${query}`
		],
		"error": [
			`user: ${user} failed to use command: ${command}, because: ${error}`,
			`<@${dev}> user: ${user} failed to search: ${query}, because: ${error}`,
			`user: ${user} failed to ${query} economy account, because: ${error}`,
			`<@${dev}> user: ${user} try command: ${command} and get some error: ${error}`
		],
		"undefined": ["undefined"]
	};
	const textResult = logger + message[type][msg];

	webhook.send(textResult);
}

module.exports = { logHandler };