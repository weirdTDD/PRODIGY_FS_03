export const splitOptions = (value?: string) => {
  if (!value) return [];
  return value
    .split(/[,/|]/)
    .map((option) => option.trim())
    .filter(Boolean);
};

export const getDefaultOption = (value?: string) => {
  return splitOptions(value)[0] ?? "";
};
