import DOMPurify from "dompurify";

function sanitizeHTML(html) {
  if (typeof window !== "undefined") {
    return DOMPurify.sanitize(html);
  } else {
    return html;
  }
}


function htmlDecode(input){
  var e = document.createElement('textarea');
  e.innerHTML = input;
  // handle case of empty input
  var resDecod =  e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  const regex = /<\/?[^>]+(>|$)/g;
  const plainText = resDecod.replace(regex, ' ');
return plainText;
}

function slugifyText(str) {
  str  = str?.replaceAll('&amp;', "-").replaceAll("&quot;" , " ")
  str = str?.replace(/^\s+|\s+$/g, " "); // Trim leading/trailing white spaces
  str = str?.toLowerCase(); // Convert to lowercase
  str = str?.normalize("NFD").replace(/[\u0300-\u036f]/g, " "); // Remove diacritic marks
  // str = str?.replaceAll(/[^a-z0-9\-]/g, " ") // Replace non-alphanumeric characters with hyphens
  str = str?.replaceAll(/-+/g, " ") // Replace multiple consecutive hyphens with a single hyphen
    .replaceAll(/^-|-$/g, " ") // Remove leading/trailing hyphens
    .replaceAll(/\s+/g, ' ')
    .replaceAll("%20", ' ')
    .replaceAll("&", ' ')
    .replaceAll(' lt ',' ')
    .replaceAll(" ul ",' ').replaceAll(" gt",' ').replaceAll(" li " ,' ')



    

  return str;
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

export { sanitizeHTML, slugify ,slugifyText,htmlDecode };
