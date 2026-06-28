# Implementation Plan - Course Enrollment, Payment Flow, and Auth Fixes

This plan outlines the changes required to implement a dummy payment flow and fix authorization issues.

## Proposed Changes

### Backend (Server)

#### [userController.js](file:///C:/Users/ADITYA/AndroidStudioProjects/onlineCourse/server/controllers/userController.js)
- Implement `purchaseCourse` function to handle course enrollment.
- Update `getUserData` and `userEnrolledCourses` to be more resilient.

#### [educatorController.js](file:///C:/Users/ADITYA/AndroidStudioProjects/onlineCourse/server/controllers/educatorController.js)
- Add null checks for populated fields in `educatorDashboardData` and `getEnrolledStudents` to prevent crashes if user data is missing.

#### [userRoutes.js](file:///C:/Users/ADITYA/AndroidStudioProjects/onlineCourse/server/routes/userRoutes.js)
- Add a POST route `/purchase` that calls `purchaseCourse`.

---

### Frontend (Client)

#### [PaymentPage.jsx](file:///C:/Users/ADITYA/AndroidStudioProjects/onlineCourse/client/src/pages/student/PaymentPage.jsx)
- Send `userid` header in the purchase request to satisfy the placeholder auth middleware.
- Import and use `useUser` from Clerk.

#### [CourseDetail.jsx](file:///C:/Users/ADITYA/AndroidStudioProjects/onlineCourse/client/src/pages/student/CourseDetail.jsx)
- Send `userid` header when checking enrollment status.

#### [MyEnrollments.jsx](file:///C:/Users/ADITYA/AndroidStudioProjects/onlineCourse/client/src/pages/student/MyEnrollments.jsx)
- Send `userid` header when fetching enrolled courses.
- Use `useUser` to get the user ID.

## Verification Plan

### Manual Verification
1. **Enrollment Flow**:
    - Log in as a student.
    - Navigate to a course detail page.
    - Click "Enroll Now".
    - Verify redirection to `PaymentPage`.
    - Select a payment method and click "Pay Now".
    - Verify redirection to `MyEnrollments` (no "Not Authorized" error).
2. **Educator Dashboard**:
    - Verify that "My Courses" and "Student Enrolled" no longer throw errors.
    - **Note**: If data is still empty, ensure `node seedCourses.js` has been run and the `REAL_USER_ID` in that file matches your Clerk ID.
