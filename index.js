const puppeteer = require("puppeteer");
const email = "your email address"; // ändere deine Email hier
const password = "Your password"; // ändere dein Passwort hier

(async () => {
    let gpu = "rtx+3080+ti"
    const browser = await puppeteer.launch({headless: false, devtools: true});
    let page = await browser.newPage();
    await page.setViewport({
        width: 1600,
        height: 900
    })

    let there = false

    await page.goto(`https://www.alternate.de/listing.xhtml?q=${gpu}`)
    await page.waitForTimeout(2000)
    await page.click(".cookie-submit")
    await page.waitForSelector(".card.align-content-center.productBox.boxCounter.text-black", { timeout: 2500})
    const _isThere = await page.$eval('.card.align-content-center.productBox.boxCounter.text-black', ele => ele.innerHTML.toLowerCase().includes("3080 ti"))

    _isThere ? there = true : there = false;

    var rate = !_isThere ? setInterval(async() => {
        await page.reload(`https://www.alternate.de/listing.xhtml?q=${gpu}`)
        await page.waitForSelector(".card.align-content-center.productBox.boxCounter.text-black", { timeout: 2500})
        const isThere = await page.$eval('.card.align-content-center.productBox.boxCounter.text-black', ele => ele.innerHTML.toLowerCase().includes("3080 ti"))

        if (isThere) {
            there = true;

            clearInterval(rate) 
        }
    }, 5000) : undefined;

    var checkThere = setInterval(() => {
        if (there) {
            buyProduct()
            clearInterval(checkThere)
        }
    }, 500)
    
    async function buyProduct() {
        await page.waitForSelector(".productBox", { timeout: 2000 })
        await page.click('.productBox', {delay: 2000})
        await page.waitForSelector(`.add-to-cart.details-cart-button.btn.btn-primary.btn-block.btn-lg.d-flex.justify-content-center.tp-button`, { timeout: 3500})
        await page.click(`.add-to-cart.details-cart-button.btn.btn-primary.btn-block.btn-lg.d-flex.justify-content-center.tp-button`, { delay: 2000})
        await page.waitForTimeout(2500)
        
        await page.goto("https://www.alternate.de/cart.xhtml?t=&q=")
        await page.waitForTimeout(1500)
        await page.waitForSelector('[value="Zur Kasse"]')
        await page.click('[value="Zur Kasse"]')
        await page.waitForTimeout(1000)
        await page.type('[inputmode="email"]', email, {delay: 100})
        await page.type('[type="password"]', password, { delay: 100})
        await page.click("#loginbutton")

        await page.waitForTimeout(5500)
        await page.click('[type="submit"]')
        await page.waitForTimeout(2000)
        await page.click('[type="submit"]')
        await page.waitForTimeout(2000)
        await page.click("#payments-form > div > div:nth-child(1) > div > div")
        await page.waitForTimeout(2500)
        await page.click('[title="Weiter"]')
        await page.waitForTimeout(2500)
        await page.click('[value="Kauf abschließen"]')
    }
})();