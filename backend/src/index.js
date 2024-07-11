const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const chalk = require("chalk")
const path = require("path")
const helmet = require("helmet")
const cookieParser = require("cookie-parser")

//  Services
const { NotFoundException } = require("./exceptions/httpsExceptions")
const errorHandler = require("./middlewares/errorHandler")
const { rateLimiter } = require("./middlewares/rateLimitter")

dotenv.config({ path: path.resolve(__dirname, "../.env") })
// Set env as global var
global.env = process.env.NODE_ENV || "development"

//Initialize With Express
const app = express()

// Use Helmet!
app.use(helmet())

app.use(cookieParser("sadsadawdaw@12121"))

//Express Body Parser
app.use(express.json())

//Extendend false to run a simple algorithm for basic parsing
app.use(express.urlencoded({ extended: true }))

//CORS
app.use(
  cors({
    origin: ["*"],
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders: ["*"],
  })
)

app.use(rateLimiter)

// Documentation
// Configure Content Security Policy for doc files
app.use((req, res, next) => {
  if (req.path.startsWith("/api/documentation")) {
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self'"
    )
  }
  next()
})
app.use("/api/documentation", express.static(path.join(__dirname, "..", "documentation", "api")))

//Routes
require("./routes")(app)

//Error Handler
app.use((req, res, next) =>
  next(new NotFoundException(null, `404 Not found: ${req.url} does not exist`))
)

app.use(errorHandler)

app.listen(process.env.NODE_PORT || 5000, () => {
  console.log(chalk.blue(`Server started on ${process.env.NODE_PORT || 5000}!`))
})
