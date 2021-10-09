const express = require("express");
const app = express();
app.use(express.static("../public/"));


app.get("/", (req, res) => {
    res.sendFile("home/index.html", { root: "../public/" });
})

app.listen(8000);