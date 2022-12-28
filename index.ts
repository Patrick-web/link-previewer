import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";

const router = new Router();

router.get("/", async (context) => {
  //Get Search params
  const params = context.request.url.searchParams;

  // Get the URL from the query string
  const url = params.get("url") as string;

  // Get the link preview information
  const linkPreview = await getLinkPreview(url);
  console.log(linkPreview);

  // Set the response header to application/json
  context.response.headers.set("Content-Type", "application/json");

  // Return the link preview information as a JSON response
  context.response.body = linkPreview;
});

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Listening on port 8000...");
await app.listen({ port: 8000 });

async function getLinkPreview(url: string) {
  // Fetch the HTML of the webpage
  const response = await fetch(url);
  const html = await response.text();

  // Parse the HTML using cheerio
  const $ = cheerio.load(html);
  const title = $("title").text();
  const description = $("meta[name=description]").attr("content");
  const image = $("meta[property='og:image']").attr("content");

  // Return the link preview object
  return {
    title,
    description,
    image,
  };
}

(async () => {
  const linkPreview = await getLinkPreview("https://openai.com");
  console.log(linkPreview);
})();
