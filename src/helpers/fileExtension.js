export const getFileExtension = filename => {
  return filename.split(".").pop();
};

export const removeExtension = filename => {
  return filename.split(".").shift();
};
