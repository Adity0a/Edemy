import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/student/Loading'
import { assets } from '../../assets/assets'

const CourseDetail = () => {

  const { id } = useParams()
  const { allCourses, calculateRating, currency } = useContext(AppContext)
  const [courseData, setCourseData] = useState(null)
  const [openSections, setOpenSections] = useState({})
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false)

  const fetchCourseData = async () => {
    const findCourse = allCourses.find(course => course._id === id)
    setCourseData(findCourse)
  }

  useEffect(() => {
    fetchCourseData()
  }, [allCourses, id])

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (!courseData) return <Loading />

  return (
    <>
      <div className='flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-20 pt-10 text-left'>

        <div className='absolute top-0 left-0 w-full h-[500px] -z-1 bg-gradient-to-b from-cyan-100/70'></div>

        {/* Left Column */}
        <div className='max-w-xl z-10'>
          <h1 className='md:text-4xl text-2xl text-gray-800 font-semibold'>{courseData.courseTitle}</h1>
          <p className='pt-4 md:text-base text-sm' dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) }}></p>

          {/* Review and Rating */}
          <div className='flex items-center space-x-2 pt-3 pb-1 text-sm'>
            <p className='text-orange-500 font-semibold'>{calculateRating(courseData)}</p>
            <div className='flex'>
              {[...Array(5)].map((_, i) => (
                <img key={i} src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank} alt='rating' className='w-3.5 h-3.5' />
              ))}
            </div>
            <p className='text-blue-600'>( {courseData.courseRatings.length} {courseData.courseRatings.length > 1 ? 'ratings' : 'rating'} )</p>
            <p className='text-gray-500'>{courseData.enrolledStudents.length} {courseData.enrolledStudents.length > 1 ? 'students' : 'student'}</p>
          </div>

          <p className='text-sm'>Course by <span className='text-blue-600 underline'>Richard James</span></p>

          <div className='pt-8 text-gray-800'>
            <h2 className='text-xl font-semibold'>Course Structure</h2>
            <p className='pt-2 text-sm text-gray-500'>
              {courseData.courseContent.length} sections • {courseData.courseContent.reduce((total, chapter) => total + chapter.chapterContent.length, 0)} lectures • 27h 25m total duration
            </p>

            <div className='mt-4 border border-gray-300 rounded-md overflow-hidden'>
              {courseData.courseContent.map((chapter, index) => (
                <div key={index} className='border-b border-gray-300 last:border-b-0'>
                  <div className='flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer select-none' onClick={() => toggleSection(index)}>
                    <div className='flex items-center gap-2'>
                      <img className={`transform transition-transform ${openSections[index] ? 'rotate-180' : ''}`} src={assets.down_arrow_icon} alt="arrow" />
                      <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                    </div>
                    <p className='text-sm md:text-base'>{chapter.chapterContent.length} lectures - 45 m</p>
                  </div>

                  {openSections[index] && (
                    <div className='bg-white px-4 py-2'>
                      {chapter.chapterContent.map((lecture, i) => (
                        <div key={i} className='flex items-center gap-2 py-2 border-b border-gray-100 last:border-b-0'>
                          <img src={assets.play_icon} alt="play" className='w-4 h-4' />
                          <div className='flex items-center justify-between w-full'>
                            <p className='text-sm text-gray-700'>{lecture.lectureTitle}</p>
                            <div className='flex items-center gap-2'>
                              {lecture.isPreviewFree && <p className='text-blue-600 cursor-pointer text-xs md:text-sm'>Preview</p>}
                              <p className='text-gray-500 text-xs md:text-sm'>{lecture.lectureDuration} mins</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className='py-20 text-sm md:text-base'>
            <h3 className='text-xl font-semibold text-gray-800'>Course Description</h3>
            <p className='pt-5' dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}></p>
          </div>
        </div>

        {/* Right Column */}
        <div className='max-w-[424px] z-10 shadow-lg rounded-lg overflow-hidden bg-white min-w-[300px]'>
          <img src={courseData.courseThumbnail} alt="Thumbnail" />
          <div className='p-5'>
            <div className='flex items-center gap-2 pt-2'>
              <img className='w-3.5' src={assets.time_left_clock_icon} alt="clock" />
              <p className='text-red-500'><span className='font-medium'>5 days</span> left at this price!</p>
            </div>
            <div className='flex gap-3 items-center pt-2'>
              <p className='md:text-4xl text-2xl font-semibold text-gray-800'>{currency}{(courseData.coursePrice - (courseData.discount * courseData.coursePrice) / 100).toFixed(2)}</p>
              <p className='md:text-lg text-gray-500 line-through'>{currency}{courseData.coursePrice}</p>
              <p className='md:text-lg text-gray-500'>{courseData.discount}% off</p>
            </div>

            <div className='flex items-center text-sm md:text-base gap-4 pt-2 md:pt-4 text-gray-500'>
              <div className='flex items-center gap-1'>
                <img src={assets.star} alt="star icon" />
                <p>{calculateRating(courseData)}</p>
              </div>
              <div className='h-4 w-px bg-gray-500/40'></div>
              <div className='flex items-center gap-1'>
                <img src={assets.time_clock_icon} alt="clock icon" />
                <p>22 hours</p>
              </div>
              <div className='h-4 w-px bg-gray-500/40'></div>
              <div className='flex items-center gap-1'>
                <img src={assets.lesson_icon} alt="lesson icon" />
                <p>{courseData.courseContent.reduce((total, chapter) => total + chapter.chapterContent.length, 0)} lessons</p>
              </div>
            </div>

            <button className='md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium'>
              {isAlreadyEnrolled ? 'Already Enrolled' : 'Enroll Now'}
            </button>

            <div className='pt-6'>
              <p className='md:text-xl text-lg font-medium text-gray-800'>What's in the course?</p>
              <ul className='ml-4 pt-2 text-sm md:text-base list-disc text-gray-500'>
                <li>Lifetime access with free updates.</li>
                <li>Step-by-step, hands-on project guidance.</li>
                <li>Downloadable resources and source code.</li>
                <li>Quizzes to test your knowledge.</li>
                <li>Certificate of completion.</li>
                <li>Soft skills and interview prep.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseDetail
