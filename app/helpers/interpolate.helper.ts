/**
 * Replaces {{key}} tokens in a translation string with the provided values.
 */
export const interpolate = (
  template: string,
  values: Record<string, string | number>,
): string =>
  Object.entries(values).reduce(
    (str, [key, val]) =>
      str.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), String(val)),
    template,
  );