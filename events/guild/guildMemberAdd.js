const profileModel = require('../../models/ProfileSchema');

const Canvas = require('canvas');
const { MessageAttachment } = require('discord.js');
const path = require('path');
const { getChannelID } = require('../../commands/admin/setwelcome');

module.exports = async(client, Discord, member) => {
    const profile = await profileModel.findOne(
        {
            UserID: member.id,
            ServerID: member.guild.id,
        }
    )

    if(!profile)
    {
        let profile = await profileModel.create({
            UserID: member.id,
            ServerID: member.guild.id,
            coins: 1000,
            bank: 0,
            tier: 1,
            power: 100,
            hourly: 100,
            workers: 0,
            miners: 0,
            bots: 0,
            cooldowns: 0,
        });
        profile.save();
    }

    const { guild } = member

    const channelId = getChannelID(guild.id)
    if(!channelId) {
        reutrn
    }

    const channel = guild.channels.cache.get(channelId)
    if(!channel) {
        return
    }

    const canvas = Canvas.createCanvas(700, 250)
    const ctx = canvas.getContext('2d')

    const background = await Canvas.loadImage(
        path.join(__dirname, '../../background.png')
    )
    let x = 0
    let y = 0
    ctx.drawImage(background, x, y)

    const pfp = await Canvas.loadImage(
        member.user.displayAvatarURL({
            format: 'png',
        })
    )
    x = canvas.width / 2 - pfp.width / 2
    y = 25
    ctx.drawImage(pfp, x, y)

    ctx.fillStyle = '#ffffff'
    ctx.font = '35px sans-serif'
    let text = `Welcome ${member.user.tag}`
    x = canvas.width / 2 - ctx.measureText(text).width / 2
    ctx.fillText(text, x, 60 + pfp.height)

    ctx.font = '30px sans-serif'
    text = `Member #${guild.memberCount}`
    x = canvas.width / 2 - ctx.measureText(text).width / 2
    ctx.fillText(text, x, 100 + pfp.height)

    const attachment = new MessageAttachment(canvas.toBuffer())
    channel.send('', attachment)
}