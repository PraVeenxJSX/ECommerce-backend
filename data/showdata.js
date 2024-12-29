import showdata from "./allProducts"
const express = require("express");
const port = 5000;
const app = express();
app.use(express.json());

app.get('/products', (req, res) =>{
    res.json(showdata)
})
res.end();

app.get 
app.listen(port, () => console.log(`Server running on port ${port}`));