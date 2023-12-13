import chalk from "chalk";

export function getColorFromString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (let i = 0; i < 6; i++) {
    const value = (hash >> (i * 4)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }

  return color;
}

export function colorized(str: string) {
  const color = getColorFromString(str);
  return chalk.hex(color)(str);
}