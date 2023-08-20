'use client'

import { CldUploadWidget } from 'next-cloudinary'

const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

const ImageUpload = ({ onChange, value }) => {
  const handleUpload = result => {
    onChange(result.info.secure_url)
  }

  return (
    <CldUploadWidget
      onUpload={handleUpload}
      uploadPreset={uploadPreset}
      options={{
        maxFiles: 1,
      }}
    >
      {({ open }) => {
        return (
          <div>
            <button onClick={() => open?.()}>Upload Image</button>
            {value && 'Image Upload Success!'}
          </div>
        )
      }}
    </CldUploadWidget>
  )
}

export default ImageUpload
