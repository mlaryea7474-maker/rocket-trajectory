import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, Play, X, Film } from 'lucide-react'
import './PromoVideo.css'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay },
})

export default function PromoVideo() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  function loadFile(file: File) {
    if (!file.type.startsWith('video/')) return
    const url = URL.createObjectURL(file)
    setVideoSrc(url)
    setFileName(file.name)
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) loadFile(file)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) loadFile(file)
  }

  function clearVideo() {
    setVideoSrc(null)
    setFileName(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="pv-page">

      <motion.div className="section-header" {...fadeUp(0)}>
        <div>
          <h2 className="section-h2">
            <span className="bracket">[</span>PROMO VIDEO<span className="bracket">]</span>
          </h2>
          <p className="section-sub">Introductory video for the project</p>
        </div>
        <span className="section-tag">VIDEO · INTRO</span>
      </motion.div>

      {!videoSrc ? (
        <motion.div
          className={`pv-dropzone${dragging ? ' dragging' : ''}`}
          {...fadeUp(0.05)}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            className="pv-file-input"
            onChange={onFileChange}
          />
          <Film size={40} className="pv-drop-icon" strokeWidth={1.2} />
          <p className="pv-drop-title">Drop your video here</p>
          <p className="pv-drop-sub">or click to browse</p>
          <div className="pv-drop-btn">
            <Upload size={14} />
            <span>UPLOAD VIDEO</span>
          </div>
          <p className="pv-drop-hint">MP4, MOV, WebM — any video format</p>
        </motion.div>
      ) : (
        <motion.div
          className="pv-player-wrap"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="pv-player-header">
            <div className="pv-player-meta">
              <Play size={13} className="pv-play-icon" />
              <span className="pv-file-name">{fileName}</span>
            </div>
            <button className="pv-clear-btn" onClick={clearVideo} title="Remove video">
              <X size={14} />
              <span>REMOVE</span>
            </button>
          </div>

          <video
            ref={videoRef}
            className="pv-video"
            src={videoSrc}
            controls
            autoPlay={false}
          />

          <div className="pv-player-footer">
            <span className="pv-footer-label">PROMO VIDEO · CE 122 · ROCKET TRAJECTORY</span>
            <button
              className="pv-swap-btn"
              onClick={() => inputRef.current?.click()}
            >
              <Upload size={12} />
              <span>SWAP VIDEO</span>
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="video/*"
              className="pv-file-input"
              onChange={onFileChange}
            />
          </div>
        </motion.div>
      )}

    </div>
  )
}
