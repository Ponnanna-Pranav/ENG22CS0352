import express from 'express';
import axios from 'axios';
const app = express();
const port = 9876;
const API_BASE_URL = "http://20.244.56.144/evaluation-service";
const VALID_IDS = {
  p: "primes",
  f: "fibo",
  e: "even",
  r: "rand"
};
const WINDOW_SIZE = 10; 
let numberWindow = []; 
const fetchNumbers = async (numberid) => {
  try {
    const endpoint = VALID_IDS[numberid];
    const url = `${API_BASE_URL}/${endpoint}`;
    
  
    const headers = {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ3MjAyODM0LCJpYXQiOjE3NDcyMDI1MzQsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImEwMTVjM2IxLWU2NGUtNDUzNi1hNTU4LTcxYzEwOTQxODY1MiIsInN1YiI6InByYW5hdnBvbm5hbm5hMzRAZ21haWwuY29tIn0sImVtYWlsIjoicHJhbmF2cG9ubmFubmEzNEBnbWFpbC5jb20iLCJuYW1lIjoibSBuIHByYW5hdiBwb25uYW5uYSIsInJvbGxObyI6ImVuZzIyY3MwMzUyIiwiYWNjZXNzQ29kZSI6IkN2dFBjVSIsImNsaWVudElEIjoiYTAxNWMzYjEtZTY0ZS00NTM2LWE1NTgtNzFjMTA5NDE4NjUyIiwiY2xpZW50U2VjcmV0IjoiQldVcVNSekFWQWpDRXZWQyJ9.4o_VXaux1Q2rK9wKRfxumk1fRjZyRfhNkZmU-UiEszU' // Replace with your actual API token
    };

    console.log("Attempting to fetch:", url);
    const response = await axios.get(url, { headers, timeout: 500 });
    console.log("Fetched response:", response.data);

    return response.data.numbers || [];
  } catch (error) {
    console.error("Fetch failed:", error.message);
    return [];
  }
};
const calculateAverage = (numbers) => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return (sum / numbers.length).toFixed(2);
};
app.get('/numbers/:numberid', async (req, res) => {
  const { numberid } = req.params;
  if (!VALID_IDS[numberid]) {
    return res.status(400).json({ message: 'Invalid number ID.' });
  }
  const newNumbers = await fetchNumbers(numberid);
  numberWindow = [...new Set([...numberWindow, ...newNumbers])].slice(-WINDOW_SIZE);
  const avg = calculateAverage(numberWindow);
  res.json({
    windowPrevState: numberWindow.slice(0, -newNumbers.length),
    windowCurrState: numberWindow,
    numbers: newNumbers,
    avg: avg
  });
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
