import { writeFileSync, readFileSync } from "fs"
import { Context } from "telegraf"
import { Logger } from "./logger"
import { usersPath } from "./Files"

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

/**
 * Register user on click start bot
 * @param ctx Telegraf ctx
 * @returns true if user exists in database
 */
export async function handleUser(ctx: Context, logger: Logger) {
    const users = JSON.parse(readFileSync(usersPath, { encoding: "utf-8" })) as TelegramUser[]
    const userPressStart = (await ctx.getChat()) as TelegramUser
    const userExists: boolean = !!users.filter(user => user.id === userPressStart.id)[0]
    !userExists && writeFileSync(usersPath, JSON.stringify([...users, userPressStart], null, 4))
    !userExists && logger.info(`New user added to Database: Username: ${userPressStart.username} - Id: ${userPressStart.id}`, "[Bot]")
    return userExists
}
