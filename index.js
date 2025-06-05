import 'dotenv/config'
import express from 'express'
import logger from "./logger.js";
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json())

const morganFormat = ":method :url :status :response-time ms";

app.use(
    morgan(morganFormat, {
        stream: {
            write: (message) => {
                const logObject = {
                    method: message.split(" ")[0],
                    url: message.split(" ")[1],
                    status: message.split(" ")[2],
                    responseTime: message.split(" ")[3],
                };
                logger.info(JSON.stringify(logObject));
            },
        },
    })
);

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