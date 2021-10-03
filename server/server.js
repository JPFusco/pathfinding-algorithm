const express = require("express");
const app = express();
app.use(express.static("../public/home/"));


app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "../public/home/" });
})

app.listen(8000);