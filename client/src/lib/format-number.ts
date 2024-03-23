function formatNumber(number: number): string {
  const isNegative = number < 0;
  number = Math.abs(number);

  if (number >= 1_000_000_000) {
    return (isNegative ? "-" : "") + `${Math.floor(number / 1_000_000_000)}m`;
  } else if (number >= 1_000_000) {
    return (isNegative ? "-" : "") + `${Math.floor(number / 1_000_000)}jt`;
  } else if (number >= 1_000) {
    const formattednumber = number / 1_000;
    if (Number.isInteger(formattednumber)) {
      return (isNegative ? "-" : "") + `${Math.floor(formattednumber)}k`;
    } else {
      return (isNegative ? "-" : "") + `${formattednumber.toFixed(1)}k`;
    }
  } else {
    return (isNegative ? "-" : "") + number.toString();
  }
}

export default formatNumber;
