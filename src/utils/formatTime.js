function formatTime(ms) {
  if (!ms) return null;
  const padStr = (x, n) => x.toString().padStart(n, "0");

  const remainingMs = ms % 1000;
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);

  const formattedString = `${h > 0 ? padStr(h, 2) + ":" : ""}${
    m > 0 ? padStr(m, 2) + ":" : ""
  }${padStr(s, 2)}.${padStr(remainingMs, 3)}`;
  return formattedString;
}

export default formatTime;
