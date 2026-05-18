import React from 'react'
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedin, FaHome } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className='bg-gray-50 pt-12 pb-8 mt-2'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                {/* Main Footer Content */}
                <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-8'>
                    {/* Company Info */}
                    <div className='space-y-4'>
                        <div className='flex items-center space-x-2'>
                            <FaHome className='text-[#ff385c] text-2xl' />
                            <span className='text-xl font-bold text-gray-800'>NestHub</span>
                        </div>
                        <p className='text-gray-600 text-sm leading-relaxed'>
                            Discover unique places to stay around the world. Book homes, hotels, and more for your next adventure with NestHub.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className='text-gray-800 font-semibold mb-4'>Quick Links</h3>
                        <ul className='space-y-2'>
                            <li><a href='/' className='text-gray-600 hover:text-[#ff385c] transition'>Home</a></li>
                            <li><a href='/listings' className='text-gray-600 hover:text-[#ff385c] transition'>Listings</a></li>
                            <li><a href='/about' className='text-gray-600 hover:text-[#ff385c] transition'>About Us</a></li>
                            <li><a href='/contact' className='text-gray-600 hover:text-[#ff385c] transition'>Contact</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className='text-gray-800 font-semibold mb-4'>Support</h3>
                        <ul className='space-y-2'>
                            <li><a href='/help' className='text-gray-600 hover:text-[#ff385c] transition'>Help Center</a></li>
                            <li><a href='/safety' className='text-gray-600 hover:text-[#ff385c] transition'>Safety</a></li>
                            <li><a href='/cancellation' className='text-gray-600 hover:text-[#ff385c] transition'>Cancellation</a></li>
                            <li><a href='/report' className='text-gray-600 hover:text-[#ff385c] transition'>Report Issue</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className='text-gray-800 font-semibold mb-4'>Stay Updated</h3>
                        <p className='text-gray-600 text-sm mb-4'>Subscribe to our newsletter for the latest updates and offers from NestHub.</p>
                        <form className='flex flex-col space-y-2'>
                            <input
                                type='email'
                                placeholder='Enter your email'
                                className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff385c] focus:border-transparent'
                            />
                            <button className='bg-[#ff385c] text-white py-2 px-4 rounded-lg hover:bg-[#e63650] transition'>
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Social Links */}
                <div className='border-t border-gray-200 pt-8'>
                    <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
                        <div className='flex space-x-6'>
                            <a href='#' className='text-gray-600 hover:text-[#1877f2] transition'>
                                <FaFacebookF className='text-xl' />
                            </a>
                            <a href='#' className='text-gray-600 hover:text-[#e4405f] transition'>
                                <FaInstagram className='text-xl' />
                            </a>
                            <a href='#' className='text-gray-600 hover:text-[#1da1f2] transition'>
                                <FaTwitter className='text-xl' />
                            </a>
                            <a href='#' className='text-gray-600 hover:text-[#0077b5] transition'>
                                <FaLinkedin className='text-xl' />
                            </a>
                        </div>
                        <div className='text-gray-600 text-sm'>
                            &copy; {new Date().getFullYear()} NestHub. All rights reserved.
                        </div>
                    </div>
                </div>

                {/* Bottom Links */}
                <div className='mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-600'>
                    <a href='/privacy' className='hover:text-[#ff385c] transition'>Privacy Policy</a>
                    <a href='/terms' className='hover:text-[#ff385c] transition'>Terms of Service</a>
                    <a href='/cookies' className='hover:text-[#ff385c] transition'>Cookie Policy</a>
                    <a href='/accessibility' className='hover:text-[#ff385c] transition'>Accessibility</a>
                </div>
            </div>
        </footer>
    )
}

export default Footer