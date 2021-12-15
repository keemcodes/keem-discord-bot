const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('primary')
            .setLabel('Primary')
            .setStyle('PRIMARY')
            .setDisabled(false),
            );
            const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Some title')
			.setURL('https://discord.js.org')
			.setDescription('Some description here');            
        await interaction.reply({content: 'Pong!', embeds: [embed], components: [row],});
	},
};