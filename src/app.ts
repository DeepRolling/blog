import express from 'express'
const app =  express()
const port = 1024


app.use(express.urlencoded({
    extended: true
}));

app.post('/users/login/', (req, res) => {
    console.log(req.body)
    res.write(req.body.name);
    res.end();
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
