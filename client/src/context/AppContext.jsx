import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export const AppContext = createContext()

export const AppContextProvider = (props)=>{

    const currency = import.meta.env.VITE_CURRENCY
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const navigate = useNavigate()
    const [allCourses, setAllCourses] = useState([])
    const [isEducator, setIsEducator] = useState(true)

    //Fetch all courses
    const fetchAllCourses = async()=>{
        try {
            if (!backendUrl) {
                console.error("❌ Error: VITE_BACKEND_URL is missing from .env file!");
                return;
            }
            const { data } = await axios.get(backendUrl + '/api/course/all')
            if (data.success) {
                setAllCourses(data.courses)
            } else {
                console.error("API Error:", data.message)
            }
        } catch (error) {
            console.error("Fetch Error:", error.message)
        }
    }

    // Function to calculate average rating of course
    const calculateRating = (course)=>{
        if(course.courseRatings.length === 0){
            return 0;
        }
        let totalRating = 0
        course.courseRatings.forEach(rating =>{
            totalRating += rating.rating
        })
        return totalRating / course.courseRatings.length
    }

    useEffect(()=>{
        fetchAllCourses()
    },[])

    const value = {
        currency, allCourses, navigate, calculateRating, isEducator, setIsEducator, backendUrl
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}