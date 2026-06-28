import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import YouTube from 'react-youtube'
import axios from 'axios'
import { useAuth, useUser } from '@clerk/react'
import Loading from '../../components/student/Loading'
import Footer from '../../components/student/Footer'

const Player = () => {

  const { courseId } = useParams()
  const { backendUrl, calculateRating } = useContext(AppContext)
  const { getToken } = useAuth()
  const { user } = useUser()

  const [courseData, setCourseData] = useState(null)
  const [openSections, setOpenSections] = useState({})
  const [playerData, setPlayerData] = useState(null)
  const [progressData, setProgressData] = useState(null)
  const [rating, setRating] = useState(0)

  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/course/' + courseId)
      if (data.success) {
        setCourseData(data.courseData)
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const fetchProgress = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.post(backendUrl + '/api/user/get-progress', { courseId }, {
        headers: { Authorization: `Bearer ${token}`, userid: user.id }
      })
      if (data.success) {
        setProgressData(data.progressData)
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  const markComplete = async (lectureId) => {
    try {
      const token = await getToken()
      const { data } = await axios.post(backendUrl + '/api/user/update-progress', { courseId, lectureId }, {
        headers: { Authorization: `Bearer ${token}`, userid: user.id }
      })
      if (data.success) {
        fetchProgress()
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*)/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  useEffect(() => {
    fetchCourseData()
  }, [courseId])

  useEffect(() => {
    if (user) {
      fetchProgress()
    }
  }, [user, courseId])

  if (!courseData) return <Loading />

  return (
    <>
      <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36'>

        {/* Left Column */}
        <div className='text-gray-800'>
          <h2 className='text-xl font-semibold'>Course Structure</h2>

          <div className='mt-5 border border-gray-300 rounded-md overflow-hidden'>
            {courseData.courseContent && courseData.courseContent.map((chapter, index) => (
              <div key={index} className='border-b border-gray-300 last:border-b-0'>
                <div className='flex items-center justify-between px-4 py-3 bg-white cursor-pointer select-none' onClick={() => toggleSection(index)}>
                  <div className='flex items-center gap-2'>
                    <img className={`transform transition-transform ${openSections[index] ? 'rotate-180' : ''}`} src={assets.down_arrow_icon} alt="arrow" />
                    <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                  </div>
                  <p className='text-sm md:text-base'>{chapter.chapterContent.length} lectures - {chapter.chapterContent.reduce((total, lecture) => total + lecture.lectureDuration, 0)} minutes</p>
                </div>

                {openSections[index] && (
                  <div className='bg-white px-4 py-2 border-t border-gray-200'>
                    {chapter.chapterContent.map((lecture, i) => (
                      <div key={i} className='flex items-center gap-2 py-2 border-b border-gray-100 last:border-b-0'>
                        <img src={progressData && progressData.completedLectures.includes(lecture.lectureId) ? assets.blue_tick_icon : assets.play_icon} alt="play" className='w-4 h-4' />
                        <div className='flex items-center justify-between w-full'>
                          <p className='text-sm text-gray-700'>{lecture.lectureTitle}</p>
                          <div className='flex items-center gap-2'>
                            <p onClick={() => setPlayerData({ ...lecture, chapter: index + 1, lecture: i + 1 })} className='text-blue-600 cursor-pointer text-xs md:text-sm'>Watch</p>
                            <p className='text-gray-500 text-xs md:text-sm'>{lecture.lectureDuration} minutes</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className='flex items-center gap-2 py-3 mt-10'>
            <h1 className='text-xl font-semibold'>Rate this Course:</h1>
            <div className='flex items-center gap-1'>
              {[...Array(5)].map((_, i) => (
                <img key={i} onClick={() => setRating(i + 1)} src={i < rating ? assets.star : assets.star_blank} alt='' className='cursor-pointer h-5 w-5' />
              ))}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className='md:mt-10'>
          {playerData ? (
            <div className='flex flex-col gap-4'>
              <div className='w-full aspect-video'>
                <YouTube videoId={getYouTubeId(playerData.lectureUrl)} opts={{ playerVars: { autoplay: 1 }, width: '100%', height: '100%' }} className='w-full h-full' />
              </div>
              <div className='flex justify-between items-center py-1'>
                <p className='text-lg font-medium'>{playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}</p>
                <button onClick={() => markComplete(playerData.lectureId)} className='text-blue-600 font-medium hover:underline'>
                  {progressData && progressData.completedLectures.includes(playerData.lectureId) ? 'Completed' : 'Mark Complete'}
                </button>
              </div>
            </div>
          ) : (
            <img src={courseData.courseThumbnail} alt="" className='w-full rounded-lg shadow-md' />
          )}
        </div>

      </div>
      <Footer />
    </>
  )
}

export default Player
