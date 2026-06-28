import React from "react";
import { Route, Routes, useMatch } from "react-router-dom";
import CourseList from "./pages/student/CourseList";
import Home from "./pages/student/Home";
import CourseDetail from "./pages/student/CourseDetail";
import MyEnrollments from "./pages/student/MyEnrollments";
import PaymentPage from "./pages/student/PaymentPage";
import Player from "./pages/student/Player";
import Loading from "./components/student/Loading";
import Educator from "./pages/educator/Educator";
import AddCourse from "./pages/educator/AddCourse";
import MyCourses from "./pages/educator/MyCourses";
import StudentEnrolled from "./pages/educator/StudentEnrolled";
import Dashboard from "./pages/educator/Dashboard";
import Navbar from "./components/student/Navbar";
import Footer from "./components/student/Footer";

const App = () => {
  const isEducatorRoute = useMatch("/educator/*");

  return (
    <div className="text-default min-h-screen bg-white flex flex-col">
      {!isEducatorRoute && <Navbar />}
      <div className="flex-1">
        <Routes>
          //Student
          <Route path="/" element={<Home />} />
          <Route path="/course-list" element={<CourseList />} />
          <Route path="/course-list/:input" element={<CourseList />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/payment/:courseId" element={<PaymentPage />} />
          <Route path="/my-enrollments" element={<MyEnrollments />} />
          <Route path="/player/:courseId" element={<Player />} />
          <Route path="/loading/:path" element={<Loading />} />

          //Educator
          <Route path="/educator" element={<Educator />}>
            <Route index element={<Dashboard />} />
            <Route path="add-course" element={<AddCourse />} />
            <Route path="my-course" element={<MyCourses />} />
            <Route path="student-enrolled" element={<StudentEnrolled />} />
          </Route>
        </Routes>
      </div>
      {!isEducatorRoute && <Footer />}
    </div>
  );
};

export default App;
