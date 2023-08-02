require('colors');

function logHandler(type = "undefined", msg = "0", user = "undefined", command = "undefined", query = "undefined", error = "undefined") {
	const str = new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' });
	const logger = `[${str.slice(0, 18)}] `.yellow;

	var message = {
		"client": [
			"[MONGODB]".green + " database connected!",
			`${user.green} is online now!`,
			`user: ${user.green} is trying to use command: ${command.cyan}`,
			`user: ${user.green} successfully used command: ${command.cyan}`,
			`user: ${user.green} successfully search: ${query.blue}, in command: ${command.cyan}`,
		],
		"distube": [
			`user: ${user.green} searching query: ${query.cyan}`,
			`user: ${user.green} now playing: ${query.cyan}`,
			`user: ${user.green} skip the song: ${query.cyan}`,
			`user: ${user.green}, now playing music, query: ${command.cyan}, source url: ${query.blue}`,
			`user: ${user.green} add song: ${query.cyan} to queue`,
			`user: ${user.green} add song: ${query.cyan} to playlist`,
			`user: ${user.green} pause the song: ${query.cyan}`,
			`user: ${user.green} resume the song: ${query.cyan}`,
			`user: ${user.green} has successfully set the volume to: ${query.cyan}%`
		],
		"economy": [
			`user: ${user.green} has been successfully ${query.cyan} economy account`,
		],
		"error": [
			`user: ${user.green} failed to use command: ${command.cyan}, because: ${error.red}`,
			`user: ${user.green} failed to search: ${query.cyan}, because: ${error.red}`,
			`user: ${user.green} failed to skip the music: ${query.cyan}, Error: ${error.red}`,
			`user: ${user.green} failed to creating account/using economy command, because: ${error.red}`,
			`user: ${user.green} failed to ${query.cyan} economy account, because: ${error.red}`
		],
		"undefined": ["undefined"],
	}

	console.log(logger + message[type][msg]);
};

module.exports = { logHandler };