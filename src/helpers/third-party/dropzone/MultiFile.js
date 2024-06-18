/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { styled } from '@mui/material/styles';
import { Box, Button, Stack } from '@mui/material';

// third-party
import { useDropzone } from 'react-dropzone';
import { DropzopType } from 'config';

// project-imports
import RejectionFiles from './RejectionFiles';
import PlaceholderContent from './PlaceholderContent';
import FilesPreview from './FilesPreview';
import { UploadFAQ } from 'hooks/faq/faq';
import { GetIssuerData } from 'hooks/issuer/issuer';
import { CloudPlus } from 'iconsax-react';
import LoadingButton from 'helpers/@extended/LoadingButton';

const DropzoneWrapper = styled('div')(({ theme }) => ({
  outline: 'none',
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  border: `1px dashed ${theme.palette.secondary.main}`,
  '&:hover': { opacity: 0.72, cursor: 'pointer' }
}));

// ==============================|| UPLOAD - MULTIPLE FILE ||============================== //

const MultiFileUpload = ({
  error,
  showList = false,
  issuer_id,
  setIssuerData,
  issuerTableDataRefetch,
  handleOpenUploadDialog,
  handleIssuerChange,
  faqUploading,
  setFaqUploading,
  files,
  type,
  setFieldValue,
  sx,
  onUpload
}) => {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    accept: {
      'application/vnd.ms-excel': [], // .xls files
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [] // .xlsx files
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      setFieldValue(
        'files',
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    }
  });

  const onRemoveAll = () => {
    setFieldValue('files', null);
  };

  const onRemove = (file) => {
    const filteredItems = files && files.filter((_file) => _file !== file);
    setFieldValue('files', filteredItems);
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
          ...(type === DropzopType.standard && { width: 'auto', display: 'flex' }),
          ...sx
        }}
      >
        {!(files?.length > 0) && (
          <Stack {...(type === DropzopType.standard && { alignItems: 'center' })}>
            <DropzoneWrapper
              {...getRootProps()}
              sx={{
                marginTop: '24px !important',
                ...(type === DropzopType.standard && {
                  p: 0,
                  m: 1,
                  width: 64,
                  height: 64
                }),
                ...(isDragActive && { opacity: 0.72 }),
                ...((isDragReject || error) && {
                  color: 'error.main',
                  borderColor: 'error.light',
                  bgcolor: 'error.lighter'
                })
              }}
            >
              <input {...getInputProps()} />
              <PlaceholderContent type={type} />
            </DropzoneWrapper>
            {type === DropzopType.standard && files && files.length > 1 && (
              <Button variant="contained" color="error" size="extraSmall" onClick={onRemoveAll}>
                Remove all
              </Button>
            )}
          </Stack>
        )}
        {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}
        {files && files.length > 0 && <FilesPreview files={files} showList={showList} onRemove={onRemove} type={type} />}
      </Box>

      {type !== DropzopType.standard && files && files.length > 0 && (
        <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ mt: 0 }}>
          {/* <Button color="inherit" size="small" onClick={onRemoveAll}>
            Remove File
          </Button> */}
          <LoadingButton
            size="small"
            variant="contained"
            color="success"
            loading={faqUploading}
            loadingPosition="start"
            startIcon={<CloudPlus />}
            onClick={async () => {
              const data = new FormData();
              data.append('file', files[0]);
              try {
                setFaqUploading(true);
                const payload = { issuer_id, data };
                const response = await UploadFAQ(payload);

                if (response.status === 200) {
                  setFieldValue('files', null);
                  const issuerPayload = {
                    method_name: 'getall'
                  };
                  const issuer = await GetIssuerData(issuerPayload);

                  const faqPanel = issuer.map((el) => {
                    return {
                      ...el,
                      faqs:
                        el.faqs &&
                        el.faqs.map((fa, index) => {
                          return { ...fa, panelName: `panel${index}` };
                        })
                    };
                  });
                  setIssuerData(faqPanel);

                  handleIssuerChange(faqPanel, issuer_id, setFieldValue);
                }
              } catch (err) {
                console.log(err);
              } finally {
                setFaqUploading(false);
                handleOpenUploadDialog();
              }
            }}
          >
            Upload files
          </LoadingButton>
        </Stack>
      )}
    </>
  );
};

MultiFileUpload.propTypes = {
  error: PropTypes.bool,
  showList: PropTypes.bool,
  files: PropTypes.array,
  setFieldValue: PropTypes.func,
  onUpload: PropTypes.func,
  sx: PropTypes.object,
  type: PropTypes.string
};

export default MultiFileUpload;
