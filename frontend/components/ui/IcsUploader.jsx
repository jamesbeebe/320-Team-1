'use client';

import React, { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import api from '@/services/api'

export default function IcsUploader() {
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    const isValidIcs =
      selectedFile.type === 'text/calendar' || selectedFile.name.endsWith('.ics')

    if (!isValidIcs) {
      setFile(null)
      setError('Please select a valid .ics file')
      return
    }

    setFile(selectedFile)
    const reader = new FileReader()
    
    reader.onload = async (event) => {
      const icsContent = event.target.result
      try {
        const response = await api.uploadIcs('/users/calendar/upload', icsContent)
        console.log('Upload successful:', response)
        if (response.parsed) {
          console.log('Parsed calendar data:', response.parsed)
        }
        setError(null)
      } catch (err) {
        console.error('Upload failed:', err)
        setError(err.message || 'Failed to upload calendar file')
      }
    }

    reader.readAsText(selectedFile)
  }

  return (
    <Card className="w-full max-w-2xl p-8">

<Input
  type="file"
  accept=".ics,text/calendar"
  onChange={handleFileChange}
  hidden
  id="ics-upload"
/>
      <label htmlFor = "ics-upload">
        <Button  as = "span" width = "550px">
          Choose File
        </Button>
      </label>
    </Card>
  )
}