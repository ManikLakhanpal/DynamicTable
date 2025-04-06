import { Box, Chip, Typography, Stack } from '@mui/material';

function ActiveFilters({ activeFilters = [], onRemoveFilter }) {
  if (!activeFilters.length) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
        <Typography variant="body2" color="text.secondary">
          Active filters:
        </Typography>
        {activeFilters.map((filter) => (
          <Chip
            color='primary'
            variant='outlined'
            key={filter.id}
            label={filter.label}
            onDelete={() => onRemoveFilter(filter.type, filter.value)}
            size="small"
            sx={{ my: 0.5 }}
          />
        ))}
      </Stack>
    </Box>
  );
}

export default ActiveFilters;