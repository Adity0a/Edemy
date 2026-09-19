import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { useAuth, useUser } from '@clerk/react'
import Loading from '../../components/student/Loading'
import { assets } from '../../assets/assets'

const PaymentPage = () => {

    const { courseId } = useParams()
    const { backendUrl, currency, allCourses } = useContext(AppContext)
    const { getToken } = useAuth()
    const { user } = useUser()
    const navigate = useNavigate()

    const [courseData, setCourseData] = useState(null)
    const [paymentMethod, setPaymentMethod] = useState('card')
    const [loading, setLoading] = useState(false)

    const fetchCourseData = () => {
        const course = allCourses.find(c => c._id === courseId)
        if (course) {
            setCourseData(course)
        }
    }

    useEffect(() => {
        if (allCourses.length > 0) {
            fetchCourseData()
        }
    }, [allCourses, courseId])

    const handlePayment = async () => {
        try {
            if (!user) return;
            setLoading(true)
            const token = await getToken()

            // Step 1: Create Razorpay Order on Backend
            const { data } = await axios.post(backendUrl + '/api/user/create-order', { courseId }, {
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
                            courseId
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

    if (!courseData) return <Loading />

    return (
        <div className='flex flex-col items-center justify-center min-h-[80vh] px-8'>
            <div className='max-w-md w-full bg-white shadow-lg rounded-lg p-8 border border-gray-100'>
                <h1 className='text-2xl font-bold text-gray-800 mb-6 text-center'>Select Payment Method</h1>

                <div className='mb-6'>
                    <div className='flex items-center gap-4 mb-4'>
                        <img src={courseData.courseThumbnail} alt="" className='w-20 rounded shadow-sm' />
                        <div>
                            <p className='font-semibold text-gray-700'>{courseData.courseTitle}</p>
                            <p className='text-blue-600 font-bold'>{currency}{(courseData.coursePrice - (courseData.discount * courseData.coursePrice) / 100).toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className='space-y-4 mb-8'>
                    <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                        <div className='flex items-center gap-3'>
                            <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className='hidden' />
                            <span className='font-medium text-gray-700'>Card</span>
                        </div>
                        <div className='flex gap-2'>
                            <img src={assets.card_icon || ''} alt="" className='h-5' />
                        </div>
                    </label>

                    <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                        <div className='flex items-center gap-3'>
                            <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className='hidden' />
                            <span className='font-medium text-gray-700'>UPI</span>
                        </div>
                    </label>

                    <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'netbanking' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                        <div className='flex items-center gap-3'>
                            <input type="radio" name="payment" value="netbanking" checked={paymentMethod === 'netbanking'} onChange={() => setPaymentMethod('netbanking')} className='hidden' />
                            <span className='font-medium text-gray-700'>Net Banking</span>
                        </div>
                    </label>
                </div>

                <button
                    onClick={handlePayment}
                    disabled={loading}
                    className='w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300'
                >
                    {loading ? 'Processing...' : `Pay ${currency}${(courseData.coursePrice - (courseData.discount * courseData.coursePrice) / 100).toFixed(2)} Now`}
                </button>

                <p className='text-center text-xs text-gray-400 mt-4 italic'>Secure payment powered by Razorpay Test Mode.</p>
            </div>
        </div>
    )
}

export default PaymentPage
