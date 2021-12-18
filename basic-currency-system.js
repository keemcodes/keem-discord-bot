
const Sequelize = require('sequelize');
const { Client, Intents, MessageEmbed } = require('discord.js');

const { token, db } = require('./config.json');


const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
});

client.once('ready', () => {
	console.log('Ready!');
	Tags.sync();

});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'make-thread') {

		const channel = interaction.channel
		const message = await interaction.reply({ content: 'Make thread'});
		// message.react('👍🏿').then(() => message.react('👎🏿'));
		
		const thread = await channel.threads.create({
			name: 'food-talk',
			autoArchiveDuration: 60,
			reason: 'Needed a separate thread for food',
		});
		
	}
});


client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;
	const channel = interaction.channel

	if (commandName === 'make-embed') {

		const exampleEmbed = new MessageEmbed()
		.setColor('#0099ff')
		.setTitle('My Website')
		.setURL('https://keemcodes.com')
		.setAuthor('Akeem Anderson', 'https://keemcodes.com/images/logo.png', 'https://discord.js.org')
		.setDescription('My Portfolio Website')
		.setThumbnail('https://keemcodes.com/images/logo.png')
		.addFields(
			{ name: 'Home', value: 'Home Page' },
			{ name: '\u200B', value: '\u200B' },
			{ name: 'About', value: 'A little about me', inline: true },
			{ name: 'Projects', value: "Stuff I've worked on", inline: true },
		)
		.addField('Employment', "Places I've Worked", true)
		.setImage('https://keemcodes.com/images/portfolio-site-image.png')
		.setTimestamp()
		.setFooter('keemcodes.com', 'https://keemcodes.com/images/logo.png');
	
		interaction.reply({ embeds: [exampleEmbed] });
		
	}
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;
	const channel = interaction.channel

	if (commandName === 'getstring') {

		const string = interaction.options.getString('input')
		const message = await interaction.reply({ content: `get string ${string}`});

		
	}
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'addtag') {
		const tagName = interaction.options.getString('name');
		const tagDescription = interaction.options.getString('description');
		
		try {
			// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
			const tag = await Tags.create({
				name: tagName,
				description: tagDescription,
				username: interaction.user.username,
			});
		
			return interaction.reply(`Tag ${tag.name} added.`);
		}
		catch (error) {
			if (error.name === 'SequelizeUniqueConstraintError') {
				return interaction.reply('That tag already exists.');
			}
		
			return interaction.reply('Something went wrong with adding a tag.');
		}
	} else if (commandName === 'tag') {	
		const tagName = interaction.options.getString('name');

		// equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
		const tag = await Tags.findOne({ where: { name: tagName } });
		
		if (tag) {
			// equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
			tag.increment('usage_count');
		
			return interaction.reply(tag.get('description'));
		}
		
		return interaction.reply(`Could not find tag: ${tagName}`);
	} else if (commandName === 'edittag') {
		const tagName = interaction.options.getString('name');
		const tagDescription = interaction.options.getString('description');
		
		// equivalent to: UPDATE tags (description) values (?) WHERE name='?';
		const affectedRows = await Tags.update({ description: tagDescription }, { where: { name: tagName } });
		
		if (affectedRows > 0) {
			return interaction.reply(`Tag ${tagName} was edited.`);
		}
		
		return interaction.reply(`Could not find a tag with name ${tagName}.`);
	} else if (commandName === 'taginfo') {
		const tagName = interaction.options.getString('name');

		// equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
		const tag = await Tags.findOne({ where: { name: tagName } });
		
		if (tag) {
			return interaction.reply(`${tagName} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times.`);
		}
		
		return interaction.reply(`Could not find tag: ${tagName}`);
	} else if (commandName === 'showtags') {
		// equivalent to: SELECT name FROM tags;
		const tagList = await Tags.findAll({ attributes: ['name'] });
		const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';

		return interaction.reply(`List of tags: ${tagString}`);
	} else if (commandName === 'removetag') {
		const tagName = interaction.options.getString('name');
		// equivalent to: DELETE from tags WHERE name = ?;
		const rowCount = await Tags.destroy({ where: { name: tagName } });
		
		if (!rowCount) return interaction.reply('That tag did not exist.');
		
		return interaction.reply('Tag deleted.');
	}
});

const sequelize = new Sequelize(db.table, db.user, db.pass, {
	host: db.host,
	dialect: db.dialect,
});

const Tags = sequelize.define('tags', {
	name: {
		type: Sequelize.STRING,
		unique: true,
	},
	description: Sequelize.TEXT,
	username: Sequelize.STRING,
	usage_count: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});



client.login(token);
