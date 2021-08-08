import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
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

const EnhancedTableToolbar = ({ numSelected, rows, setRows }) => {
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

  useEffect(() => {
    const allRows = getAllRows();
    if (filters.name || filters.accountType) {
      let filteredRows = allRows;
      if (filters.name) {
        filteredRows = filteredRows.filter((row) =>
          row.nameAndSurname.toLowerCase().includes(filters.name.toLowerCase())
        );
      }
      if (filters.accountType) {
        filteredRows = filteredRows.filter((row) =>
          row.accountType
            .toLowerCase()
            .includes(filters.accountType.toLowerCase())
        );
      }
      return setRows(filteredRows);
    }
    setRows(allRows);
  }, [filters, setRows]);

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color='inherit'
          variant='subtitle1'
          component='div'
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant='h6'
          id='tableTitle'
          component='div'
        >
          Users data
        </Typography>
      )}
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

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default EnhancedTableToolbar;
