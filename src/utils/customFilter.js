export const customFilter = (array, param, inputValue) => {
  let filtered;

  if (param === "razon social") {
    param = "razonSocial";
  }
  filtered = array.filter((user) => {
    if (param === "nit") {
      return user[`${param}`]?.toString().includes(inputValue);
    }
    return user[`${param}`]?.toLowerCase().includes(inputValue.toLowerCase());
  });

  return filtered;
};
