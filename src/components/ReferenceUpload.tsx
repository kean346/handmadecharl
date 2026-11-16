import { useId, useState, type ChangeEvent } from 'react'
import { Upload, X, ImagePlus } from 'lucide-react'
import type { ReferenceImage } from '../types'

export default function ReferenceUpload({
  value,
  onChange,
  onBusyChange,
}: {
  value: ReferenceImage | null
  onChange: (value: ReferenceImage | null) => void
  onBusyChange?: (busy: boolean) => void
}) {
  const id = useId()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  function readFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setError('')
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please choose a JPG, PNG or WebP image.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Please choose an image smaller than 2 MB.')
      return
    }
    setLoading(true)
    onBusyChange?.(true)
    const reader = new FileReader()
    reader.onload = () => {
      onChange({ name: file.name, dataUrl: String(reader.result), type: file.type })
      setLoading(false)
      onBusyChange?.(false)
    }
    reader.onerror = () => {
      setError('The image could not be read. Please try again.')
      setLoading(false)
      onBusyChange?.(false)
    }
    reader.readAsDataURL(file)
  }
  return (
    <div className="reference-upload">
      <input
        className="visually-hidden"
        type="file"
        id={id}
        accept="image/png,image/jpeg,image/webp"
        onChange={readFile}
        aria-label="Upload a reference image"
        aria-describedby={`${id}-help`}
        disabled={loading}
      />
      {value ? (
        <div className="uploaded-reference">
          <img src={value.dataUrl} alt="Your uploaded design reference" />
          <span>
            <strong>{value.name}</strong>
            <small>Reference added to your demo enquiry</small>
          </span>
          <button
            type="button"
            className="icon-button"
            aria-label="Remove reference image"
            onClick={() => onChange(null)}
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <label className="upload-label" htmlFor={id}>
          <ImagePlus size={21} strokeWidth={1.3} />
          <span>
            {loading ? 'Reading your image…' : 'Add a design or reference'}
            <small>Optional · JPG, PNG or WebP · up to 2 MB</small>
          </span>
          <Upload size={16} />
        </label>
      )}
      <p id={`${id}-help`} className="upload-help">
        Images stay in this browser for the demo.
      </p>
      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
