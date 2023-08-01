import fs from "fs";
import path from "path";
// import axios from "axios"; // Import axios for making HTTP requests
import cookie from "cookie";

import { axiosServer } from "@/axiosServer";
export default async function handler(req, res) {
    const cookies = req.headers.cookie;
    const parsedCookies = cookie.parse(cookies);
    const host_cookie = parsedCookies["site-local-name"];
    const token = parsedCookies["api-token"];
    console.log(token)

      const resp = await axiosServer.post(
    "https://www.flo-lebanon.com/api/v2/?route=catalog/product/ListOfProductsPos&limit=20&page=1",
    {
      headers: {
        "Content-Type": "application/json",
         Authorization: "Bearer " + token
      },
      body: {}
    }
  );

  // Assuming the response data has a property "data" containing the actual response
  const data = resp.data;

  try {
    // Define the path and filename for the JSON file
    const filePath = path.join(process.cwd(), 'json', 'product.json');
    let existingData = [];

    if (fs.existsSync(filePath)) {
        const fileContents = fs.readFileSync(filePath, 'utf-8');
        existingData = JSON.parse(fileContents);
        existingData.push(data);
        fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

      }else{

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

      }


    res.status(200).json({ message: 'JSON file saved successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving data' });
  }
}
