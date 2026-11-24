export const getCart = () => {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
};
export const setCart = (c) => {
  try {
    localStorage.setItem("cart", JSON.stringify(c));
  } catch {}
  window.dispatchEvent(new Event("cart"));
};
