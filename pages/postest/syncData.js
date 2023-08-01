import React, { useState } from 'react';
import axios from 'axios'; // If using Axios

function Syncdata() {
  const [jsonData, setJsonData] = useState({ /* your JSON data here */ });

  const handleSaveJson = async () => {
    try {
      const response = await axios.post('/api/saveData', jsonData); // Replace with your API route URL
      console.log(response.data);
    } catch (error) {
        console.error('Error saving data:', error.message);
    }
  };

  return (
    <div>
      {/* Your component content */}
      <button onClick={handleSaveJson}  className="bg-dblue text-white p-5">Save JSON</button>
    </div>
  );
}

export default Syncdata;