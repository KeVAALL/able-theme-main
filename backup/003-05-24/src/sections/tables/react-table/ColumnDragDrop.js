import PropTypes from 'prop-types';
import { useMemo } from 'react';

// material-ui
import { Chip, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

// third-party
import { useColumnOrder, useTable } from 'react-table';
import update from 'immutability-helper';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';

// project-imports
import MainCard from 'componentss/organisms/mainCard/MainCard';
import ScrollX from 'componentss/organisms/scrollX/ScrollX';
import LinearWithLabel from 'components/@extended/progress/LinearWithLabel';
import { CSVExport, DraggableHeader, DragPreview } from 'components/third-party/ReactTable';

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setColumnOrder,
    state: { columnOrder }
  } = useTable(
    {
      columns,
      data,
      initialState: {
        columnOrder: ['firstName', 'lastName', 'email', 'age', 'visits', 'status', 'progress']
      }
    },
    useColumnOrder
  );

  const reorder = (item, newIndex) => {
    const { index: currentIndex } = item;
    const dragRecord = columnOrder[currentIndex];

    setColumnOrder(
      update(columnOrder, {
        $splice: [
          [currentIndex, 1],
          [newIndex, 0, dragRecord]
        ]
      })
    );
  };

  return (
    <Table {...getTableProps()}>
      <TableHead>
        {headerGroups.map((headerGroup, index) => (
          <TableRow key={index} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, i) => (
              <TableCell key={i} {...column.getHeaderProps([{ className: column.className }])}>
                <DraggableHeader reorder={reorder} key={column.id} column={column} index={i}>
                  {column.render('Header')}
                </DraggableHeader>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <TableRow key={i} {...row.getRowProps()}>
              {row.cells.map((cell, index) => (
                <TableCell key={index} {...cell.getCellProps([{ className: cell.column.className }])}>
                  {cell.render('Cell')}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array
};

// ==============================|| REACT TABLE - COLUMN DRAG & DROP ||============================== //

const ColumnDragDrop = ({ data }) => {
  const columns = useMemo(
    () => [
      {
        Header: 'First Name',
        accessor: 'firstName'
      },
      {
        Header: 'Last Name',
        accessor: 'lastName'
      },
      {
        Header: 'Email',
        accessor: 'email'
      },
      {
        Header: 'Age',
        accessor: 'age',
        className: 'cell-right'
      },
      {
        Header: 'Visits',
        accessor: 'visits',
        className: 'cell-right'
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => {
          switch (value) {
            case 'Complicated':
              return <Chip color="error" label="Complicated" size="small" variant="light" />;
            case 'Relationship':
              return <Chip color="success" label="Relationship" size="small" variant="light" />;
            case 'Single':
            default:
              return <Chip color="info" label="Single" size="small" variant="light" />;
          }
        }
      },
      {
        Header: 'Profile Progress',
        accessor: 'progress',
        Cell: ({ value }) => <LinearWithLabel value={value} sx={{ minWidth: 75 }} />
      }
    ],
    []
  );

  return (
    <MainCard
      title="Column Drag & Drop (Ordering)"
      content={false}
      secondary={<CSVExport data={data} filename={'column-dragable-table.csv'} />}
    >
      <ScrollX>
        <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
          <ReactTable columns={columns} data={data} />
          <DragPreview />
        </DndProvider>
      </ScrollX>
    </MainCard>
  );
};

ColumnDragDrop.propTypes = {
  data: PropTypes.array,
  value: PropTypes.string
};

export default ColumnDragDrop;
