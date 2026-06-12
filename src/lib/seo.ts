import { useEffect } from "react";
import seo from "../seo.config.json";

export const SITE_URL = seo.siteUrl.replace(/\/$/, "");
const DEFAULT_IMAGE = seo.defaultImage;

type SeoInput = {
  title: string;
  description: string;
  path?: string; // e.g. "/about"  (canonical = SITE_URL + path)
  image?: string; // absolute or site-relative
  noindex?: boolean;
};

/** Pre-defined meta for a static route, from seo.config.json. */
export function pageSeo(path: keyof typeof seo.pages) {
  const p = seo.pages[path];
  return { title: p.title, description: p.description, path: path as string };
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Helmet-free SEO. Renders nothing; just keeps <head> in sync with the
 * current page. Safe on React 18 & 19 (no UI impact).
 */
export function useSeo({ title, description, path = "", image, noindex }: SeoInput) {
  useEffect(() => {
    const url = SITE_URL + path;
    const img = image
      ? image.startsWith("http")
        ? image
        : SITE_URL + image
      : SITE_URL + DEFAULT_IMAGE;

    document.title = title;
    upsertMeta("name", "description", description);
    upsertLink("canonical", url);
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");

    // Open Graph
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", seo.siteName);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", img);

    // Twitter
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", img);
  }, [title, description, path, image, noindex]);
}
