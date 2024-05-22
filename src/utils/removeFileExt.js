const removeFileExt = (file) => {
  return file.split(".").pop();
};

export default removeFileExt;
