const profileModel = require(`../../models/ProfileSchema`);

module.exports = {
    name: 'withdraw',
    aliases: ['wthd'],
    description: 'Deposite coins into your bank',
    catergory: 'economy',
    permissions: [],
    async execute(message, args, cmd, client, Discord, profileData){
        const amount = args[0]
        const money = profileData.coins

        if(amount % 1 != 0 || amount <= 0) return message.channel.send('Deposit amount must be a whole number');
        try {
            if(amount > profileData.bank) return message.channel.send("You do not have the funds to withdraw");
                await profileModel.findOneAndUpdate(
                    {
                        UserID: message.author.id,
                    },
                    {
                        $inc: {
                            coins: amount,
                            bank: -amount,
                        },
                    }
                );

            return message.channel.send(`${message.author.username} has withdrawn ${amount}`);
        } catch(err) {
            console.log(err)
        }
    },
};