import express from 'express';
import bodyParser from 'body-parser';
import puppeteer from 'puppeteer';

(async () => {

  const serverPort = 3000;
  const app = express();
  app.use(bodyParser.json());

  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});

  async function takeScreenshot(browser, options, url) {
    try {
      const page = await browser.newPage();
      await page.setViewport(options);
      await page.goto(url);
      return await page.screenshot();
    } catch (e) {
      if (page) {
        page.close();
      }
      throw e;
    }
  }

  app.post('/', async (req, res) => {
    try {
      const options = {
        width: req.body.width || 1024,
        height: req.body.height || 1301,
        isMobile: req.body.isMobile || false,
      };
      console.log('options ', {...options, url: req.body.url});

      const png = await Promise.race([
        takeScreenshot(browser, options, req.body.url),
        new Promise((resolve, reject) => setTimeout(reject, 15 * 1000, Error('timeout reached')))
      ]);

      res.set('Content-Type', 'image/png');
      res.end(png, 'binary');
    } catch (e) {
      res.status(500).send(e.message);
      console.log('error', e);
    }
  });

  const server = app.listen(serverPort);

// HTTP Keep-Alive to a short time to allow graceful shutdown
  server.on('connection', function (socket) {
    socket.setTimeout(20 * 1000);
  });

  const shutdown = async () => {
    console.log('graceful shutdown puppeteer');
    await browser.close();
    console.log('graceful shutdown express');
    server.close(function () {
      console.log('closed express');
      process.exit();
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  console.log('Running server: http://0.0.0.0:' + serverPort);
})();
