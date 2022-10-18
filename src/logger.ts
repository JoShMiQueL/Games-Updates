import moment from "moment"
import { join } from "path"
import { appendFileSync, existsSync, mkdirSync, cpSync, writeFileSync, readdirSync, rmSync } from "fs"

export class Logger {
    private folderPath = join(__dirname, `../logs`)
    private filePath = join(this.folderPath, `latest.log`)
    constructor() {
        !existsSync(this.folderPath) && mkdirSync(this.folderPath)
        readdirSync(this.folderPath).length > 9 &&
            readdirSync(this.folderPath)
                .slice(0, readdirSync(this.folderPath).length - 9)
                .forEach(e => rmSync(join(this.folderPath, e)))
        if (existsSync(this.filePath)) {
            cpSync(this.filePath, join(this.folderPath, `${moment().utc(true).format("DD-MM-YY_HH-mm-ss")}.log`))
            writeFileSync(this.filePath, "")
        }
    }
    private date() {
        return moment().utc(true).format("DD/MM/YYYY - HH:mm:ss.SSS+z")
    }
    info(message?: any, prefix: string = "[Info]"): void {
        message = `[${this.date()}]${prefix} ${typeof message === "object" ? JSON.stringify(message, null, 4) : message}`
        appendFileSync(this.filePath, `${message}\n`)
        return console.log(message)
    }
    error(message?: any): void {
        return this.info(message, "[Error]")
    }
}
