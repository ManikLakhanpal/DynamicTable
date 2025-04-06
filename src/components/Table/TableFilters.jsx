import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

function TableFilters({ filterConfig, filterValues, onFilterChange }) {
  const [searchInput, setSearchInput] = useState(filterValues.search || "");

  useEffect(() => {
    setSearchInput(filterValues.search || "");
  }, [filterValues.search]);

  // * Handle search input change
  const handleSearchChange = (event) => {
    onFilterChange("search", event.target.value);
  };

  // * Handle tab change
  const handleTabChange = (_event, newValue) => {
    onFilterChange("activeTab", newValue);
  };

  // * Handel date changes here below
  const handleStartDateChange = (date) => {
    onFilterChange("startDate", date);
  };

  const handleEndDateChange = (date) => {
    onFilterChange("endDate", date);
  };

  // * Handle dropdown change
  const handleDropdownChange = (event) => {
    onFilterChange("dropdown", event.target.value);
  };

  // * Handle multi-select change
  const handleMultiSelectChange = (event) => {
    const value = event.target.value;
    onFilterChange(
      "multiSelect",
      typeof value === "string" ? value.split(",") : value
    );
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput !== filterValues.search) {
        onFilterChange("search", searchInput);
      }
    }, 619); // ! 0.619 seconds
  
    return () => {
      clearTimeout(handler); 
    };
  }, [searchInput]);
  
  

  return (
    <Box sx={{ mb: 3 }}>
      <Stack spacing={2}>
        
        {/* Tabs Filter */}
        {filterConfig.tabsEnabled && filterConfig.tabOptions && (
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={filterValues.activeTab}
              onChange={handleTabChange}
              aria-label="filter tabs"
            >
              {filterConfig.tabOptions.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </Tabs>
          </Box>
        )}

        <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
          
          {/* Search Filter */}
          {filterConfig.searchEnabled && (
            <TextField
            label={filterConfig.searchPlaceholder || "Search"}
            variant="outlined"
            size="small"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            sx={{ minWidth: 200, mb: 1 }}
          />          
          )}

          {/* Date Range Filter */}
          {filterConfig.dateRangeEnabled && (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Stack direction="row" spacing={1}>
                <DatePicker
                  label="Start Date"
                  value={filterValues.startDate}
                  onChange={handleStartDateChange}
                  slotProps={{ textField: { size: "small" } }}
                />
                <DatePicker
                  label="End Date"
                  value={filterValues.endDate}
                  onChange={handleEndDateChange}
                  slotProps={{ textField: { size: "small" } }}
                />
              </Stack>
            </LocalizationProvider>
          )}

          {/* Dropdown Filter */}
          {filterConfig.dropdownEnabled && filterConfig.dropdownOptions && (
            <FormControl size="small" sx={{ minWidth: 150, mb: 1 }}>
              <InputLabel id="dropdown-filter-label">
                {filterConfig.dropdownLabel || "Filter"}
              </InputLabel>
              <Select
                labelId="dropdown-filter-label"
                value={filterValues.dropdown}
                label={filterConfig.dropdownLabel || "Filter"}
                onChange={handleDropdownChange}
              >
                {filterConfig.dropdownOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Multi-Select Filter */}
          {filterConfig.multiSelectEnabled &&
            filterConfig.multiSelectOptions && (
              <FormControl size="small" sx={{ minWidth: 200, mb: 1 }}>
                <InputLabel id="multi-select-filter-label">
                  {filterConfig.multiSelectLabel || "Multi Select"}
                </InputLabel>
                <Select
                  labelId="multi-select-filter-label"
                  multiple
                  value={filterValues.multiSelect}
                  label={filterConfig.multiSelectLabel || "Multi Select"}
                  onChange={handleMultiSelectChange}
                  renderValue={(selected) => {
                    const selectedLabels = filterConfig.multiSelectOptions
                      ?.filter((option) => selected.includes(option.value))
                      .map((option) => option.label);
                    return selectedLabels?.join(", ") || "";
                  }}
                >
                  {filterConfig.multiSelectOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
        </Stack>
      </Stack>
    </Box>
  );
}

export default TableFilters;
