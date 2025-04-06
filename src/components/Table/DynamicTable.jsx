import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Box,
  Typography,
  Skeleton 
} from '@mui/material';

function DynamicTable({ columns, data, title, loading = false, pagination, sorting }) {

  // ? Handle row click, might use it for pop Ups??
  const handleRowClick = (row) => {
    console.log('Row clicked:', row);
  };

  // * Handle sort change
  const handleSortChange = (key) => {
    if (sorting) {
      const isAsc = sorting.sortConfig.key === key && sorting.sortConfig.direction === 'asc';
      sorting.onSortChange({
        key,
        direction: isAsc ? 'desc' : 'asc'
      });
    }
  };

  // * Handle page change
  const handleChangePage = (_event, newPage) => {
    if (pagination) {
      pagination.onPageChange(newPage);
    }
  };

  // * Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    if (pagination) {
      pagination.onRowsPerPageChange(parseInt(event.target.value, 10));
      pagination.onPageChange(0);
    }
  };

  return (
    <Paper elevation={2} sx={{ width: '100%', overflow: 'hidden' }}>
      {title && (
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(224, 224, 224, 1)' }}>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
      )}
      
      <TableContainer sx={{ maxHeight: 650 }}>
        <Table stickyHeader aria-label="dynamic table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  align={column.align || 'left'}
                  sx={{ fontWeight: 'bold' }}
                >
                  {column.sortable && sorting ? (
                    <TableSortLabel
                      active={sorting.sortConfig.key === column.key}
                      direction={
                        sorting.sortConfig.key === column.key
                          ? sorting.sortConfig.direction
                          : 'asc'
                      }
                      onClick={() => handleSortChange(column.key)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // * Loading skeleton rows
              Array.from(new Array(pagination?.rowsPerPage || 5)).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={`skeleton-cell-${index}-${colIndex}`}>
                      <Skeleton height={24} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              // * Empty state
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ height: '400px', textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No data available
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow
                  hover
                  key={rowIndex}
                  onClick={() => handleRowClick(row)}
                  sx={{ cursor: 'pointer' }}
                >
                  {columns.map((column) => (
                    <TableCell key={`${rowIndex}-${column.key}`} align={column.align || 'left'}>
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {pagination && (
        <TablePagination
          rowsPerPageOptions={pagination.rowsPerPageOptions || [5, 10, 25, 50]}
          component="div"
          count={pagination.totalCount}
          rowsPerPage={pagination.rowsPerPage}
          page={pagination.page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
};

export default DynamicTable;
