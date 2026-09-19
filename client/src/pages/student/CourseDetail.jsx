import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import Loading from '../../components/student/Loading'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { useAuth, useUser } from '@clerk/react'

const CourseDetail = () => {

  const { id } = useParams()
  const { allCourses, calculateRating, currency, backendUrl, navigate } = useContext(AppContext)
  const { getToken } = useAuth()
  const { user } = useUser()
  const [courseData, setCourseData] = useState(null)
  const [openSections, setOpenSections] = useState({})
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchCourseData = async () => {

    try {
      const { data } = await axios.get(backendUrl + '/api/course/' + id)
      if (data.success) {
        setCourseData(data.courseData)
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  const checkEnrollment = async () => {
    try {
      if (!user) return;
      const token = await getToken()
      if (token) {
        const { data } = await axios.get(backendUrl + '/api/user/enrolled-courses', {
          headers: {
            Authorization: `Bearer ${token}`,
            userid: user.id
          }
        })
        if (data.success) {
          const enrolled = data.enrolledCourses.some(course => course._id === id)
          setIsAlreadyEnrolled(enrolled)
        }
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  useEffect(() => {
    fetchCourseData()
  }, [id])

  useEffect(() => {
    if (user) {
      checkEnrollment()
    }
  }, [id, user])

  const enrollCourse = async () => {
    try {
      if (!user) {
        alert("Please sign in to enroll");
        return;
      }

      setLoading(true)
      const token = await getToken()

      // Step 1: Create Razorpay Order on Backend
      const { data } = await axios.post(backendUrl + '/api/user/create-order', { courseId: id }, {
        headers: {
          Authorization: `Bearer ${token}`,
          userid: user.id
        }
      })

      if (!data.success) {
        alert(data.message || "Failed to create payment order");
        setLoading(false);
        return;
      }

      const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!RAZORPAY_KEY) {
        alert("Razorpay Key ID is missing! Please check your .env file and restart the development server.");
        setLoading(false);
        return;
      }

      // Step 2: Configure Razorpay Checkout Modal
      const options = {
        key: RAZORPAY_KEY,
        amount: data.amount,

        currency: data.currency,
        name: "Edemy Online Course",
        description: `Purchase of ${courseData.courseTitle}`,
        order_id: data.order_id,
        handler: async function (response) {
          try {
            setLoading(true);
            const verificationRes = await axios.post(backendUrl + '/api/user/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: id
            }, {
              headers: {
                Authorization: `Bearer ${token}`,
                userid: user.id
              }
            });

            if (verificationRes.data.success) {
              navigate('/my-enrollments');
            } else {
              alert(verificationRes.data.message || "Payment verification failed");
            }
          } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || error.message);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user.fullName || user.username || "",
          email: user.primaryEmailAddress?.emailAddress || "",
        },
        theme: {
          color: "#2563EB",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            alert("Payment cancelled by the user.");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        alert("Payment failed: " + response.error.description);
        setLoading(false);
      });
      rzp.open();

    } catch (error) {
      console.error(error.message)
      alert(error.response?.data?.message || error.message)
      setLoading(false)
    }
  }

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
              {courseData.courseContent ? courseData.courseContent.length : 0} sections • {courseData.courseContent ? courseData.courseContent.reduce((total, chapter) => total + chapter.chapterContent.length, 0) : 0} lectures • 27h 25m total duration
            </p>

            <div className='mt-4 border border-gray-300 rounded-md overflow-hidden'>
              {courseData.courseContent && courseData.courseContent.map((chapter, index) => (
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
                <p>{courseData.courseContent ? courseData.courseContent.reduce((total, chapter) => total + chapter.chapterContent.length, 0) : 0} lessons</p>
              </div>
            </div>

            <button onClick={() => isAlreadyEnrolled ? navigate(`/player/${courseData._id}`) : enrollCourse()} disabled={loading} className='md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium disabled:bg-blue-400'>
              {loading ? 'Processing...' : (isAlreadyEnrolled ? 'Already Enrolled' : 'Enroll Now')}
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
