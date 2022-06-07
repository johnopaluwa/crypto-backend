import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as cheerio from 'cheerio';
import { Model } from 'mongoose';
import * as puppeteer from 'puppeteer';
import { CryptoData, CryptoDocument } from './crypto-schema';

@Injectable()
export class CryptoService {
  constructor(
    @InjectModel(CryptoData.name) private cryptoModel: Model<CryptoDocument>,
  ) {}

  public async getData() {
    return this.cryptoModel.find();
  }

  @Cron(CronExpression.EVERY_12_HOURS)
  async handleCron() {
    const sequoiaNames = await this.getCryptoNamesSequoia();
    const a16 = await this.getCryptoNamesA16();
    const paradigm = await this.getCryptoNamesParadigm();

    this.cryptoModel.bulkWrite([
      {
        updateOne: {
          filter: { name: 'sequoia' },
          update: {
            name: 'sequoia',
            value: sequoiaNames,
          },
          upsert: true,
        },
      },
      {
        updateOne: {
          filter: { name: 'a16' },
          update: {
            name: 'a16',
            value: a16,
          },
          upsert: true,
        },
      },
      {
        updateOne: {
          filter: { name: 'paradigm' },
          update: {
            name: 'paradigm',
            value: paradigm,
          },
          upsert: true,
        },
      },
    ]);

    // this.cryptoModel.updateMany(
    //   {},
    //   [
    //     {
    //       name: 'sequoia',
    //       value: sequoiaNames,
    //     },
    //     {
    //       name: 'a16',
    //       value: a16,
    //     },
    //     {
    //       name: 'paradigm',
    //       value: paradigm,
    //     },
    //   ],
    //   {
    //     upsert: true,
    //   },
    // );

    // const createdCrypto = new this.cryptoModel({
    //   name: 'sequoia',
    //   value: sequoiaNames,
    // });
    // return createdCrypto.save();
  }

  ////////////////////////////////////////////////////////////////////////

  private async configureBrowser(url: string) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    return page;
  }

  private async getCryptoNamesSequoia() {
    const page = await this.configureBrowser(
      'https://www.sequoiacap.com/our-companies/?_categories=crypto',
    );
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

    return cryptoNames;
  }

  private async getCryptoNamesA16() {
    const page = await this.configureBrowser('https://a16zcrypto.com/');
    const html = await page.evaluate(() => document.body.innerHTML);

    const $ = cheerio.load(html);

    const cryptoNames = [];

    const portfolioHtml = $('.portfolio-list', html).html();
    await page.waitForTimeout(1000);

    $('li', portfolioHtml).each(function () {
      const listHtml = $(this).html();

      const aTagHtml = $('a', listHtml);

      const name = aTagHtml?.text();
      const linkUrl = aTagHtml?.attr()?.href;

      cryptoNames.push({ name: name, url: linkUrl });
    });

    return cryptoNames;
  }

  private async getCryptoNamesParadigm() {
    const page = await this.configureBrowser(
      'https://www.paradigm.xyz/portfolio',
    );
    const html = await page.evaluate(() => document.body.innerHTML);

    const $ = cheerio.load(html);

    const cryptoNames = [];

    const portfolioHtml = $('.Card_card__container__6lmiW', html).html();
    await page.waitForTimeout(1000);

    $('.Card_card__item__dQSDo', portfolioHtml).each(function () {
      const listHtml = $(this).html();

      const aTagHtml = $('a', listHtml);

      const name = aTagHtml?.text();
      const linkUrl = aTagHtml?.attr()?.href;

      cryptoNames.push({
        name: name,
        url: 'https://www.paradigm.xyz' + linkUrl,
      });
    });

    return cryptoNames;
  }
}
