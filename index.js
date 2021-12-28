require("dotenv").config();

const compress = require("koa-compress");
const Koa = require("koa");
const logger = require("koa-logger");
const proxy = require("koa-proxy");

const app = new Koa();

async function main() {
  app.use(
    compress({
      threshold: 2048,
      gzip: {
        flush: require("zlib").constants.Z_SYNC_FLUSH,
      },
      deflate: {
        flush: require("zlib").constants.Z_SYNC_FLUSH,
      },
      br: false, // disable brotli
    })
  );

  app.use(logger());
  app.use(
    proxy({
      host: `https://firebasestorage.googleapis.com`,
      map: function (path) {
        if (path.split('/').filter(d => !d).length > 1) {
          path = '/' + encodeURIComponent(path.replace('/', ''))
        }
        
        const target = `/v0/b/${process.env.FIREBASE_BUCKET}/o/` + path + '?alt=media'
  
        return target;
      },
    })
  );
  app.listen(process.env.PORT || 3000);
  console.log("Listening on port: " + process.env.PORT);
}

try {
  if (!process.env.FIREBASE_BUCKET) {
    throw new Error("No bucket has been provided");
  }

  main();
} catch (error) {
  console.log(error);
}
