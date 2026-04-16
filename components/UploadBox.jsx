"use client";

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, CheckCircle, FileBox, Cpu } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 text-fg font-black pb-2">
        <div className="w-8 h-8 rounded-lg bg-primary-500/15 border border-primary-500/30 flex items-center justify-center">
          <Upload className="w-4 h-4 text-primary-500" />
        </div>
        <span>Upload Model</span>
      </div>

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`flex-1 flex flex-col items-center justify-center p-10 w-full rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer relative overflow-hidden min-h-[380px] ${
          isDragActive
            ? 'border-primary-500 bg-primary-500/10 shadow-lg'
            : 'border-surface-border hover:border-primary-500/50 hover:bg-primary-500/5 bg-surface-card/40 backdrop-blur-sm'
        }`}
        style={{
          boxShadow: isDragActive ? '0 0 30px rgba(99,102,241,0.2), inset 0 0 30px rgba(99,102,241,0.05)' : 'none',
        }}
      >
        <input {...getInputProps()} />

        {/* Animated grid */}
        <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

        {/* Corner accents */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-primary-500/40 rounded-tl-lg pointer-events-none" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-accent-500/40 rounded-tr-lg pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-accent-500/40 rounded-bl-lg pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-primary-500/40 rounded-br-lg pointer-events-none" />

        <AnimatePresence mode="wait">
          {selectedFile ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center text-center space-y-4 relative z-10"
            >
              {/* Success icon */}
              <motion.div
                className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ boxShadow: '0 0 20px rgba(34,197,94,0.2)' }}
              >
                <CheckCircle className="w-12 h-12 text-green-400" />
              </motion.div>

              <div>
                <p className="text-fg font-black text-xl">{selectedFile.name}</p>
                <p className="text-sm text-fg-muted mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-bold">
                <Cpu className="w-4 h-4" />
                Model loaded — price calculated
              </div>

              <p className="text-sm text-primary-500 font-bold">Click or drag here to upload a different file</p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center text-center space-y-5 relative z-10"
            >
              {/* Upload icon with orbit */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                {/* Orbit rings */}
                <motion.div
                  className="absolute inset-0 rounded-full border border-primary-500/20"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-2 rounded-full border border-accent-500/20"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                />

                {/* Icon */}
                <motion.div
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-primary-500/30 flex items-center justify-center"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ boxShadow: '0 0 20px rgba(99,102,241,0.2)' }}
                >
                  <FileBox className="w-10 h-10 text-primary-500" />
                </motion.div>

                {/* Orbiting dot */}
                <motion.div
                  className="absolute w-3 h-3 rounded-full bg-accent-500 shadow-lg"
                  style={{ top: '50%', left: '50%', marginTop: -6, marginLeft: -6 }}
                  animate={{
                    x: [0, 50, 0, -50, 0],
                    y: [-50, 0, 50, 0, -50],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                />
              </div>

              <div>
                <h3 className="text-2xl font-black text-fg tracking-tight">Drop Your STL File Here</h3>
                <p className="text-base text-fg-muted mt-2">or click to browse files</p>
                <p className="text-xs text-fg-subtle mt-2 uppercase tracking-widest font-bold">STL files only, up to 100MB</p>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-muted/60 border border-surface-border text-fg-subtle text-sm font-medium">
                <motion.span
                  className="w-2 h-2 rounded-full bg-green-400"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                1000+ models quoted this month
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Drag active overlay */}
        <AnimatePresence>
          {isDragActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-primary-500/10 backdrop-blur-sm rounded-2xl z-20"
            >
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="text-5xl mb-3"
                >
                  📦
                </motion.div>
                <p className="text-primary-500 font-black text-xl">Drop it!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
