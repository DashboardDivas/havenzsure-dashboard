export function formatPhone(value: string): string {
  // Strip all non-numeric characters
  const numbers = value.replace(/\D/g, "");

  // Format as XXX-XXX-XXXX
  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 6) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  } else {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(
      6,
      10
    )}`;
  }
}
