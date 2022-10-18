import puppeteer from "puppeteer-extra"
import StealthPlugin from "puppeteer-extra-plugin-stealth"
import AdBlockerPlugin from "puppeteer-extra-plugin-adblocker"
import { platform } from "os"

export async function getNWNews(): Promise<NewWorldPost[]> {
    const browser = await puppeteer
        .use(StealthPlugin())
        .use(AdBlockerPlugin())
        .launch({
            headless: true,
            executablePath: platform() === "linux" ? "/usr/bin/chromium" : undefined
        })
    const page = await browser.newPage()
    await page.goto("https://www.newworld.com/en-us/news")
    const posts = await Promise.all(
        (
            await page.$$("#ags-NewsLandingPage-renderBlogList > div > div")
        ).map(async e => {
            return {
                link: `https://www.newworld.com${await e.$eval("a", e => e.getAttribute("href"))}`,
                tag: (await e.$eval("a > div:nth-child(2) > h4", e => e.textContent))!.replace(/\n/g, "").trim(),
                date: (await e.$eval("a > div:nth-child(2) > span", e => e.textContent))!.replace(/\n/g, "").trim(),
                img: `https:${await e.$eval("a > div > img", e => e.getAttribute("src"))}`,
                title: (await e.$eval("a > div:nth-child(2) > span:nth-child(3)", e => e.textContent))!.trim(),
                desc: (await e.$eval("a > div:nth-child(2) > div", e => e.textContent))!.replace(/\n/g, "").trim()
            }
        })
    )
    await browser.close()
    return posts
}

export async function getLastNWNew(): Promise<NewWorldPost> {
    return (await getNWNews())[0]
}

export interface NewWorldPost {
    link: string
    tag: string
    date: string
    img: string
    title: string
    desc: string
}
