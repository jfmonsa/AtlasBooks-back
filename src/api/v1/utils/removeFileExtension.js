const removeExtension = filename => {
  return filename.split(".").shift();
};

export default removeExtension;
