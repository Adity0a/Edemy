import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import uniqid from 'uniqueid'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { useAuth, useUser } from '@clerk/react'

const AddCourse = () => {

  const { backendUrl } = useContext(AppContext)
  const { getToken } = useAuth()
  const { user } = useUser()

  const [courseTitle, setCourseTitle] = useState('')
  const [courseHeadings, setCourseHeadings] = useState('')
  const [courseDescription, setCourseDescription] = useState('')
  const [coursePrice, setCoursePrice] = useState(0)
  const [image, setImage] = useState(false)

  const [chapters, setChapters] = useState([])
  const [showChapterModal, setShowChapterModal] = useState(false)
  const [chapterTitleInput, setChapterTitleInput] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const [currentChapterId, setCurrentChapterId] = useState(null)

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    isPreviewFree: false
  })

  const handleChapterAction = (action, chapterId) => {
    if (action === 'add') {
      setShowChapterModal(true)
    } else if (action === 'remove') {
      setChapters(chapters.filter(chapter => chapter.chapterId !== chapterId))
    } else if (action === 'toggle') {
      setChapters(chapters.map(chapter =>
        chapter.chapterId === chapterId ? { ...chapter, isOpen: !chapter.isOpen } : chapter
      ))
    }
  }

  const addChapter = () => {
    if (chapterTitleInput) {
      const newChapter = {
        chapterId: Math.random().toString(36).substr(2, 9),
        chapterTitle: chapterTitleInput,
        chapterContent: [],
        chapterOrder: chapters.length + 1,
        isOpen: true
      }
      setChapters([...chapters, newChapter])
      setChapterTitleInput('')
      setShowChapterModal(false)
    }
  }

  const handleLectureAction = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId)
      setShowPopup(true)
    } else if (action === 'remove') {
      setChapters(chapters.map(chapter => {
        if (chapter.chapterId === chapterId) {
          chapter.chapterContent.splice(lectureIndex, 1)
        }
        return chapter
      }))
    }
  }

  const addLecture = () => {
    setChapters(chapters.map(chapter => {
      if (chapter.chapterId === currentChapterId) {
        const newLecture = {
          ...lectureDetails,
          lectureOrder: chapter.chapterContent.length + 1,
          lectureId: Math.random().toString(36).substr(2, 9)
        }
        chapter.chapterContent.push(newLecture)
      }
      return chapter
    }))
    setShowPopup(false)
    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      isPreviewFree: false
    })
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      if (!user) return;
      const token = await getToken()

      const courseData = {
        courseTitle,
        courseDescription,
        coursePrice: Number(coursePrice),
        courseContent: chapters.map(chapter => ({
          chapterId: chapter.chapterId,
          chapterTitle: chapter.chapterTitle,
          chapterOrder: chapter.chapterOrder,
          chapterContent: chapter.chapterContent.map(lecture => ({
            lectureId: lecture.lectureId,
            lectureTitle: lecture.lectureTitle,
            lectureDuration: Number(lecture.lectureDuration),
            lectureUrl: lecture.lectureUrl,
            isPreviewFree: lecture.isPreviewFree,
            lectureOrder: lecture.lectureOrder
          }))
        })),
        courseThumbnail: image ? URL.createObjectURL(image) : ''
      }

      console.log("Submitting Course Data:", courseData);

      const { data } = await axios.post(backendUrl + '/api/educator/add-course', {
        courseData: JSON.stringify(courseData)
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          userid: user.id
        }
      })

      if (data.success) {
        alert(data.message)
        setCourseTitle('')
        setCourseDescription('')
        setCoursePrice(0)
        setChapters([])
        setImage(false)
      } else {
        alert(data.message)
      }
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div className='max-w-4xl w-full'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-6 text-gray-700 text-left pb-10'>

        <div className='flex flex-col gap-2'>
          <p className='font-medium'>Course Title</p>
          <input
            type="text"
            placeholder='Type here'
            className='border border-gray-300 outline-none px-4 py-2.5 rounded-md focus:border-indigo-500 transition-all'
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            required
          />
        </div>

        <div className='flex flex-col gap-2'>
          <p className='font-medium'>Course Headings</p>
          <input
            type="text"
            placeholder='Type here'
            className='border border-gray-300 outline-none px-4 py-2.5 rounded-md focus:border-indigo-500 transition-all'
            value={courseHeadings}
            onChange={(e) => setCourseHeadings(e.target.value)}
            required
          />
        </div>

        <div className='flex flex-col gap-2'>
          <p className='font-medium'>Course Description</p>
          <textarea
            rows={4}
            placeholder='Type here'
            className='border border-gray-300 outline-none px-4 py-2.5 rounded-md focus:border-indigo-500 transition-all resize-none'
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            required
          />
        </div>

        <div className='flex items-center justify-between gap-4 flex-wrap'>
          <div className='flex flex-col gap-2'>
            <p className='font-medium'>Course Price</p>
            <input
              type="number"
              placeholder='0'
              className='border border-gray-300 outline-none px-4 py-2.5 rounded-md focus:border-indigo-500 transition-all w-32'
              value={coursePrice}
              onChange={(e) => setCoursePrice(e.target.value)}
              required
            />
          </div>

          <div className='flex items-center gap-4'>
            <p className='font-medium'>Course Thumbnail</p>
            <label htmlFor="course-thumbnail" className='flex items-center gap-3 cursor-pointer'>
               <img src={assets.file_upload_icon} alt="" className='p-3 bg-blue-500 rounded-lg' />
               <input type="file" id="course-thumbnail" hidden onChange={(e) => setImage(e.target.files[0])} accept='image/*' />
               {image && <img className='max-h-10' src={URL.createObjectURL(image)} alt="" />}
            </label>
          </div>
        </div>

        <div className='flex flex-col gap-4'>
          {chapters.map((chapter, chapterIndex) => (
            <div key={chapterIndex} className='bg-white border rounded-lg overflow-hidden'>
               <div className='flex items-center justify-between px-4 py-3 bg-gray-50 border-b cursor-pointer' onClick={() => handleChapterAction('toggle', chapter.chapterId)}>
                  <div className='flex items-center gap-2'>
                    <img className={`w-2.5 transform transition-transform ${chapter.isOpen ? 'rotate-180' : ''}`} src={assets.dropdown_icon} alt="" />
                    <p className='font-medium'>{chapterIndex + 1} {chapter.chapterTitle}</p>
                  </div>
                  <div className='flex items-center gap-5'>
                    <p className='text-sm text-gray-500'>{chapter.chapterContent.length} Lectures</p>
                    <img onClick={(e) => { e.stopPropagation(); handleChapterAction('remove', chapter.chapterId) }} src={assets.cross_icon} alt="" className='w-2.5 cursor-pointer' />
                  </div>
               </div>

               {chapter.isOpen && (
                 <div className='p-4'>
                    {chapter.chapterContent.map((lecture, lectureIndex) => (
                      <div key={lectureIndex} className='flex items-center justify-between mb-2'>
                         <p>{lectureIndex + 1} {lecture.lectureTitle} - {lecture.lectureDuration} mins - <a href={lecture.lectureUrl} target="_blank" className='text-blue-500'>Link</a> - {lecture.isPreviewFree ? 'Free Preview' : 'Paid'}</p>
                         <img src={assets.cross_icon} alt="" className='w-2.5 cursor-pointer' onClick={() => handleLectureAction('remove', chapter.chapterId, lectureIndex)} />
                      </div>
                    ))}
                    <div className='inline-flex items-center gap-2 mt-2 cursor-pointer text-gray-500' onClick={() => handleLectureAction('add', chapter.chapterId)}>
                       <img src={assets.add_icon} alt="" className='w-4' />
                       <p>Add Lecture</p>
                    </div>
                 </div>
               )}
            </div>
          ))}

          <div className='flex justify-center items-center bg-blue-100/70 p-2 rounded-lg cursor-pointer' onClick={() => handleChapterAction('add')}>
             <p className='text-blue-600 font-semibold'>+ Add Chapter</p>
          </div>
        </div>

        {showChapterModal && (
          <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center'>
            <div className='bg-white p-8 rounded-lg w-full max-w-md relative'>
              <h2 className='text-2xl font-semibold mb-4'>Add Chapter</h2>
              <img onClick={() => setShowChapterModal(false)} src={assets.cross_icon} alt="" className='absolute top-4 right-4 w-4 cursor-pointer' />
              <div className='flex flex-col gap-4'>
                <div>
                  <p>Chapter Name</p>
                  <input type="text" className='w-full border p-2 rounded mt-1' value={chapterTitleInput} onChange={e => setChapterTitleInput(e.target.value)} placeholder="e.g. Introduction" />
                </div>
                <button type='button' className='bg-blue-600 text-white w-full py-2 rounded font-medium' onClick={addChapter}>Add</button>
              </div>
            </div>
          </div>
        )}

        {showPopup && (
          <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center'>
             <div className='bg-white p-8 rounded-lg w-full max-w-md relative'>
                <h2 className='text-2xl font-semibold mb-4'>Add Lecture</h2>
                <img onClick={() => setShowPopup(false)} src={assets.cross_icon} alt="" className='absolute top-4 right-4 w-4 cursor-pointer' />
                <div className='flex flex-col gap-4'>
                   <div>
                      <p>Lecture Title</p>
                      <input type="text" className='w-full border p-2 rounded mt-1' value={lectureDetails.lectureTitle} onChange={e => setLectureDetails({...lectureDetails, lectureTitle: e.target.value})} />
                   </div>
                   <div>
                      <p>Duration (minutes)</p>
                      <input type="number" className='w-full border p-2 rounded mt-1' value={lectureDetails.lectureDuration} onChange={e => setLectureDetails({...lectureDetails, lectureDuration: e.target.value})} />
                   </div>
                   <div>
                      <p>Lecture URL</p>
                      <input type="text" className='w-full border p-2 rounded mt-1' value={lectureDetails.lectureUrl} onChange={e => setLectureDetails({...lectureDetails, lectureUrl: e.target.value})} />
                   </div>
                   <div className='flex items-center gap-2'>
                      <p>Is Preview Free?</p>
                      <input type="checkbox" checked={lectureDetails.isPreviewFree} onChange={e => setLectureDetails({...lectureDetails, isPreviewFree: e.target.checked})} />
                   </div>
                   <button type='button' className='bg-blue-600 text-white w-full py-3 rounded mt-2 font-medium' onClick={addLecture}>Add</button>
                </div>
             </div>
          </div>
        )}

        <button type='submit' className='bg-black text-white w-32 py-3 rounded-md font-medium hover:bg-gray-800 transition-all'>
          ADD
        </button>

      </form>
    </div>
  )
}

export default AddCourse
