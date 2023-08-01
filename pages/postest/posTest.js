import React from 'react';
import { useState } from 'react';
import { axiosServer } from '@/axiosServer';



function Pos() {

  
    const [jsonData, setJsonData] = useState({ /* your JSON data here */ });

    const handleSaveJson = async () => {
      try {
        const response = await axiosServer.post('/api/saveData', jsonData); // Replace with your API route URL
        console.log(response.data);
      } catch (error) {
          console.error('Error saving data:', error.message);
      }
    };
    return (
      <div>
        {/* Add your POS page content here */}
        <h1>Point of Sale (POS) Page</h1>
        <button onClick={handleSaveJson}>Save JSON</button>

        {/* Add other components, forms, or any other content as needed */}
      </div>
    );
  }
  export default Pos;


  
