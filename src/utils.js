import DB from './db/mock';

export function getAllRows() {
  return DB.map((row) => {
    const { id, userName, accountType, createDate, permissions } = row;

    const nameAndSurname = `${row.firstName ?? ''}${
      row.lastName ? ' ' + row.lastName : ''
    }`;

    return {
      id,
      nameAndSurname,
      userName,
      accountType,
      createDate,
      permissions,
      isDrawerOpen: false,
    };
  });
}

export function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export const getHeadCells = () => [
  {
    id: 'id',
    numeric: true,
    disablePadding: true,
    label: 'id',
  },
  { id: 'nameAndSurname', numeric: true, disablePadding: false, label: 'Name' },
  {
    id: 'accountType',
    numeric: true,
    disablePadding: false,
    label: 'Account type',
  },
  {
    id: 'createDate',
    numeric: true,
    disablePadding: false,
    label: 'Create date',
  },
  {
    id: 'permissions',
    numeric: true,
    disablePadding: false,
    label: 'Permissions',
  },
];
