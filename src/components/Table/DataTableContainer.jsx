import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Container, Typography, Backdrop, CircularProgress } from "@mui/material";
import { DynamicTable, TableFilters, ActiveFilters } from "@/components/Table";
import parseSearchParams from "@/utils/parseSearchParams";

// * URL search params
function DataTableContainer({
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
      (filterConfig.tabOptions?.[0]?.value || ""),
    startDate: parsedParams.startDate || defaultFilterValues.startDate || null,
    endDate: parsedParams.endDate || defaultFilterValues.endDate || null,
    dropdown: parsedParams.dropdown || defaultFilterValues.dropdown || "",
    multiSelect:
      parsedParams.multiSelect || defaultFilterValues.multiSelect || [],
  });

  // ! Update URL with current state
  const updateUrl = () => {
    const params = new URLSearchParams();

    // ! Add pagination params
    params.set("page", page.toString());
    params.set("rowsPerPage", rowsPerPage.toString());

    // ! Add sorting params
    if (sortConfig.key) {
      params.set("sortKey", sortConfig.key);
      params.set("sortDirection", sortConfig.direction);
    }

    // ! Add filter params
    if (filterValues.search) params.set("search", filterValues.search);

    params.set("activeTab", filterValues.activeTab);

    const isValidDate = (d) => d instanceof Date && !isNaN(d.getTime());

    if (isValidDate(filterValues.startDate)) {
      params.set("startDate", filterValues.startDate.toISOString());
    }
    if (isValidDate(filterValues.endDate)) {
      params.set("endDate", filterValues.endDate.toISOString());
    }

    if (filterValues.dropdown) params.set("dropdown", filterValues.dropdown);
    if (filterValues.multiSelect.length > 0)
      params.set("multiSelect", filterValues.multiSelect.join(","));

    // ! Update URL without refreshing the page
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (filterName, value) => {
    setFilterValues((prev) => ({
      ...prev,
      [filterName]: value,
    }));

    setPage(0);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleSortChange = (newSortConfig) => {
    setSortConfig(newSortConfig);
  };

  useEffect(() => {
    const fetchDataFromApi = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: rowsPerPage,
          sort: sortConfig.key,
          order: sortConfig.direction,
          search: filterValues.search,
          activeTab: filterValues.activeTab,
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
  }, [page, rowsPerPage, sortConfig, filterValues, fetchData]);

  // Generate active filters array for display
  const getActiveFilters = () => {
    const filters = [];
    
    if (filterValues.search) {
      filters.push({
        id: 'search',
        type: 'search',
        value: filterValues.search,
        label: `Search: ${filterValues.search}`
      });
    }
    
    if (filterValues.activeTab && filterValues.activeTab !== (filterConfig.tabOptions?.[0]?.value || '')) {
      const tabLabel = filterConfig.tabOptions?.find(tab => tab.value === filterValues.activeTab)?.label;
      filters.push({
        id: 'tab',
        type: 'activeTab',
        value: filterValues.activeTab,
        label: `Tab: ${tabLabel || filterValues.activeTab}`
      });
    }
    
    if (filterValues.startDate) {
      filters.push({
        id: 'startDate',
        type: 'startDate',
        value: filterValues.startDate,
        label: `From: ${filterValues.startDate.toLocaleDateString()}`
      });
    }
    
    if (filterValues.endDate) {
      filters.push({
        id: 'endDate',
        type: 'endDate',
        value: filterValues.endDate,
        label: `To: ${filterValues.endDate.toLocaleDateString()}`
      });
    }
    
    if (filterValues.dropdown) {
      const dropdownLabel = filterConfig.dropdownOptions?.find(option => option.value === filterValues.dropdown)?.label;
      filters.push({
        id: 'dropdown',
        type: 'dropdown',
        value: filterValues.dropdown,
        label: `${filterConfig.dropdownLabel || 'Filter'}: ${dropdownLabel || filterValues.dropdown}`
      });
    }
    
    if (filterValues.multiSelect && filterValues.multiSelect.length > 0) {
      const selectedLabels = filterConfig.multiSelectOptions
        ?.filter(option => filterValues.multiSelect.includes(option.value))
        .map(option => option.label);
      
      filterValues.multiSelect.forEach((value, index) => {
        filters.push({
          id: `multiSelect-${value}`,
          type: 'multiSelect',
          value: value,
          label: `${filterConfig.multiSelectLabel || 'Selected'}: ${selectedLabels?.[index] || value}`
        });
      });
    }
    
    return filters;
  };

  // * Handles removing a filter
  const handleRemoveFilter = (filterType, filterValue) => {
    if (filterType === 'multiSelect') {

      setFilterValues(prev => ({
        ...prev,
        multiSelect: prev.multiSelect.filter(value => value !== filterValue)
      }));
    } else {

      const defaultValue = 
        filterType === 'activeTab' ? (filterConfig.tabOptions?.[0]?.value || '') :
        filterType === 'dropdown' ? '' :
        filterType === 'search' ? '' : 
        null;
      
      setFilterValues(prev => ({
        ...prev,
        [filterType]: defaultValue
      }));
    }
    
    setPage(0);
  };

  return (
    <Suspense>
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: 'column',
          gap: 2
        }}
        open={loading}
      >
        <CircularProgress color="inherit" />
        <Typography variant="h6" color="white">Loading data...</Typography>
      </Backdrop>
      
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
          
          <ActiveFilters 
            activeFilters={getActiveFilters()}
            onRemoveFilter={handleRemoveFilter}
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
}

export default DataTableContainer;
