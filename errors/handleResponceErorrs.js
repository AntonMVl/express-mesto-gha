module.exports.returnErrorAsResponse = (
  error,
  res
) => {
  const { message, statusCode, details } = error
  res
    .status(statusCode)
    .send({ message, details })
}
