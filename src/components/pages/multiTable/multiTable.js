/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useState, useEffect, useMemo, memo } from 'react';

// material-ui
import { Box, Stack, Table, TableBody, TableCell, TableHead, TableRow, Button, Grid, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CustomTextField } from 'utils/textfield';
import { Trash, Edit2, FilterSearch, DiscountShape, Eye } from 'iconsax-react';

// third-party
import { useTable, useFilters, usePagination } from 'react-table';
import { Formik } from 'formik';

// project-imports
import MainCard from 'components/organisms/mainCard/MainCard';
import ScrollX from 'components/organisms/scrollX/ScrollX';
import { CSVExport, TablePagination, EmptyTable, HeaderSort, HidingSelect } from 'helpers/third-party/ReactTable';
import { useGlobalFilter } from 'react-table/dist/react-table.development';
import { useSortBy } from 'react-table';
import DialogBox from 'components/atoms/dialog/dialog';
import './multiTable.css';
import IconButton from 'helpers/@extended/IconButton';
import Loader from 'components/atoms/loader/Loader';
import TableLoader from 'components/atoms/loader/TableLoader';

// ==============================|| REACT TABLE ||============================== //

const ReactTable = ({
  columns,
  data,
  csvData,
  formValues,
  formValueFields,
  validationSchema,
  changeTableVisibility,
  setEditing,
  schemeEditing,
  getOneItem,
  deleteOneItem,
  getEditData,
  getEditReqField,
  setSearchData,
  tableDataRefetch,
  setActiveEditing,
  isEditingInterestRateButton,
  isEditingInterestRate,
  VisibleColumn,
  doNotShowHeader,
  isNomination,
  hideActions,
  isFetching
}) => {
  // const filterTypes = useMemo(() => renderFilterTypes, []);
  // const defaultColumn = useMemo(() => ({ Filter: DefaultColumnFilter }), []);
  // const initialState = useMemo(() => ({ filters: [{ id: 'status', value: '' }] }), []);
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
    state: { pageIndex, pageSize, globalFilter, hiddenColumns },
    preGlobalFilteredRows,
    setGlobalFilter
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
        sortBy: useMemo(
          () => [
            {
              id: 'userName',
              desc: false
            }
          ],
          []
        ),
        hiddenColumns: columns?.filter((col) => VisibleColumn?.includes(col.accessor)).map((col) => col.accessor)
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
  const theme = useTheme();
  const mdUp = theme.breakpoints.up('md');

  // For Delete Item
  const [item, setItem] = useState();
  // For Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => {
    setOpenDialog(!openDialog);
  };
  // For Column Hiding
  let headers = [];
  allColumns?.map((item) => {
    if (!hiddenColumns?.includes(item.id)) {
      headers.push({ label: item.Header, key: item.id });
    }
    return item;
  });

  return (
    <>
      {!doNotShowHeader ? (
        <Grid container alignItems="center" spacing={2} sx={{ padding: 2 }}>
          <Grid item md={6.5} sm={6.5} xs={12}>
            {formValueFields?.length >= 1 && (
              <Formik
                initialValues={formValues}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                  const search = await getOneItem(values);
                  console.log(search);
                  setSearchData(search);
                }}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => (
                  <Box
                    component="form"
                    onSubmit={(event) => {
                      event.preventDefault();
                      handleSubmit();
                    }}
                  >
                    <Grid container direction="row" spacing={1} alignItems="center">
                      {formValueFields?.map((field, id) => {
                        return (
                          <Grid item md={5} sm={4} xs={7} key={id} sx={{ paddingTop: '0px !important', height: '45px' }}>
                            <CustomTextField
                              label={field.label}
                              name={field.fieldName}
                              values={values}
                              placeholder={field.placeholder}
                              type={field.type}
                              onChange={(e) => {
                                const strings = /^[a-zA-Z][a-zA-Z\s]*$/;
                                const specials = /^[a-zA-Z0-9.]*$/;
                                const numbers = /^\d+$/;
                                e.preventDefault();
                                const { value } = e.target;
                                const regex = field.regType === 'string' ? strings : field.regType === 'noSpecial' ? specials : numbers;

                                if (!value || regex.test(value.toString())) {
                                  setFieldValue(field.fieldName, value);
                                }
                              }}
                              onBlur={handleBlur}
                              touched={touched}
                              errors={errors}
                              inputProps={{ maxLength: 50 }}
                            />
                          </Grid>
                        );
                      })}

                      {formValueFields && (
                        <Grid item md={3} sm={4} xs={5} sx={{ height: '60px' }}>
                          <Button
                            variant="contained"
                            color="success"
                            type="submit"
                            startIcon={<FilterSearch />}
                            sx={{
                              borderRadius: 0.6,
                              justifySelf: 'center',
                              width: !mdUp ? 'auto' : '100%' // Set width to 'auto' when screen size is medium or larger, otherwise '100%'
                            }}
                          >
                            Search
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                )}
              </Formik>
            )}
          </Grid>
          <Grid
            item
            md={5.5}
            sm={5.5}
            xs={12}
            sx={{
              display: 'flex',
              justifyContent: { sm: 'flex-end' },
              alignItems: 'center',
              height: '65px',
              paddingTop: { lg: '16px !important', sm: '0px !important' }
            }}
          >
            <Grid container spacing={4} sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
              <Grid
                item
                md={11}
                xs={10}
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  paddingTop: {
                    lg: '20px !important',
                    sm: '32px !important',
                    xs: '8px !important'
                  }
                }}
              >
                <HidingSelect hiddenColumns={hiddenColumns} setHiddenColumns={setHiddenColumns} allColumns={allColumns} />
              </Grid>

              <Grid
                item
                md={1}
                xs={2}
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  paddingTop: {
                    lg: '20px !important',
                    sm: '32px !important',
                    xs: '8px !important'
                  }
                }}
              >
                <CSVExport
                  data={rows?.map((d, i) => {
                    if (d.original.is_active === 1) {
                      return { ...d.original, is_active: 'Active' };
                    }
                    if (d.original.is_active === 0) {
                      return { ...d.original, is_active: 'In-active' };
                    }
                    if (csvData) {
                      console.log(csvData);
                      return csvData[i];
                    } else {
                      console.log(d.original);
                      return d.original;
                    }
                  })}
                  filename={'filtering-table.csv'}
                  headers={headers}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <></>
      )}

      {item && (
        <DialogBox
          openDialog={openDialog}
          handleOpenDialog={handleOpenDialog}
          dataRefetch={tableDataRefetch}
          item={item}
          deleteOneItem={deleteOneItem}
          isNomination={isNomination}
        />
      )}

      <Box sx={{ width: '100%', overflowX: 'auto', display: 'block' }}>
        <Table {...getTableProps()}>
          <TableHead sx={{ borderTopWidth: top ? 2 : 1 }}>
            {headerGroups?.map((headerGroup) => (
              <TableRow key={headerGroup} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers?.map((column) => (
                  <TableCell
                    key={column}
                    cell={column}
                    sx={{
                      // position: 'sticky !important',
                      fontSize: '0.7rem',
                      border: '1px solid #dbe0e5a6'
                    }}
                    className="table_header"
                    // {...column.getHeaderProps([{ className: column.className }])}
                    {...column.getHeaderProps({ style: { minWidth: column.minWidth } })}
                  >
                    <HeaderSort column={column} sort />
                    {/* {column.render('Header')} */}
                  </TableCell>
                ))}
                {!hideActions && (
                  <TableCell
                    sx={{
                      textAlign: 'right'
                      // minWidth: 120 // Send minWidth props from parent?
                    }}
                  >
                    Actions
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableHead>
          <TableBody className="table_body_main" {...getTableBodyProps()}>
            {page?.length > 0 ? (
              page?.map((row) => {
                prepareRow(row);
                return (
                  <TableRow key={row} {...row.getRowProps()}>
                    {row.cells?.map((cell) => {
                      return (
                        <TableCell
                          key={cell}
                          sx={{ fontSize: '0.80rem', border: '1px solid #dbe0e5a6' }}
                          // {...cell.getCellProps([{ className: { minWidth: cell.column.minWidth } }])}
                          {...cell.getCellProps({ style: { minWidth: cell.column.minWidth } })}
                        >
                          {/* {cell.render('Cell')} */}
                          {cell.column.customCell ? <cell.column.customCell value={cell.value} /> : cell.render('Cell')}
                        </TableCell>
                      );
                    })}
                    {headers?.length !== 0 && !hideActions && (
                      <TableCell sx={{ textAlign: { md: 'right', xs: 'center' }, width: 130, border: '1px solid #dbe0e5a6' }}>
                        <Grid container sx={{ display: 'flex', justifyContent: { md: 'flex-end', xs: 'center' } }}>
                          <Grid item md={isEditingInterestRateButton ? 4 : 6}>
                            <IconButton
                              color="black"
                              onClick={async () => {
                                if (getEditData) {
                                  await getEditData(setEditing, row.original[getEditReqField]);
                                  setTimeout(() => {
                                    changeTableVisibility();
                                  }, 500);
                                } else {
                                  setEditing(row.original);
                                  changeTableVisibility();
                                }
                                setActiveEditing();
                              }}
                            >
                              <Edit2 size={26} style={{ cursor: 'pointer' }} />
                            </IconButton>
                          </Grid>

                          {isEditingInterestRateButton && (
                            <Grid item md={4}>
                              <Tooltip title="View Schemes">
                                <IconButton
                                  color="black"
                                  onClick={async () => {
                                    // setTimeout(() => {
                                    isEditingInterestRate();
                                    // }, 500);
                                    console.log(row.original);
                                    setEditing(row.original);
                                  }}
                                >
                                  <DiscountShape size={22} style={{ cursor: 'pointer' }} />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                          )}

                          <Grid item md={isEditingInterestRateButton ? 4 : 6}>
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
                        </Grid>
                      </TableCell>
                    )}
                    {/* {hideActions && (
                      <TableCell sx={{ textAlign: { md: 'right', xs: 'center' }, width: 130 }}>
                        <Grid container sx={{ display: 'flex', justifyContent: { xs: 'center' } }}>
                          {row.original.status === 1 && (
                            <Grid item md={6}>
                              <IconButton
                                color="black"
                                onClick={async () => {
                                  setEditing(row.original);
                                  // changeTableVisibility();
                                  setActiveEditing();
                                }}
                              >
                                <Edit2 size={26} style={{ cursor: 'pointer' }} />
                              </IconButton>
                            </Grid>
                          )}
                          {row.original.status === 2 && (
                            <Grid item md={6}>
                              <IconButton
                                color="black"
                                onClick={async () => {
                                  setEditing(row.original);
                                }}
                              >
                                <Eye size={26} style={{ cursor: 'pointer' }} />
                              </IconButton>
                            </Grid>
                          )}
                        </Grid>
                      </TableCell>
                    )} */}
                  </TableRow>
                );
              })
            ) : (
              <>
                <EmptyTable msg="No Data" colSpan={columns.length + 1} isFetching={isFetching} />
              </>
            )}
          </TableBody>
        </Table>
      </Box>
      <Box sx={{ p: 2, borderTop: '1px solid #dbe0e5a6' }}>
        <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageIndex={pageIndex} pageSize={pageSize} />
      </Box>
    </>
  );
};

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.any,
  csvData: PropTypes.any
};

// ==============================|| REACT TABLE - PAGINATION - FILTERING ||============================== //

const MultiTable = ({
  columns,
  data,
  csvData,
  formValues,
  formValueFields,
  validationSchema,
  changeTableVisibility,
  setEditing,
  schemeEditing,
  getOneItem,
  deleteOneItem,
  getEditData,
  getEditReqField,
  setSearchData,
  tableDataRefetch,
  setActiveEditing,
  isEditingInterestRateButton,
  isEditingInterestRate,
  VisibleColumn,
  doNotShowHeader,
  isNomination,
  hideActions,
  isFetching
}) => {
  return (
    <MainCard sx={{ borderRadius: 0 }} content={false} secondary={<CSVExport data={data} filename={'pagination-bottom-table.csv'} />}>
      <ScrollX>
        <ReactTable
          columns={columns}
          data={data ? data : []}
          csvData={csvData}
          formValues={formValues}
          formValueFields={formValueFields}
          validationSchema={validationSchema}
          changeTableVisibility={changeTableVisibility}
          setEditing={setEditing}
          schemeEditing={schemeEditing}
          getOneItem={getOneItem}
          deleteOneItem={deleteOneItem}
          getEditData={getEditData}
          getEditReqField={getEditReqField}
          setSearchData={setSearchData}
          tableDataRefetch={tableDataRefetch}
          setActiveEditing={setActiveEditing}
          isEditingInterestRateButton={isEditingInterestRateButton}
          isEditingInterestRate={isEditingInterestRate}
          VisibleColumn={VisibleColumn}
          doNotShowHeader={doNotShowHeader}
          isNomination={isNomination}
          hideActions={hideActions}
          isFetching={isFetching}
        />
      </ScrollX>
    </MainCard>
  );
};

MultiTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.any,
  csvData: PropTypes.any,
  formValues: PropTypes.object,
  formValueFields: PropTypes.any,
  validationSchema: PropTypes.any,
  changeTableVisibility: PropTypes.func,
  setEditing: PropTypes.any,
  schemeEditing: PropTypes.any,
  getOneItem: PropTypes.any,
  deleteOneItem: PropTypes.any,
  getEditData: PropTypes.any,
  getEditReqField: PropTypes.any,
  setSearchData: PropTypes.any,
  tableDataRefetch: PropTypes.any,
  setActiveEditing: PropTypes.any,
  // Add new table for below
  isEditingInterestRateButton: PropTypes.any,
  isEditingInterestRate: PropTypes.any,
  VisibleColumn: PropTypes.any,
  doNotShowHeader: PropTypes.any,
  isNomination: PropTypes.any,
  hideActions: PropTypes.any,
  isFetching: PropTypes.any
};

export default memo(MultiTable);
