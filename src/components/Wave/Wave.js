import React from 'react';
import { motion } from 'framer-motion';
import wave from '../../assets/wave.png'; 
import './wave.css';

const Wave = () => {
  return (
    <motion.div 
    // className="w-[200px] xl:w-[300px] absolute -right-16 -bottom-2 mix-blend-color-dodge
    // animate-pulse duration-75 z-10"
    className="wave-container">
      <img
        src={wave}
        width={260}
        height={200}
        className="wave-image"
        alt=""
      />
    </motion.div>
  );
};

export default Wave;