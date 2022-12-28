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


  const linkPreview = await getLinkPreview(url);
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
    $("meta[name=description]").attr("content") || "";

  let image = $("meta[property='og:image']").attr("content") || "https://www.teahub.io/photos/full/239-2396598_wallpaper-single-magenta-solid-color-one-colour-plain.jpg";

  const favicon =
    $("link[rel='icon']").attr("href") || ""
  // Return the link preview object
  return {
    title,
    description,
    image,
    favicon,
  };
}

// function isYoutubeURL(url) {
//   let regex = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
//   return regex.test(url)
// }

// function YouTubeGetID(url) {
//   url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
//   return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
// }
