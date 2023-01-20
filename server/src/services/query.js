const DEFAULT_PAGE_NUMBER = 1;
const DEFAUlT_PAGE_LIMIT = 0;

function getPagination(query) {
  const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
  const limit = Math.abs(query.limit) || DEFAUlT_PAGE_LIMIT;
  const skip = (page - 1) * limit;

  return {
    skip,
    limit
  };
}

module.exports = {
  getPagination
}