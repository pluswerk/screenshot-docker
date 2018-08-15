FROM pluswerk/puppeteer

WORKDIR /app

RUN yarn add express body-parser puppeteer

COPY index.mjs /app/

CMD ["node", "--experimental-modules", "index.mjs"]

EXPOSE 3000
