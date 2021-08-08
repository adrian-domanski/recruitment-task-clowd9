import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Drawer from '@material-ui/core/Drawer';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { stableSort, getComparator } from '../utils';

import EnhancedTableToolbar from './TableToolbar';
import EnhancedTableHead from './TableHead';

import { useState } from 'react';
import clsx from 'clsx';

export default function DataTable() {
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);

  const toggleDrawer = (rowId) => {
    const tempRows = rows;
    tempRows.forEach((row) => {
      if (row.id === rowId) row.isDrawerOpen = !row.isDrawerOpen;
    });

    setRows([...tempRows]);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={clsx(classes.root, 'tableWrapper')}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          rows={rows}
          setRows={setRows}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby='tableTitle'
            aria-label='enhanced table'
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
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
              {emptyRows > 0 && (
                <TableRow>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
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
}

const useStyles = makeStyles((theme) => ({
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
