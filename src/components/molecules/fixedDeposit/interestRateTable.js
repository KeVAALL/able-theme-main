/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useState, memo } from 'react';

// material-ui
import { Box, Stack, Table, TableBody, TableCell, TableHead, TableRow, Button, Grid } from '@mui/material';
import { CustomTextField } from 'utils/textfield';
import { Trash, Edit2, FilterSearch, DiscountShape, Additem } from 'iconsax-react';

// third-party
import { useTable, useFilters, usePagination } from 'react-table';
import { Formik } from 'formik';
import { CSVExport, TablePagination, EmptyTable, HeaderSort, HidingSelect } from 'helpers/third-party/ReactTable';
import { useGlobalFilter } from 'react-table/dist/react-table.development';
import { useSortBy } from 'react-table';

// project-imports
import MainCard from 'components/organisms/mainCard/MainCard';
import ScrollX from 'components/organisms/scrollX/ScrollX';
import DialogBox from 'components/atoms/dialog/dialog';
import AnimateButton from 'helpers/@extended/AnimateButton';
import IconButton from 'helpers/@extended/IconButton';

// ==============================|| REACT TABLE ||============================== //

function ReactTable({
  columns,
  data,
  formValues,
  formValueFields,
  validationSchema,
  changeTableVisibility,
  setEditing,
  schemeEditing,
  getOneItem,
  deleteOneItem,
  setSearchData,
  setSchemeData,
  tableDataRefetch,
  setActiveEditing,
  handleIROpenDialog,
  isEditingInterestRateLogic,
  VisibleColumn,
  hideActions
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    page,
    prepareRow,
    gotoPage,
    setPageSize,
    setHiddenColumns,
    allColumns,
    state: { pageIndex, pageSize, hiddenColumns }
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: 5,
        sortBy: [
          {
            id: 'userName',
            desc: false
          }
        ],
        hiddenColumns: columns.filter((col) => VisibleColumn.includes(col.accessor)).map((col) => col.accessor)
      }
      // defaultColumn,
      // filterTypes
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    usePagination
  );
  const sortingRow = rows.slice(0, 10);

  // For Delete Item
  const [item, setItem] = useState();
  // For Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => {
    setOpenDialog(!openDialog);
  };
  // For Column Hiding
  let headers = [];
  allColumns.map((item) => {
    if (!hiddenColumns?.includes(item.id)) {
      headers.push({ label: item.Header, key: item.id });
    }
    return item;
  });

  return (
    <Stack>
      {!hideActions && (
        <Grid container spacing={2} alignItems="center" justifyContent="space-between" sx={{ padding: 2 }}>
          <Grid item md={7} sm={7} xs={12}>
            {formValueFields?.length >= 1 && (
              <Formik
                initialValues={formValues}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                  getOneItem(values, setSearchData);
                  resetForm();
                }}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                  <Box
                    component="form"
                    onSubmit={(event) => {
                      event.preventDefault();
                      handleSubmit();
                    }}
                    sx={{ width: '60%' }}
                  >
                    <Grid container direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                      {formValueFields?.map((field, id) => {
                        return (
                          <Grid item xs={4} key={id}>
                            <CustomTextField
                              label={field.label}
                              name={field.fieldName}
                              values={values}
                              type={field.type}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              touched={touched}
                              errors={errors}
                            />
                          </Grid>
                        );
                      })}

                      <Grid item xs={4}>
                        <Button
                          variant="contained"
                          color="success"
                          type="submit"
                          startIcon={<FilterSearch />}
                          sx={{ justifySelf: 'center' }}
                        >
                          Search
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Formik>
            )}
          </Grid>
          <Grid item md={5} sm={5} xs={12} sx={{ display: 'flex', justifyContent: { sm: 'flex-end' } }}>
            <Grid container spacing={4} sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
              <Grid item md={11} xs={11} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <HidingSelect hiddenColumns={hiddenColumns} setHiddenColumns={setHiddenColumns} allColumns={allColumns} />
              </Grid>

              <Grid item md={1} xs={1} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <CSVExport data={rows.map((d) => d.original)} filename={'filtering-table.csv'} headers={headers} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}

      {item && (
        <DialogBox
          openDialog={openDialog}
          handleOpenDialog={handleOpenDialog}
          dataRefetch={() => {}}
          item={item}
          deleteOneItem={deleteOneItem}
          setSchemeData={setSchemeData}
        />
      )}

      <Box sx={{ width: '100%', overflowX: 'auto', display: 'block' }}>
        <Table {...getTableProps()}>
          <TableHead sx={{ borderTopWidth: top ? 2 : 1 }}>
            {headerGroups.map((headerGroup) => (
              <TableRow key={headerGroup} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell key={column} cell={column} {...column.getHeaderProps([{ className: column.className }])}>
                    <HeaderSort column={column} sort />
                  </TableCell>
                ))}

                {!hideActions && (
                  <TableCell width={150} sx={{ textAlign: 'right' }}>
                    <Box>
                      <AnimateButton>
                        <Button
                          className="icon-only-button"
                          variant="contained"
                          color="success"
                          startIcon={<Additem size={40} />}
                          onClick={handleIROpenDialog}
                        ></Button>
                      </AnimateButton>
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.length > 0 && data.length > 0 ? (
              page.map((row) => {
                prepareRow(row);
                return (
                  <TableRow key={row} {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <TableCell key={cell} {...cell.getCellProps([{ className: cell.column.className }])}>
                          {cell.column.customCell ? <cell.column.customCell value={cell.value} /> : cell.render('Cell')}
                        </TableCell>
                      );
                    })}
                    {!hideActions && (
                      <TableCell sx={{ textAlign: { md: 'right', xs: 'center' } }}>
                        <Grid container sx={{ display: 'flex', justifyContent: { md: 'flex-end', xs: 'center' } }}>
                          <Grid item md={4}>
                            <IconButton
                              color="black"
                              onClick={() => {
                                schemeEditing(row.original);
                                setActiveEditing();
                                setTimeout(() => {
                                  handleIROpenDialog();
                                }, 200);
                              }}
                            >
                              <Edit2 size={26} style={{ cursor: 'pointer' }} />
                            </IconButton>
                          </Grid>

                          {Boolean(row.original.is_live) === true ? (
                            <Grid item md={4}></Grid>
                          ) : (
                            <Grid item md={4}>
                              <IconButton
                                color="error"
                                onClick={async () => {
                                  setItem(row.original);
                                  setTimeout(() => {
                                    handleOpenDialog();
                                  }, 200);
                                }}
                              >
                                <Trash size={26} style={{ cursor: 'pointer' }} />
                              </IconButton>
                            </Grid>
                          )}
                        </Grid>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            ) : (
              <EmptyTable msg="No Data" colSpan={columns.length + 1} />
            )}
          </TableBody>
        </Table>
      </Box>
      <Box sx={{ p: 2, borderTop: '1px solid #dbe0e5a6' }}>
        <TablePagination
          gotoPage={gotoPage}
          rows={rows}
          setPageSize={setPageSize}
          pageIndex={pageIndex}
          pageSize={pageSize}
          viewOptions={[5]}
        />
      </Box>
    </Stack>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array
};

// ==============================|| REACT TABLE - PAGINATION - FILTERING ||============================== //

const InterestRateTable = ({
  columns,
  data,
  formValues,
  formValueFields,
  validationSchema,
  changeTableVisibility,
  setEditing,
  schemeEditing,
  getOneItem,
  deleteOneItem,
  setSearchData,
  setSchemeData,
  tableDataRefetch,
  setActiveEditing,
  handleIROpenDialog,
  isEditingInterestRateLogic,
  VisibleColumn,
  hideActions
}) => {
  return (
    <MainCard sx={{ borderRadius: 0 }} content={false} secondary={<CSVExport data={data} filename={'pagination-bottom-table.csv'} />}>
      <ScrollX>
        <ReactTable
          columns={columns}
          data={data}
          formValues={formValues}
          formValueFields={formValueFields}
          validationSchema={validationSchema}
          changeTableVisibility={changeTableVisibility}
          setEditing={setEditing}
          schemeEditing={schemeEditing}
          getOneItem={getOneItem}
          deleteOneItem={deleteOneItem}
          setSearchData={setSearchData}
          setSchemeData={setSchemeData}
          tableDataRefetch={tableDataRefetch}
          setActiveEditing={setActiveEditing}
          handleIROpenDialog={handleIROpenDialog}
          isEditingInterestRateLogic={isEditingInterestRateLogic}
          VisibleColumn={VisibleColumn}
          hideActions={hideActions}
        />
      </ScrollX>
    </MainCard>
  );
};

InterestRateTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  formValues: PropTypes.object,
  formValueFields: PropTypes.any,
  validationSchema: PropTypes.any,
  changeTableVisibility: PropTypes.any,
  setEditing: PropTypes.any,
  schemeEditing: PropTypes.any,
  getOneItem: PropTypes.any,
  deleteOneItem: PropTypes.any,
  setSearchData: PropTypes.any,
  setSchemeData: PropTypes.any,
  tableDataRefetch: PropTypes.any,
  setActiveEditing: PropTypes.any,
  // Add new table for below
  handleIROpenDialog: PropTypes.any,
  isEditingInterestRateLogic: PropTypes.any,
  VisibleColumn: PropTypes.array,
  hideActions: PropTypes.any
};

export default memo(InterestRateTable);

// const filterTypes = useMemo(() => renderFilterTypes, []);
// const defaultColumn = useMemo(() => ({ Filter: DefaultColumnFilter }), []);
// const initialState = useMemo(() => ({ filters: [{ id: 'status', value: '' }] }), []);
