import { 
  Box, 
  TextField, 
  Tabs, 
  Tab, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Stack
} from '@mui/material';

function TableFilters({ filterConfig, filterValues, onFilterChange }) {

  // * Handle search input change
  const handleSearchChange = (event) => {
    onFilterChange('search', event.target.value);
  };

  // * Handle tab change
  const handleTabChange = (_event, newValue) => {
    onFilterChange('activeTab', newValue);
  };

  // * Handle dropdown change
  const handleDropdownChange = (event) => {
    onFilterChange('dropdown', event.target.value);
  };

  // * Handle multi-select change
  const handleMultiSelectChange = (event) => {
    const value = event.target.value;
    onFilterChange('multiSelect', typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Stack spacing={2}>

        {/* Tabs Filter */}
        {filterConfig.tabsEnabled && filterConfig.tabOptions && (
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
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

        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
          {/* Search Filter */}

          {filterConfig.searchEnabled && (
            <TextField
              label={filterConfig.searchPlaceholder || 'Search'}
              variant="outlined"
              size="small"
              value={filterValues.search}
              onChange={handleSearchChange}
              sx={{ minWidth: 200, mb: 1 }}
            />
          )}

          {/* Dropdown Filter */}
          {filterConfig.dropdownEnabled && filterConfig.dropdownOptions && (
            <FormControl size="small" sx={{ minWidth: 150, mb: 1 }}>
              <InputLabel id="dropdown-filter-label">
                {filterConfig.dropdownLabel || 'Filter'}
              </InputLabel>
              <Select
                labelId="dropdown-filter-label"
                value={filterValues.dropdown}
                label={filterConfig.dropdownLabel || 'Filter'}
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
          {filterConfig.multiSelectEnabled && filterConfig.multiSelectOptions && (
            <FormControl size="small" sx={{ minWidth: 200, mb: 1 }}>
              <InputLabel id="multi-select-filter-label">
                {filterConfig.multiSelectLabel || 'Multi Select'}
              </InputLabel>
              <Select
                labelId="multi-select-filter-label"
                multiple
                value={filterValues.multiSelect}
                label={filterConfig.multiSelectLabel || 'Multi Select'}
                onChange={handleMultiSelectChange}
                renderValue={(selected) => {
                  const selectedLabels = filterConfig.multiSelectOptions
                    ?.filter(option => selected.includes(option.value))
                    .map(option => option.label);
                  return selectedLabels?.join(', ') || '';
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
};

export default TableFilters;
