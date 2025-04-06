function parseSearchParams(searchParams) {
  return {
    page: searchParams.get("page") ? parseInt(searchParams.get("page"), 10) : 0,
    rowsPerPage: searchParams.get("rowsPerPage")
      ? parseInt(searchParams.get("rowsPerPage"), 10)
      : 10,
    sortKey: searchParams.get("sortKey") || "",
    sortDirection: searchParams.get("sortDirection") || "asc",
    search: searchParams.get("search") || "",
    activeTab: searchParams.get("activeTab") || "all",

    // ! Handle date parsing
    startDate: searchParams.get("startDate")
      ? new Date(decodeURIComponent(searchParams.get("startDate")))
      : null,
    endDate: searchParams.get("endDate")
      ? new Date(decodeURIComponent(searchParams.get("endDate")))
      : null,

    dropdown: searchParams.get("dropdown") || "",
    multiSelect: searchParams.get("multiSelect")
      ? searchParams.get("multiSelect").split(",")
      : [],
  };
};

export default parseSearchParams;
