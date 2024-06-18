/* eslint-disable react/prop-types */
import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { Dialog, Stack, Avatar, Typography, DialogContent, DialogActions, Button } from '@mui/material';
import { PopupTransition } from 'helpers/@extended/Transitions';
import { Trash } from 'iconsax-react';
import './dialog.css';
import LoadingButton from 'helpers/@extended/LoadingButton';

const DeleteDialogBox = ({
  openDialog,
  handleOpenDialog,
  dataRefetch,
  item,
  deleteOneItem,
  deletingItem,
  setDeletingItem,
  setSchemeData,
  isNomination
}) => {
  console.log('open');
  return (
    <Dialog
      open={openDialog}
      TransitionComponent={PopupTransition}
      keepMounted
      onClose={handleOpenDialog}
      maxWidth="xs"
      aria-labelledby="column-delete-title"
      aria-describedby="column-delete-description"
    >
      <DialogContent sx={{ mt: 2, my: 1 }}>
        <Stack alignItems="center" spacing={3.5}>
          <Avatar className="avatar_main" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
            <Trash variant="Bold" />
          </Avatar>
          <Stack spacing={2}>
            <Typography variant="h4" align="center">
              Are you sure you want to delete?
            </Typography>
            {/* <Typography align="center">By deleting this user, all task assigned to that user will also be deleted.</Typography> */}
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth onClick={handleOpenDialog} color="secondary" variant="outlined">
              Cancel
            </Button>
            <LoadingButton
              fullWidth
              color="error"
              variant="contained"
              loading={deletingItem}
              loadingPosition="center"
              onClick={() => {
                console.log(item);
                if (setSchemeData) {
                  deleteOneItem(item, setSchemeData, setDeletingItem, handleOpenDialog);
                } else {
                  deleteOneItem(item, setDeletingItem, handleOpenDialog);
                }
                if (!isNomination) {
                  setTimeout(() => {
                    dataRefetch();
                  }, 200);
                }
              }}
              autoFocus
            >
              Delete
            </LoadingButton>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

DeleteDialogBox.propTypes = {
  setSchemeData: PropTypes.any,
  isNomination: PropTypes.any
};

export default memo(DeleteDialogBox);

{
  /* <DialogActions>
          <Button color="secondary" onClick={handleOpenDialog}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              console.log(item);
              if (setSchemeData) {
                deleteOneItem(item, setSchemeData);
              } else {
                deleteOneItem(item);
              }
              handleOpenDialog();
              setTimeout(() => {
                dataRefetch();
              }, 200);
            }}
          >
            Delete
          </Button>
        </DialogActions> */
}
