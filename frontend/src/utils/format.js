export function formatDateTime(value) {
  if (!value) {
    return "";
  }
  return new Intl.DateTimeFormat("uz-UZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function formatDate(value) {
  if (!value) {
    return "";
  }
  return new Intl.DateTimeFormat("uz-UZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(value));
}

export function formatUzPhoneNumber(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) {
    return "";
  }

  const countryCode = "998";
  if (countryCode.startsWith(digits) && digits.length < countryCode.length) {
    return `+${digits}`;
  }

  let localDigits = digits.startsWith(countryCode) ? digits.slice(countryCode.length) : digits;
  if (localDigits.startsWith("0") && localDigits.length > 9) {
    localDigits = localDigits.slice(1);
  }

  const local = localDigits.slice(0, 9);
  const groups = [`+${countryCode}`];
  const operatorCode = local.slice(0, 2);
  const firstBlock = local.slice(2, 5);
  const secondBlock = local.slice(5, 7);
  const thirdBlock = local.slice(7, 9);

  if (operatorCode) groups.push(operatorCode);
  if (firstBlock) groups.push(firstBlock);
  if (secondBlock) groups.push(secondBlock);
  if (thirdBlock) groups.push(thirdBlock);

  return groups.join(" ");
}
