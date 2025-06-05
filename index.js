import 'dotenv/config'
import express from 'express'


const app = express();
const port = process.env.PORT || 3000;
app.use(express.json())

let teadData = [];
let nextId = 1;

//adding a tea
app.post('/teas', (req, res) => {
    const { name, price } = req.body;
    const newTea = {
        id: nextId++,
        name,
        price
    }
    teadData.push(newTea);
    res.status(201).send(newTea);
})

//getting all tea
app.get('/teas', (req, res) => {
    res.status(200).send(teadData);
})

//getting tea with id
app.get('/teas/:id', (req, res) => {
    const tea = teadData.find(t => t.id === parseInt(req.params.id));
    if (!tea) {
        return res.status(404).send("tea not found");
    } else {
        return res.status(200).send(tea)
    }
})

//update tea
app.put('/teas/:id', (req, res) => {
    const tea = teadData.find(t => t.id === parseInt(req.params.id));
    if (!tea) {
        return res.status(404).send("tea not found");
    }
    const { name, price } = req.body;
    tea.name = name;
    tea.price = price;
    res.status(200).send(tea);
})

//delete tea
app.delete('/teas/:id', (req, res) => {
    const index = teadData.findIndex(t => t.id === parseInt(req.params.id));
    if (index === -1) {
        res.status(404).send("Tea not found");
    }
    teadData.splice(index, 1);
    return res.status(204).send('deleted');
})

app.listen(port, () => {
    console.log(`Server is running at port: ${port}..`);
})