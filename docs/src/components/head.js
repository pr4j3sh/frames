import { SITE } from "../lib/consts";

const siteTitle = SITE.TITLE;
const siteDescription = SITE.DESCRIPTION;
const siteUrl = SITE.URL;
const imageUrl = `${siteUrl}favicon.png`;
const bannerUrl = `${siteUrl}banner.png`;

const metaTags = [
  { name: "charset", content: "UTF-8" },
  { rel: "icon", type: "image/svg+xml", href: imageUrl },
  { name: "viewport", content: "width=device-width, initial-scale=1.0" },
  { name: "title", content: siteTitle },
  { name: "description", content: siteDescription },
  { property: "og:type", content: "website" },
  { property: "og:url", content: siteUrl },
  { property: "og:title", content: siteTitle },
  { property: "og:description", content: siteDescription },
  { property: "og:image", content: bannerUrl },
  { property: "twitter:card", content: "summary_large_image" },
  { property: "twitter:url", content: siteUrl },
  { property: "twitter:title", content: siteTitle },
  { property: "twitter:description", content: siteDescription },
  { property: "twitter:image", content: bannerUrl },
];

const titleTag = document.createElement("title");
titleTag.textContent = siteTitle;
document.head.appendChild(titleTag);

metaTags.forEach((tag) => {
  const element = document.createElement(
    tag.name ? "meta" : tag.rel ? "link" : "meta",
  );

  Object.keys(tag).forEach((key) => {
    element.setAttribute(key, tag[key]);
  });

  document.head.appendChild(element);
});
