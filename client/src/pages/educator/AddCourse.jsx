import React, { useState } from 'react'
import { assets } from '../../assets/assets'

const AddCourse = () => {

  const [courseTitle, setCourseTitle] = useState('')
  const [courseHeadings, setCourseHeadings] = useState('')
  const [courseDescription, setCourseDescription] = useState('')
  const [coursePrice, setCoursePrice] = useState(0)
  const [image, setImage] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Add logic to save course
    console.log({ courseTitle, courseHeadings, courseDescription, coursePrice, image })
  }

  return (
    <div className='max-w-4xl w-full'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-6 text-gray-700 text-left'>

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

        <button type='submit' className='bg-black text-white w-32 py-3 rounded-md font-medium hover:bg-gray-800 transition-all'>
          ADD
        </button>

      </form>
    </div>
  )
}

export default AddCourse
