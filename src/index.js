const path = require('path');
const app = require(path.join(__dirname, 'app.js')); // Bring app (express) object
require('dotenv').config(); 

const port = process.env.PORT || 4000; // env PORT or default PORT

app.listen(port, () => {
    console.log(`Server is running on port ${port} 🧐`);
}); 