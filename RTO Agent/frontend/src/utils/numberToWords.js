const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen",
];

const TENS = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
];

function threeDigitsToWords(num) {
  let words = "";

  if (num >= 100) {
    words += `${ONES[Math.floor(num / 100)]} Hundred `;
    num %= 100;
  }

  if (num >= 20) {
    words += `${TENS[Math.floor(num / 10)]} `;
    num %= 10;
  }

  if (num > 0) {
    words += `${ONES[num]} `;
  }

  return words.trim();
}

// Converts a rupee amount into words using the Indian numbering system
// (thousand / lakh / crore), e.g. 16000 -> "Sixteen Thousand".
export function amountToWords(amount) {
  const rupees = Math.round(Number(amount) || 0);

  if (rupees === 0) {
    return "Zero";
  }

  const crore = Math.floor(rupees / 10000000);
  const lakh = Math.floor((rupees % 10000000) / 100000);
  const thousand = Math.floor((rupees % 100000) / 1000);
  const hundred = rupees % 1000;

  const parts = [];

  if (crore > 0) {
    parts.push(`${threeDigitsToWords(crore)} Crore`);
  }

  if (lakh > 0) {
    parts.push(`${threeDigitsToWords(lakh)} Lakh`);
  }

  if (thousand > 0) {
    parts.push(`${threeDigitsToWords(thousand)} Thousand`);
  }

  if (hundred > 0) {
    parts.push(threeDigitsToWords(hundred));
  }

  return parts.join(" ").trim();
}
