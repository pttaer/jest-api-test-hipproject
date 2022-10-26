const express = require('express') // Sử dụng framework express
const { default: mongoose } = require('mongoose')
const next = require('next') // Include module next

const project = require('./pages/api/route/project.route')
const user = require('./pages/api/route/user.route')

const paginatedResults = require('./utils/pagination')


const port = parseInt(process.env.PORT, 10) || 3000 // Port để chạy app Nextjs, cũng là server nodejs
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler();
const cors = require("cors");


//=========================================================================================================================================================
mongoose.connect(
  "mongodb+srv://kimdat0705:kimdatkimdat0705@cluster0.duoyvfe.mongodb.net/hippro"
);

mongoose.connection.on("connected", () => {
  console.log("> Connected to MongoDB");
});
mongoose.connection.on("error", (err) => {
  console.log("err connecting", err);
});

const Project = require('./model/project.model')
const User = require('./model/user.model')

//=========================================================================================================================================================

app.prepare().then(() => {
  const server = express()

//ADDED CORS FOR WACK BROWSERS
server.use(cors());

// Add headers
server.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

//===============================================================================================================================

//parse form data
server.use(express.urlencoded({ extended: false }));

//parse json
server.use(express.json());

//Tạo ra các router. Dòng này có ý nghĩa khi gửi request đến path /a . Sẽ render file /a.js trong thư mục pages/a.js của Nextjs
  // server.use('/api', project, (req, res) => {
  //   console.log("1");
  //   console.log("2");
  //   return handle(req, res)
  // })

  server.use('/api/prj', project)
  server.use('/api/user', user)

// Nếu các bạn muốn các routing tự động liến kết đến route files giống với cấu trúc của Nextjs thì chỉ cần thêm 3 dòng bên dưới
// https://nextjs.org/docs/routing/introduction
  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})

