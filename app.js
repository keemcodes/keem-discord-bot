const { Op } = require('sequelize');
const { Collection, Client, Formatters, Intents } = require('discord.js');
const { Users, CurrencyShop } = require('./dbObjects.js');
const { token } = require('./config.json')

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const currency = new Collection();

// [alpha]
Reflect.defineProperty(currency, 'add', {
	/* eslint-disable-next-line func-name-matching */
	value: async function add(id, amount) {
		const user = currency.get(id);

		if (user) {
			user.balance += Number(amount);
			return user.save();
		}

		const newUser = await Users.create({ user_id: id, balance: amount });
		currency.set(id, newUser);

		return newUser;
	},
});

Reflect.defineProperty(currency, 'getBalance', {
	/* eslint-disable-next-line func-name-matching */
	value: function getBalance(id) {
		const user = currency.get(id);
		return user ? user.balance : 0;
	},
});

client.once('ready', async () => {
    // [beta]
    const storedBalances = await Users.findAll();
    storedBalances.forEach(b => currency.set(b.user_id, b));
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
	if (message.author.bot) return;
	currency.add(message.author.id, 1);
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'balance') {
        // [gamma]
        const target = interaction.options.getUser('user') ?? interaction.user;

        return interaction.reply(`${target.tag} has ${currency.getBalance(target.id)}💰`);
	} else if (commandName === 'inventory') {
		// [delta]
        const target = interaction.options.getUser('user') ?? interaction.user;
        const user = await Users.findOne({ where: { user_id: target.id } });
        const items = await user.getItems();
        
        if (!items.length) return interaction.reply(`${target.tag} has nothing!`);
        
        return interaction.reply(`${target.tag} currently has ${items.map(i => `${i.amount} ${i.item.name}`).join(', ')}`);        
	} else if (commandName === 'transfer') {
		// [epsilon]
        const currentAmount = currency.getBalance(interaction.user.id);
        const transferAmount = interaction.options.getInteger('amount');
        const transferTarget = interaction.options.getUser('user');
        
        if (transferAmount > currentAmount) return interaction.reply(`Sorry ${interaction.user}, you only have ${currentAmount}.`);
        if (transferAmount <= 0) return interaction.reply(`Please enter an amount greater than zero, ${interaction.user}.`);
        
        currency.add(interaction.user.id, -transferAmount);
        currency.add(transferTarget.id, transferAmount);
        
        return interaction.reply(`Successfully transferred ${transferAmount}💰 to ${transferTarget.tag}. Your current balance is ${currency.getBalance(interaction.user.id)}💰`);        
	} else if (commandName === 'buy') {
		// [zeta]
        const itemName = interaction.options.getString('item');
        const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: itemName } } });
        
        if (!item) return interaction.reply(`That item doesn't exist.`);
        if (item.cost > currency.getBalance(interaction.user.id)) {
            return interaction.reply(`You currently have ${currency.getBalance(interaction.user.id)}, but the ${item.name} costs ${item.cost}!`);
        }
        
        const user = await Users.findOne({ where: { user_id: interaction.user.id } });
        currency.add(interaction.user.id, -item.cost);
        await user.addItem(item);
        
        return interaction.reply(`You've bought: ${item.name}.`);        
	} else if (commandName === 'shop') {
		// [theta]
        const items = await CurrencyShop.findAll();
        return interaction.reply(Formatters.codeBlock(items.map(i => `${i.name}: ${i.cost}💰`).join('\n')));        
	} else if (commandName === 'leaderboard') {
		// [lambda]
        return interaction.reply(
            Formatters.codeBlock(
                currency.sort((a, b) => b.balance - a.balance)
                    .filter(user => client.users.cache.has(user.user_id))
                    .first(10)
                    .map((user, position) => `(${position + 1}) ${(client.users.cache.get(user.user_id).tag)}: ${user.balance}💰`)
                    .join('\n'),
            ),
        );        
	}
});

client.login(token);