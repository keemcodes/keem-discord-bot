const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('button')
		.setDescription('Creates a Test Buutton!'),
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
			.setTitle('Keem Made This Title')
			.setURL('https://discord.js.org')
			.setDescription('Some description here');            
        await interaction.reply({content: 'Test Button!', embeds: [embed], components: [row],});
	},
};