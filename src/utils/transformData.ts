export function transformData(data?: string) {
  if (!data) return undefined;
  const valueArray = data.split(".");
  const key = valueArray[0];
  const value = valueArray[1];
  return { column: key, value };
}
