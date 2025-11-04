import React, { useState } from 'react';
import Button from './Button';
import Card from './Card';
import Input from './Input';
import { uploadICSFile } from '../../services/ics'; // Import the upload function

export default function IcsFileUpload({ onFileSelect }) {
  const [fileName, setFileName] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.ics')) {
        setFileName(file.name);
        if (onFileSelect) onFileSelect(file);

        try {
          const data = await uploadICSFile(file);
          console.log('File uploaded successfully:', data);
        } catch (error) {
          console.error('Error uploading file:', error);
          alert('Failed to upload file');
        }
    } else {
      alert('Please upload a valid .ics file');
      e.target.value = null;
      setFileName('');
    }
  }

  const handleButtonClick = () => {
    document.getElementById('ics-file-input').click();
  }

  return (
    <Card className="p-6 w-full max-w-md mx-auto text-center">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Upload Calendar File (.ics)
      </h2>
      <input
        id="ics-file-input"
        type="file"
        accept=".ics"
        onChange={handleFileChange}
        className="hidden"
      />

      <Button onClick={handleButtonClick} variant="primary">
        Choose .ics File
      </Button>

      {fileName && (
        <p className="mt-4 text-sm text-gray-700">
          Selected file: <span className="font-medium">{fileName}</span>
        </p>
      )}
    </Card>
  )
}