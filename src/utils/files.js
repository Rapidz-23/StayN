// Reads an uploaded file into { name, type, size, url } so it can be previewed.
// Demo only: the url is a data URL held in memory. The Firebase step uploads the file
// to Firebase Storage and saves the download URL here instead.
export const MAX_FILE_MB = 5;

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const DOC_TYPES = [...IMAGE_TYPES, "application/pdf"];

export function checkFile(file, { allowPdf = false } = {}) {
  const allowed = allowPdf ? DOC_TYPES : IMAGE_TYPES;
  if (!allowed.includes(file.type)) return `${file.name}: use a ${allowPdf ? "JPG, PNG, WEBP or PDF" : "JPG, PNG or WEBP"} file.`;
  if (file.size > MAX_FILE_MB * 1024 * 1024) return `${file.name}: the file is over ${MAX_FILE_MB} MB.`;
  return "";
}

export const readFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, type: file.type, size: file.size, url: reader.result });
    reader.onerror = () => reject(new Error(`Could not read ${file.name}.`));
    reader.readAsDataURL(file);
  });
