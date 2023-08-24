export const createError = (message: string) => {
  const err = new Error();

  err.message = message;
  return err;
};
