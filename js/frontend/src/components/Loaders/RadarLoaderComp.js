import React from 'react';
import RadarLoaderStyles from '../../Style/RadarLoaderStyles.module.css';

const RadarLoader = ({ size, style }) => {
  const loaderStyle = {
    ...style,
    width: size,
    height: size,
  };
  
  return (
    <div className={RadarLoaderStyles.loader} style={loaderStyle}>
      <span></span>
    </div>
  );
};
export default RadarLoader;
