const puppeteer = require("puppeteer-core");

async function getNetWorkDataFn(netWorkPath) {
  const browser = await puppeteer.launch({
    headless: true, //有浏览器界面启动
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", // 这是默认路径，根据实际情况修改
    slowMo: 500, //放慢浏览器执行速度，方便测试观察
  });
  const page = await browser.newPage();
  await page.goto(netWorkPath);
  const tbodySelector = ".topBg";
  const trSelector = `${tbodySelector} tr:first-child`;
  const tdSelector = `${trSelector} td`;

  const tdElements = await page.$$(tdSelector);

  const cellTexts = await Promise.all(
    tdElements.map(async (td) => {
      return await page.evaluate((el) => el.textContent.trim(), td);
    })
  );
  await browser.close();
  return cellTexts;
}

module.exports = getNetWorkDataFn;
