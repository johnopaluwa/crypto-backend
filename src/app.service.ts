import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import * as puppeteer from 'puppeteer';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  private async configureBrowser() {
    const sequoiaUrl =
      'https://www.sequoiacap.com/our-companies/?_categories=crypto';

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(sequoiaUrl);

    return page;
  }

  async getCryptoNames() {
    const page = await this.configureBrowser();
    //const html = await page.evaluate(() => document.body.innerHTML);

    const handles = await page.$$('.company-listing-card__indicator');
    for (const handle of handles) {
      await handle.click();
    }

    await page.waitForSelector('.company__contacts');
    await page.waitForTimeout(3000);

    const html = await page.evaluate(() => document.body.innerHTML);

    const $ = cheerio.load(html);

    const cryptoNames = [];

    $('.company-listing__company').each(function () {
      const hmtlRef = $(this).html();
      const name = $('.company-listing-card__company-name', hmtlRef);
      const contactsHtml = $('.company__contacts', hmtlRef)?.html()?.trim();
      const linksHtml = $('.button', contactsHtml)?.attr().href;

      cryptoNames.push({ name: name.html().trim(), url: linksHtml });
    });

    console.warn(cryptoNames);

    return cryptoNames;
  }
}
