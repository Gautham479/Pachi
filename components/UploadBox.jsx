"use client";

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Box, CheckCircle } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function UploadBox() {
  const { selectedFile, setSelectedFile } = useStore();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, [setSelectedFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'model/stl': ['.stl'],
      'text/plain': ['.obj']
    },
    maxFiles: 1
  });

  return (
    <div className="flex flex-col h-full bg-surface-card rounded-2xl border border-surface-border p-6 shadow-xl relative min-h-[400px]">
      <div className="flex items-center gap-2 mb-4 text-white font-bold pb-2">
        <Upload className="w-5 h-5 text-primary-500" />
        <span>Upload Model</span>
      </div>

      <div 
        {...getRootProps()} 
        className={`flex-1 flex flex-col items-center justify-center p-12 w-full rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer
          ${isDragActive ? 'border-primary-500 bg-primary-500/5' : 'border-surface-border hover:border-primary-500/50 hover:bg-surface-border/20'}
        `}
      >
        <input {...getInputProps()} />
        
        {selectedFile ? (
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 bg-accent-500/20 text-accent-500 rounded-full flex items-center justify-center mb-2">
              <CheckCircle size={40} />
            </div>
            <div>
              <p className="text-white font-bold text-xl">{selectedFile.name}</p>
              <p className="text-sm text-[#DCD1CC] mt-2">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <p className="text-sm text-primary-500 mt-4 font-bold tracking-wide">Click or drag here to upload a different file</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 border-2 border-surface-border text-primary-500 rounded-full flex items-center justify-center shadow-inner mb-4 bg-surface-bg transition-transform group-hover:scale-105">
              <Upload size={36} />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-white tracking-wide">Drop Your STL File Here</h3>
              <p className="text-base text-[#8B8581] mt-3">or click to browse files</p>
              <p className="text-xs text-[#8B8581] mt-3 uppercase tracking-wider font-bold">STL files only, up to 100MB</p>
            </div>
            <p className="text-sm text-[#8B8581] mt-6 font-medium">1000+ models quoted this month</p>
          </div>
        )}
      </div>
    </div>
  );
}
