import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const router = new Router();

router.get("/", async (context) => {
  //Get Search params
  const params = context.request.url.searchParams;
  console.log(params);

  // Get the URL from the query string
  const url = params.get("url");
  if (!url) {
    context.response.body = "Provide a url\neg: ?url=https://example.com";
    return;
  }

  console.log(url);


  // Parse the URL using the URL object
  const parsedUrl = new URL(url);

  console.log(parsedUrl);

  // Extract the hostname from the URL
  const domain = `${parsedUrl.protocol}//${parsedUrl.hostname}`;


  console.log(domain);

  // Get the link preview information
  const linkPreview = await getLinkPreview(domain);
  console.log(linkPreview);

  // Set the response header to application/json
  context.response.headers.set("Content-Type", "application/json");

  context.response.headers.set("Access-Control-Allow-Origin", "*");


  // Return the link preview information as a JSON response
  context.response.body = linkPreview;
});

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.use(
  oakCors({
    origin: "*"
  }),
);

console.log("Listening on port 8000...");
await app.listen({ port: 8000 });

async function getLinkPreview(url: string) {
  // Fetch the HTML of the webpage
  const response = await fetch(url);
  const html = await response.text();

  // Parse the HTML using cheerio
  const $ = cheerio.load(html);
  const title = $("title").text();
  const description =
    $("meta[name=description]").attr("content") || "__blank__";
  const image =
    $("meta[property='og:image']").attr("content") ||
    "https://www.teahub.io/photos/full/239-2396598_wallpaper-single-magenta-solid-color-one-colour-plain.jpg";

  const favicon =
    $("link[rel='icon']").attr("href") ||
    "https://icons8.com/icon/NyuxPErq0tu2/globe-africa";

  // Return the link preview object
  return {
    title,
    description,
    image,
    favicon,
  };
}
