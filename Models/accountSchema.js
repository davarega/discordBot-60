const { model, Schema } = require('mongoose');

const accountSchema = new Schema({
	userId: String,
	coins: Number,
	dailyTimer: Number,
});

module.exports = model("account", accountSchema);