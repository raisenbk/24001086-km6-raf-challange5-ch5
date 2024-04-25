require("dotenv").config()
const app = require("./bin/app")

const port = process.env.port

app.listen(port, () => {
    console.log(`App running on : http://localhost:${port}`)
})