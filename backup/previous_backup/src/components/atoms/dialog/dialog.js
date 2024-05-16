/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Dialog, Box, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { PopupTransition } from 'helpers/@extended/Transitions';

function DialogBox({ openDialog, handleOpenDialog, dataRefetch, item, deleteOneItem, setSchemeData }) {
  console.log('open');
  return (
    <Dialog
      open={openDialog}
      TransitionComponent={PopupTransition}
      keepMounted
      onClose={handleOpenDialog}
      aria-describedby="alert-dialog-slide-description"
    >
      <Box sx={{ p: 1, py: 1.5 }}>
        {/* <DialogTitle>Use Google&apos;ss location service?</DialogTitle> */}
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">Do you want to delete this item?</DialogContentText>
        </DialogContent>
        <DialogActions>
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
        </DialogActions>
      </Box>
    </Dialog>
  );
}

DialogBox.propTypes = {
  setSchemeData: PropTypes.any
};

export default DialogBox;
