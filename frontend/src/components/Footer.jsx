import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';

// For the best quality on all screen sizes, consider using an SVG version of your logo in the future.
import logo from '../assets/logo.png'; 

// Data for navigation links for easier management
const platformLinks = [
    { name: 'Home', path: '/' },
    { name: 'Pricing', path: '/' },
    { name: 'Features', path: '/' },
    { name: 'Community', path: '/' },
];

const socialLinks = [
    { name: 'Twitter', icon: Twitter, url: 'https://x.com/Ahmed_07966' },
    { name: 'GitHub', icon: Github, url: 'https://github.com/nameisahmedh' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/mohammad-kammar-ahmed-48b391253/' },
];

const Footer = () => {
    return (
        <footer className="bg-gray-50 text-gray-700 px-6 pt-16 md:px-16 lg:px-36 w-full">
            <div className="flex flex-col md:flex-row justify-between w-full gap-12 border-b border-gray-200 pb-12">
                
                {/* Brand & Description */}
                <div className="md:max-w-sm">
                    <motion.img
                        src={logo}
                        alt="Arix.ai Logo"
                        className="h-18 cursor-pointer" 
                        whileHover={{ scale: 1.05, rotate: -3 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    />
                    <p className="mt-6 text-base leading-relaxed text-gray-600">
                        Your all-in-one platform for next-gen AI tools — generate content, design images, analyze resumes, and more.
                    </p>

                    {/* UPDATED: Added a heading for the creator handles */}
                    <div className="mt-8">
                        <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Connect with the Creator</h3>
                        <div className="flex items-center gap-5 mt-4">
                            {socialLinks.map((social) => (
                                <a 
                                    key={social.name}
                                    href={social.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-gray-500 hover:text-orange-500 transition-colors duration-200"
                                >
                                    <social.icon size={24} />
                                    <span className="sr-only">{social.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 flex items-start justify-start md:justify-end gap-12 md:gap-20">
                    <div>
                        <h2 className="font-semibold text-lg text-gray-800 mb-5">Platform</h2>
                        <ul className="text-base space-y-4">
                            {platformLinks.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} className="hover:text-orange-500 transition">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold text-lg text-gray-800 mb-5">Contact</h2>
                        <div className="text-base space-y-4 text-gray-600">
                            <a href="mailto:mdqamarahmed123@gmail.com" className="block hover:text-orange-500 transition">
                                mdqamarahmed123@gmail.com
                            </a>
                            <a href="tel:+918688941893" className="block hover:text-orange-500 transition">
                                +91-86889-41893
                            </a>
                            <p>Hyderabad, India</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Notice */}
            <div className="py-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 gap-4">
                 <p>&copy; {new Date().getFullYear()} Arix.AI Platform. All rights reserved.</p>
                 <Link to="/privacy-policy" className="hover:text-orange-500 transition">Privacy Policy</Link>
            </div>
        </footer>
    );
};

export default Footer;