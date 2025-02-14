// import React from 'react'
import { X } from 'lucide-react';
import { Input, useToast } from '@chakra-ui/react'
import { useRef, useState } from 'react'
import axios from "axios"
// import {useState} from 'react'

// eslint-disable-next-line react/prop-types
function Modal({onClose}) {
    const modalRef = useRef();


    const [formData,setFormData] = useState({
        fullname:"",
        address:"",
        contact:"",
        email:"",
        problem:"",
        date:"",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
    };

    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);
        try{
            const response = await axios.post("https://handy-house-services-backend.vercel.app/api/repairServices",formData, { timeout: 7000 })
            // alert(response.data.message)
            toast({
                title: response.data.message,
                status: "success",
                description: "Booking Confirmation email sent to your email Id",
                duration: 6000,
                isClosable: true,
            });

            setTimeout(() => {
                setLoading(false);
                onClose(); // Delay closing the modal
            }, 1000); 

        }catch (error) {
            console.error(error.response || error.message)
            alert("service booking failed, please book again")
            setLoading(false);
        }
        
    }

    return (
        <div ref={modalRef} className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
            <div className='flex flex-col gap-5 text-orange-500 w-96 bg-slate-50 rounded-xl px-10 py-10'>
                <button className="place-self-end text-orange-500" onClick={onClose}><X size={20} /></button>
                <div >
                    <Input variant='flushed' name="fullname" className='mb-4' placeholder='Full Name' onChange = {handleChange} required />
                    <Input variant='flushed' name="address" className='mb-4' placeholder='Address' onChange = {handleChange} required />
                    <Input variant='flushed' name ="contact" className='mb-4' placeholder='Contact No.' onChange = {handleChange} required />
                    <Input variant='flushed' name="email" className='mb-4' placeholder='Email ID' onChange = {handleChange} required />
                    <Input variant='flushed' name="problem" className='mb-4' placeholder='Problem Stmt.' onChange = {handleChange} />
                    <Input variant='flushed' name="date" className='mb-4 placeholder-slate-500' placeholder='Select Date and Time' size='md' onChange = {handleChange} type='datetime-local' />
                </div>
                <button type="submit" onClick={handleSubmit} className="place-self-center text-orange-500">
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </div>
        </div>
    )
}

export default Modal