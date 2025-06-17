function getDataFromUnix(unixTime) {
  if (unixTime > 1e12) {
    unixTime = Math.floor(unixTime / 1000);
  }

  const date = new Date(unixTime * 1000);

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}

export { getDataFromUnix };
