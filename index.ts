// import { cheerio } from "https://deno.land/x/cheerio@1.0.7/mod.ts";
import * as cheerio from "https://esm.sh/cheerio@1.0.0-rc.12";
console.log("Yeees");

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
