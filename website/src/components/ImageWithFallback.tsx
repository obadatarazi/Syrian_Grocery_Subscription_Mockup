import React, { useState } from "react";

function fallbackSvg(label: string) {
  const safe = (label || "حصري")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  const words = safe.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length > 18 && line) {
      lines.push(line);
      line = w;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  const shown = lines.slice(0, 4);
  const startY = 52 - ((shown.length - 1) * 8) / 2;
  const textEls = shown
    .map(
      (l, i) =>
        `<text x="44" y="${startY + i * 10}" text-anchor="middle" font-family="Cairo,Tahoma,sans-serif" font-size="7" font-weight="700" fill="#063e38">${l}</text>`,
    )
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="88" height="88" viewBox="0 0 88 88"><rect width="88" height="88" fill="#e8f5f3"/><rect x="6" y="6" width="76" height="76" rx="8" fill="none" stroke="#0b7a6e" stroke-opacity=".2" stroke-width="1.5"/>${textEls}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false);
  const { src, alt, style, className, ...rest } = props;

  if (didError || !src) {
    return (
      <img
        src={fallbackSvg(typeof alt === "string" ? alt : "حصري")}
        alt={alt ?? "حصري"}
        className={className}
        style={style}
        {...rest}
        data-original-url={src}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      {...rest}
      onError={() => setDidError(true)}
    />
  );
}
