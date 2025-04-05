import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Container, Typography } from "@mui/material";
import {
  DynamicTable,
  TableFilters,
} from "@/components/Table";

// * URL search params
const parseSearchParams = (searchParams) => {
    return {
      page: searchParams.get("page") ? parseInt(searchParams.get("page"), 10) : 0,
      rowsPerPage: searchParams.get("rowsPerPage")
        ? parseInt(searchParams.get("rowsPerPage"), 10)
        : 10,
      sortKey: searchParams.get("sortKey") || "",
      sortDirection: searchParams.get("sortDirection") || "asc",
      search: searchParams.get("search") || "",
      activeTab: searchParams.get("activeTab") || "",
      // Handle date parsing
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

function DataTableContainer ({ 
    title, 
    columns, 
    fetchData, 
    filterConfig, 
    defaultSortConfig = { key: "", direction: "asc" }, 
    defaultRowsPerPage = 10, 
    defaultFilterValues = {},
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const parsedParams = parseSearchParams(searchParams);

  // * Table ki State
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // * State for pagination
  const [page, setPage] = useState(parsedParams.page);
  const [rowsPerPage, setRowsPerPage] = useState(
    parsedParams.rowsPerPage || defaultRowsPerPage
  );

  // * State for sorting up down
  const [sortConfig, setSortConfig] = useState({
    key: parsedParams.sortKey || defaultSortConfig.key,
    direction: parsedParams.sortDirection || defaultSortConfig.direction,
  });

  // * State for filters
  const [filterValues, setFilterValues] = useState({
    search: parsedParams.search || defaultFilterValues.search || "",
    activeTab:
      parsedParams.activeTab ||
      defaultFilterValues.activeTab ||
      filterConfig.tabOptions?.[0]?.value ||
      "",
    startDate: parsedParams.startDate || defaultFilterValues.startDate || null,
    endDate: parsedParams.endDate || defaultFilterValues.endDate || null,
    dropdown: parsedParams.dropdown || defaultFilterValues.dropdown || "",
    multiSelect:
      parsedParams.multiSelect || defaultFilterValues.multiSelect || [],
  });

  // Update URL with current state
  const updateUrl = () => {
    const params = new URLSearchParams();

    // Add pagination params
    params.set("page", page.toString());
    params.set("rowsPerPage", rowsPerPage.toString());

    // Add sorting params
    if (sortConfig.key) {
      params.set("sortKey", sortConfig.key);
      params.set("sortDirection", sortConfig.direction);
    }

    // Add filter params
    if (filterValues.search) params.set("search", filterValues.search);
    if (filterValues.activeTab) params.set("activeTab", filterValues.activeTab);
    if (filterValues.startDate)
      params.set("startDate", filterValues.startDate.toISOString());
    if (filterValues.endDate)
      params.set("endDate", filterValues.endDate.toISOString());
    if (filterValues.dropdown) params.set("dropdown", filterValues.dropdown);
    if (filterValues.multiSelect.length > 0)
      params.set("multiSelect", filterValues.multiSelect.join(","));

    // Update URL without refreshing the page
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilterValues((prev) => ({
      ...prev,
      [filterName]: value,
    }));

    // Reset to first page when filters change
    setPage(0);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  // Handle sort change
  const handleSortChange = (newSortConfig) => {
    setSortConfig(newSortConfig);
  };

  // Fetch data when params change
  useEffect(() => {
    const fetchDataFromApi = async () => {
      setLoading(true);
      try {
        // Prepare params for API call
        const params = {
          page,
          limit: rowsPerPage,
          sort: sortConfig.key,
          order: sortConfig.direction,
          search: filterValues.search,
          tab: filterValues.activeTab,
          startDate: filterValues.startDate?.toISOString(),
          endDate: filterValues.endDate?.toISOString(),
          dropdown: filterValues.dropdown,
          multiSelect: filterValues.multiSelect,
        };

        const result = await fetchData(params);
        setData(result.data);
        setTotalCount(result.totalCount);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchDataFromApi();
    updateUrl();
  }, [page, rowsPerPage, sortConfig, filterValues]);

  useEffect(() => {
    const fetchTableData = async () => {
      setLoading(true);
      const { data, totalCount } = await fetchData({
        page,
        limit: rowsPerPage,
        sort: sortConfig.key,
        order: sortConfig.direction,
        ...filterValues,
      });

      setData(data);
      setTotalCount(totalCount);
      setLoading(false);
    };

    fetchTableData();
    updateUrl();
  }, [page, rowsPerPage, sortConfig, filterValues]);


  return (
    <Suspense>
      <Container maxWidth="xl">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {title}
          </Typography>

          <TableFilters
            filterConfig={filterConfig}
            filterValues={filterValues}
            onFilterChange={handleFilterChange}
          />

          <DynamicTable
            columns={columns}
            data={data}
            loading={loading}
            pagination={{
              page,
              rowsPerPage,
              totalCount,
              onPageChange: handlePageChange,
              onRowsPerPageChange: handleRowsPerPageChange,
            }}
            sorting={{
              sortConfig,
              onSortChange: handleSortChange,
            }}
          />
        </Box>
      </Container>
    </Suspense>
  );
};

export default DataTableContainer;
