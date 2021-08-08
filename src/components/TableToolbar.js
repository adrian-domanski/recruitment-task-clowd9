import React, { useEffect } from 'react';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';
import { TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useState } from 'react';
import { getAllRows } from '../utils';

const EnhancedTableHead = ({ setRows }) => {
  const [showFilters, setShowFilters] = useState(false);
  const classes = useToolbarStyles();
  const [filters, setFilters] = useState({
    name: '',
    accountType: '',
  });

  const handleFilterChange = ({ target: { value, name } }) => {
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Set initial rows, apply filters
  useEffect(() => {
    let rows = getAllRows();
    if (filters.name || filters.accountType) {
      if (filters.name) {
        rows = rows.filter((row) =>
          row.nameAndSurname.toLowerCase().includes(filters.name.toLowerCase())
        );
      }
      if (filters.accountType) {
        rows = rows.filter((row) =>
          row.accountType
            .toLowerCase()
            .includes(filters.accountType.toLowerCase())
        );
      }
    }
    setRows(rows);
  }, [filters, setRows]);

  return (
    <Toolbar className={clsx(classes.root)}>
      <Typography
        className={classes.title}
        variant='h6'
        id='tableTitle'
        component='div'
      >
        Users list
      </Typography>
      {showFilters && (
        <>
          <TextField
            variant='outlined'
            style={{ marginRight: '10px' }}
            label='Name'
            name='name'
            onChange={handleFilterChange}
          />
          <TextField
            variant='outlined'
            style={{ marginRight: '10px' }}
            label='Account type'
            name='accountType'
            onChange={handleFilterChange}
          />
        </>
      )}
      <Tooltip title='Filter list'>
        <IconButton
          aria-label='filter list'
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? <CloseIcon /> : <FilterListIcon />}
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(2),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

export default EnhancedTableHead;
