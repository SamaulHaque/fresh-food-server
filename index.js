const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

//middle wires
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('food server is running')
})

app.listen(port, () => {
    console.log(`food server running on port: ${port}`)
})