export const removeEmptyFields = (obj: any) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => !!v)
  );
};

export const undefinedEmptyFields = (obj: any) => {
  const result = { ...obj };
  Object.entries(obj).forEach(([key, v]) => {
    if (v === "") {
      result[key] = undefined;
    }
  });
  return result;
};