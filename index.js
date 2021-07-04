const puppeteer = require("puppeteer");
const email = "your email address"; // change email here
const password = "Your password"; // change password here

(async () => {
    // search product
    let gpu = "rtx+3080+ti" // change product here
    const browser = await puppeteer.launch({headless: false, devtools: true});
    let page = await browser.newPage();
    await page.setViewport({
        width: 1600,
        height: 900
    })

    let there = false

    // visit alternate page
    await page.goto(`https://www.alternate.de/listing.xhtml?q=${gpu}`)
    await page.waitForTimeout(2000)
    // confirm cookies
    await page.click(".cookie-submit")
    await page.waitForSelector(".card.align-content-center.productBox.boxCounter.text-black", { timeout: 2500})
    // check if product is there
    const _isThere = await page.$eval('.card.align-content-center.productBox.boxCounter.text-black', ele => ele.innerHTML.toLowerCase().includes("3080 ti"))

    // if product is there, change local variable to true, else false
    _isThere ? there = true : there = false;

    // interval rate
    // if it is still not there, refresh the page and look for
    // product
    var rate = !_isThere ? setInterval(async() => {
        await page.reload(`https://www.alternate.de/listing.xhtml?q=${gpu}`)
        await page.waitForSelector(".card.align-content-center.productBox.boxCounter.text-black", { timeout: 2500})
        const isThere = await page.$eval('.card.align-content-center.productBox.boxCounter.text-black', ele => ele.innerHTML.toLowerCase().includes("3080 ti"))

        // if the product is there, 
        // clear the interval
        if (isThere) {
            there = true;

            clearInterval(rate) 
        }
    }, 5000) : undefined;

    var checkThere = setInterval(() => {
        // start the purchase process
        // and stops the interval
        if (there) {
            buyProduct()
            clearInterval(checkThere)
        }
    }, 500)
    
    /**
     * buys Product
     * does certain clicks on websites and log in with the provided credentials
     */
    async function buyProduct() {
        // clicks on first product
        await page.waitForSelector(".productBox", { timeout: 2000 })
        await page.click('.productBox', {delay: 2000})
        // add to cart
        await page.waitForSelector(`.add-to-cart.details-cart-button.btn.btn-primary.btn-block.btn-lg.d-flex.justify-content-center.tp-button`, { timeout: 3500})
        await page.click(`.add-to-cart.details-cart-button.btn.btn-primary.btn-block.btn-lg.d-flex.justify-content-center.tp-button`, { delay: 2000})
        await page.waitForTimeout(2500)
        
        // go to shopping cart
        await page.goto("https://www.alternate.de/cart.xhtml?t=&q=")
        await page.waitForTimeout(1500)
        await page.waitForSelector('[value="Zur Kasse"]')
        await page.click('[value="Zur Kasse"]')
        await page.waitForTimeout(1000)
        // type in email and password
        await page.type('[inputmode="email"]', email, {delay: 100})
        await page.type('[type="password"]', password, { delay: 100})
        // login
        await page.click("#loginbutton")

        // go further
        await page.waitForTimeout(5500)
        await page.click('[type="submit"]')
        await page.waitForTimeout(2000)
        // go further
        await page.click('[type="submit"]')
        await page.waitForTimeout(2000)
        // choose payment option: pay via bank account transaction
        await page.click("#payments-form > div > div:nth-child(1) > div > div")
        await page.waitForTimeout(2500)
        // go further
        await page.click('[title="Weiter"]')
        await page.waitForTimeout(2500)
        // submit payment
        await page.click('[value="Kauf abschließen"]')
    }
})();