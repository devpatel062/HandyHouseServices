// import React from 'react'
import { Divider, Image } from "@chakra-ui/react";
import ContactUs from './ContactUs'
import Footer from './Footer'
import collage from '../Images/collage.jpg'
export const AboutUs = () => {
  return (
    <div className="relative top-20 bg" >
      <div className="base:flex align md:flex column mb-6">
        <div>
          <div className="  font-sans w-auto mb-6">
            <div className="text-3xl font-medium mb-6">About Us</div>
            Welcome to HomeServices, your one-stop solution for all your home
            maintenance and repair needs. We take pride in offering top-notch services that cater to a wide range of home
            improvement tasks. Whether you need a skilled plumber, a talented carpenter, or a reliable electrician,
            we have you covered.
          </div>
          <Divider></Divider>
          <div className="text-1xl font-sans w-auto mb-6">
            <div className="text-3xl font-medium mb-6">Our Mission</div>
            At HomeServices, our mission is to provide high-quality, reliable, and affordable home services to our valued
            customers. We aim to make home maintenance simple and stress-free by connecting you with experienced professionals
            who can handle all your home repair and improvement needs.
          </div>
          <Divider></Divider>
          <div className="text-1xl font-sans w-auto mb-6">
            <div className="text-3xl font-medium mb-6">Why Choose Us?</div>
            Experienced Professionals
            <br />Affordable Rates
            <br />Convenience
            <br />Customer Satisfaction
          </div>
        </div>
        <Image src={collage} height="350px" width="500px" borderRadius="50px"></Image>
      </div>

      <Divider></Divider>
      <div className="text-1xl font-sans w-auto mb-6">
        <div className="text-3xl font-medium mb-6">Our Commitment to Excellence</div>
        At HomeServices, we are committed to maintaining the highest standards of quality in everything we do.
        From the moment you contact us to the completion of your project, we ensure a seamless and hassle-free experience.
        Our team uses the latest tools and techniques to deliver results that not only meet but exceed your expectations.
      </div>
      
      <ContactUs />
      <Footer />
    </div>
    
  )
}

export default AboutUs;