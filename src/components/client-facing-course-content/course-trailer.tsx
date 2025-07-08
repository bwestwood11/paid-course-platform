"use client"
import React from 'react'
import MuxPlayer from '../mux-player'

const CourseClientTrailer = ({trailerMuxPlaybackId, thumbnail}: {trailerMuxPlaybackId:string, thumbnail:string}) => {
  return (
    <div>
           <MuxPlayer
                playbackId={trailerMuxPlaybackId}
                className="w-full"
                autoPlay={false}
                poster={thumbnail}
              />
    </div>
  )
}

export default CourseClientTrailer