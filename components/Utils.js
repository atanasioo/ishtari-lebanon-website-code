import DOMPurify from "dompurify";

function sanitizeHTML(html) {
  if (typeof window !== "undefined") {
    return DOMPurify.sanitize(html);
  } else {
    return html;
  }
}

function slugify(str) {
  str = str.replace(/^\s+|\s+$/g, ""); // Trim leading/trailing white spaces
  str = str.toLowerCase(); // Convert to lowercase
  str = str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove diacritic marks
  str = str
    .replace(/[^a-z0-9\-]/g, "-") // Replace non-alphanumeric characters with hyphens
    .replace(/-+/g, "-") // Replace multiple consecutive hyphens with a single hyphen
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens

  return str;
}

export { sanitizeHTML, slugify };
