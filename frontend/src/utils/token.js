export const getToken = () => {
  const auth = JSON.parse(localStorage.getItem("auth"));
  return auth?.token;
};
