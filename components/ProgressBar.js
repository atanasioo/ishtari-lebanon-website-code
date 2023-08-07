// components/ProgressBar.js

import { useEffect, useState } from 'react';

const ProgressBar = ({ progress }) => {
  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: `${progress}%` }}></div>{progress}
    </div>
  );
};

export default ProgressBar;
