import DOMPurify from "dompurify";

function sanitizeHTML(html) {
  if (typeof window !== "undefined") {
    return DOMPurify.sanitize(html);
  } else {
    return html;
  }
}

function slugify(str) {
  str  = str.replaceAll('&amp;', "-").replaceAll("&quot;" , "")
  str = str.replace(/^\s+|\s+$/g, ""); // Trim leading/trailing white spaces
  str = str?.toLowerCase(); // Convert to lowercase
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove diacritic marks
  str = str
    .replaceAll(/[^a-z0-9\-]/g, "-") // Replace non-alphanumeric characters with hyphens
    .replaceAll(/-+/g, "-") // Replace multiple consecutive hyphens with a single hyphen
    .replaceAll(/^-|-$/g, "") // Remove leading/trailing hyphens
    .replaceAll(/\s+/g, '-')
    .replaceAll("%20", '-')
    .replaceAll("&", '-')

  return str;
}

export { sanitizeHTML, slugify };
