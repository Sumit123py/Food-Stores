import React from 'react'
import { useNavigate } from 'react-router-dom'

const Video = () => {
    const navigate = useNavigate()
  return (
    <div className='videoContainer'>

        <video src="https://iiokcprfxttdlszwhpma.supabase.co/storage/v1/object/public/video/km_20240901_1080p_30f_20240901_121136.mp4?t=2024-09-01T06%3A48%3A31.314Z" controls autoPlay></video>

        <p onClick={() => navigate('/registration')} className='skip'>Skip Video</p>
      
    </div>
  )
}

export default Video
