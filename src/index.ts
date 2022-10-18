import { getLastNWNew, NewWorldPost } from "./sites/NewWorld"
import { writeFileSync, readFileSync } from "fs"
import { join } from "path"
import _ from "lodash"
import { Logger } from "./logger"
import { homedir } from "os"
import { CronJob } from "cron"
import { Telegraf } from "telegraf"
import { createDatabaseIfNotExists, newWorldLastNoticePath } from "./Files"
import { handleUser } from "./Telegram"

const adminIds = [931501011]
const logger = new Logger()
const bot = new Telegraf("5694390222:AAF4HCHRR4f8uc0wb0UKXYMn6W77mx2hyeU")

createDatabaseIfNotExists()
;(async () => {
    await bot.launch()
    bot.start(async ctx => await handleUser(ctx, logger))
    logger.info("Started...", "[Bot]")
    new CronJob(
        "* * * * *",
        async () => {
            try {
                logger.info("Getting for news...", "[Scraper]")
                const lastNew = await getLastNWNew()
                const cacheNew = JSON.parse(readFileSync(newWorldLastNoticePath, { encoding: "utf-8" })) as NewWorldPost
                const newNew = !_.isEqual(cacheNew, lastNew)
                if (newNew) {
                    writeFileSync(newWorldLastNoticePath, JSON.stringify(lastNew, null, 4))
                    logger.info("New notice found!", "[Scraper]")
                    logger.info(lastNew, "[Scraper]")
                    const users: TelegramUser[] = JSON.parse(readFileSync(join(homedir(), "TelegramBotDatabase/users.json"), { encoding: "utf-8" }))
                    for await (let user of users) {
                        await bot.telegram.sendMessage(user.id, "New notice found! " + lastNew.link)
                    }
                    return logger.info("Notification send to Telegram!", "[Scraper]")
                }
                logger.info("Notice not found...", "[Scraper]")
            } catch (error) {
                logger.error(`Error: ${error}`)
                for await (let admin of adminIds) {
                    await bot.telegram.sendMessage(admin, "Error!")
                    await bot.telegram.sendMessage(admin, String(error))
                }
                logger.info("Error notification send to Admins!", "[Bot]")
            } finally {
                bot.stop()
            }
        },
        null,
        true,
        "Europe/Madrid"
    )
})()

interface TelegramUser {
    id: number
    first_name: string
    username: string
    type: "private" | "public"
    photo: {
        small_file_id: string
        small_file_unique_id: string
        big_file_id: string
        big_file_unique_id: string
    }
}
