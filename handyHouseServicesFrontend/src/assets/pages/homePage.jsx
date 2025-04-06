import { useState } from 'react';
import { motion } from 'framer-motion';

export const HomePage = () => {
  return (
    <div className="grid h-screen place-items-center bg-gradient-to-r from-blue-100 to-blue-300">
      <>bmnbhyy</>
      <div className="text-center">
        <motion.div
          className="text-5xl font-bold text-blue-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Welcome to
        </motion.div>
        <motion.div
          className="text-7xl font-extrabold text-blue-800 mt-2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          Household Heroes
        </motion.div>
        <motion.p
          className="mt-4 text-lg text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Your trusted partner for all household services, from cleaning to repairs.
        </motion.p>
        <motion.div
          className="mt-10 grid grid-cols-3 gap-6 text-center"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl text-blue-600">🧹</span>
            </div>
            <h3 className="text-xl font-semibold text-blue-600 mt-4">Cleaning Services</h3>
            <p className="mt-2 text-gray-600">Professional cleaning for every corner of your home.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl text-blue-600">🔧</span>
            </div>
            <h3 className="text-xl font-semibold text-blue-600 mt-4">Repair Services</h3>
            <p className="mt-2 text-gray-600">Expert repair solutions for household issues.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl text-blue-600">📋</span>
            </div>
            <h3 className="text-xl font-semibold text-blue-600 mt-4">Custom Requests</h3>
            <p className="mt-2 text-gray-600">Tailored services to meet your unique needs.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
