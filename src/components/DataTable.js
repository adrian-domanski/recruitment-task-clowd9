import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Drawer,
  Paper,
  TableRow,
  TablePagination,
  TableContainer,
  TableCell,
  TableBody,
  Table,
} from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { stableSort, getComparator } from '../utils';
import clsx from 'clsx';

import TableToolbar from './TableToolbar';
import TableHead from './TableHead';

const DataTable = () => {
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);

  const toggleDrawer = (rowId) => {
    setRows(
      rows.map((row) => {
        if (row.id === rowId) row.isDrawerOpen = !row.isDrawerOpen;
        return row;
      })
    );
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className={clsx(classes.root, 'tableWrapper')}>
      <Paper className={classes.paper}>
        <TableToolbar setRows={setRows} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby='tableTitle'
            aria-label='enhanced table'
          >
            <TableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {!rows.length ? (
                <TableRow tabIndex={-1} className={classes.tableRow}>
                  <TableCell colSpan='5'>
                    <h3>Brak wyników</h3>
                  </TableCell>
                </TableRow>
              ) : (
                stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <React.Fragment key={row.id}>
                        <TableRow
                          tabIndex={-1}
                          selected={row.isDrawerOpen}
                          className={classes.tableRow}
                        >
                          <TableCell>{row.id}</TableCell>
                          <TableCell>{row.nameAndSurname}</TableCell>
                          <TableCell>{row.accountType}</TableCell>
                          <TableCell>{row.createDate}</TableCell>
                          <TableCell style={{ paddingLeft: 39 }} padding='none'>
                            {row.permissions.length ? (
                              row.isDrawerOpen ? (
                                <ArrowUpwardIcon
                                  className='arrowIcon'
                                  fontSize='large'
                                  onClick={() => toggleDrawer(row.id)}
                                />
                              ) : (
                                <ArrowDownwardIcon
                                  className='arrowIcon'
                                  fontSize='large'
                                  onClick={() => toggleDrawer(row.id)}
                                />
                              )
                            ) : null}
                          </TableCell>
                        </TableRow>
                        {row.isDrawerOpen && (
                          <TableRow
                            className={clsx(
                              row.isDrawerOpen ? 'isOpen' : '',
                              'drawer-row'
                            )}
                          >
                            <TableCell colSpan='5'>
                              <Drawer
                                open={row.isDrawerOpen}
                                anchor='bottom'
                                variant='persistent'
                              >
                                <ul className='permissions-list'>
                                  {row.permissions.map((permission, index) => (
                                    <span
                                      className='permission-item badge'
                                      key={index}
                                    >
                                      {permission}
                                    </span>
                                  ))}
                                </ul>
                              </Drawer>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 15, 30]}
          component='div'
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
  paper: {
    padding: '30px',
    width: '100%',
    boxShadow: '0 4px 10px 1px rgba(0,0,0,0.10)',
    maxWidth: 1200,
    margin: '0 auto',
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  tableRow: {
    '&.Mui-selected, &.Mui-selected:hover': {
      backgroundColor: '#f7f7f7',
    },
  },
}));

export default DataTable;
