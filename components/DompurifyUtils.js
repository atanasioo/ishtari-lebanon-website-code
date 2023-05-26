import DOMPurify from "dompurify";

export function sanitizeHTML(html) {
  if (typeof window !== "undefined") {
    return DOMPurify.sanitize(html);
  }else{
    return html;
  }
}
