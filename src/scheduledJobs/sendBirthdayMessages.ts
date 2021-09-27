import * as Discord from "discord.js"
import { getTodaysBirthdays } from "src/services/birthdayService"
const { mainChannelId } = require("../../discordToken.json")

export default function sendBirthdayMessages(
  discordClient: Discord.Client
): () => Promise<void> {
  return async () => {
    console.log("Checking for birthdays...")
    const todaysBirthdays = await getTodaysBirthdays()

    console.log(`Found ${todaysBirthdays.length} birthday(s) today.`)

    todaysBirthdays.forEach(birthday => {
      console.log("Sending birthday message for user " + birthday.userId)
      const channel = discordClient.channels.cache.get(mainChannelId)

      

      if (channel === undefined || !channel?.isText) {
        console.log(`Unable to connect to channel ID ${mainChannelId}, `
          + `birthday message not posted.`)
        return
      }

      const textChannel = channel as Discord.TextChannel
      const user = textChannel.guild.members.cache.get(birthday.userId)

      if (user === undefined) {
        console.log("Unable to find user with ID " + birthday.userId)
        return
      }

      const birthdayMessage = `Happy birthday <@${user.id}>! 🥳🎉🎊`
      textChannel.send(birthdayMessage)
    })
  }
}
