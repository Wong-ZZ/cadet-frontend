import { Card, Elevation } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { FlexDirectionProperty } from 'csstype';
import * as React from 'react';
import { useDropzone } from 'react-dropzone';

import { controlButton } from '../commons';

interface IDropzoneType {
  handleUploadAssessment: (file: File) => void;
}

// Dropzone styling
const dropZoneStyle = {
  baseStyle: {
    flex: 1,
    display: 'flex',
    height: '30vh',
    flexDirection: 'column' as FlexDirectionProperty,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
  },

  activeStyle: {
    borderColor: '#2196f3'
  },

  acceptStyle: {
    borderColor: '#00e676'
  },

  rejectStyle: {
    borderColor: '#ff1744'
  }
};

const MaterialDropzone: React.FC<IDropzoneType> = props => {
  const [file, setFile] = React.useState<File>();
  const [title, setTitle] = React.useState<string>();
  const handleConfirmUpload = () => {
    props.handleUploadAssessment(file!);
    setFile(undefined);
  };
  const handleCancelUpload = () => setFile(undefined);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    isFocused
  } = useDropzone({
    onDrop: acceptedFiles => {
      setFile(acceptedFiles[0]);
      setTitle(acceptedFiles[0].name);
    }
  });
  const style = React.useMemo(
    () => ({
      ...dropZoneStyle.baseStyle,
      ...(isDragActive ? dropZoneStyle.activeStyle : {}),
      ...(isDragAccept ? dropZoneStyle.acceptStyle : {}),
      ...(isDragReject ? dropZoneStyle.rejectStyle : {}),
      ...(isFocused ? dropZoneStyle.activeStyle : {})
    }),
    [isDragActive, isDragAccept, isDragReject, isFocused]
  );

  return (
    <>
      <Card className="contentdisplay-content" elevation={Elevation.THREE}>
        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
      </Card>
      {file && (
        <Card>
          <div>{title}</div>
          <br />
          {controlButton('Confirm Upload', IconNames.UPLOAD, handleConfirmUpload)}
          {controlButton('Cancel Upload', IconNames.DELETE, handleCancelUpload)}
        </Card>
      )}
    </>
  );
};

export default MaterialDropzone;
