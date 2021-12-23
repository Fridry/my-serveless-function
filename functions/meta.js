const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

exports.handler = async function(event, context) {
    try {
      const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

      const page = await browser.newPage();

      await page.goto('https://spacejelly.dev/', { timeout: 30000 });

      const title = await page.title();
      const description = await page.$eval('meta[name="description"]', element => element.content);

      await browser.close();

      return {
          statusCode: 200,
          body: JSON.stringify({
            status: 'Ok',
            page: {
              title,
              description
            }
          })
      };
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          status: 'Error',
          error
        })
    }
  }
}