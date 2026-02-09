'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, FileVideo, FileImage, File } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FileUploaderProps {
  onUpload: (url: string) => void
  accept?: string
  maxSizeMB?: number
  label?: string
}

export function FileUploader({
  onUpload,
  accept = 'image/*,video/*',
  maxSizeMB = 50,
  label = 'Upload File',
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = useCallback(async (file: File) => {
    setError(null)

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large. Maximum size is ${maxSizeMB}MB.`)
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Upload failed')
      }

      const data = await res.json()
      setPreview(data.url)
      onUpload(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [maxSizeMB, onUpload])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(file)
  }, [handleUpload])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }, [handleUpload])

  const getIcon = () => {
    if (accept.includes('video')) return <FileVideo className="w-8 h-8 text-gray-400" />
    if (accept.includes('image')) return <FileImage className="w-8 h-8 text-gray-400" />
    return <File className="w-8 h-8 text-gray-400" />
  }

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          dragOver 
            ? 'border-eand-red bg-red-50 scale-[1.02]' 
            : 'border-gray-200 hover:border-eand-ocean/30 hover:bg-gray-50'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-2">
          {uploading ? (
            <div className="w-8 h-8 border-2 border-eand-red border-t-transparent rounded-full animate-spin" />
          ) : (
            getIcon()
          )}
          <p className="text-sm text-gray-600">
            {uploading ? 'Uploading...' : `Drag & drop or click to ${label.toLowerCase()}`}
          </p>
          <p className="text-xs text-gray-400">Max {maxSizeMB}MB</p>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {preview && (
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
          <span className="text-sm text-gray-600 truncate flex-1">{preview}</span>
          <button
            onClick={(e) => { e.stopPropagation(); setPreview(null) }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
