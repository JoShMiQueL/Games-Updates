import { existsSync, mkdirSync, writeFileSync } from "fs"
import { join } from "path"
import { homedir } from "os"

const folderPath = join(homedir(), "TelegramBotDatabase")
export const usersPath = join(folderPath, "users.json")
export const newWorldLastNoticePath = join(folderPath, "new_world_last_notice.json")

/**
 * Create database folder and files if this not exists
 */
export function createDatabaseIfNotExists() {
    !existsSync(folderPath) && mkdirSync(folderPath)
    !existsSync(usersPath) && writeFileSync(usersPath, JSON.stringify([], null, 4))
    !existsSync(newWorldLastNoticePath) && writeFileSync(newWorldLastNoticePath, JSON.stringify({}, null, 4))
}
