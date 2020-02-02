const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const multer = require(path.join(__dirname, './modules/multer-conn'));
const app = express();
const port = 3000;
const host = '127.0.0.1';
const User = require(path.join(__dirname, "./models/User"));

//const { mysql, conn } = require('./modules/mysql-conn');

// 동시에 여러 요청 처리 가능 createpool


/* 한 번에 하나의 요청만 처리 가능
    const conn = mysql.createConnection({ 
    host: 'localhost',
    user: 'root',
    password: '000000',
    port: '3307',
    database: 'node',

}); */

// 서버 구동
app.listen(port, () => {
	console.log(`http://${host}:${port}`);
});

// express 세팅 및 미들웨어 세팅
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './views'));

// 정적라우터 세팅
app.use('/', express.static(path.join(__dirname, './public')));
// body-parser 세팅
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.locals.pretty = true; // 클라이언트에 보내주는 소스를 들여쓰기 해준다.

//form 에서 PUT, DELETE 를 보낼 떄 사용 됨. (ajax 에서는 불필요하다.);
app.use(methodOverride, (req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method
      delete req.body._method
      return method
    }
});
 
const pugRouter = require(path.join(__dirname, "./router/pug"));
const apiRouter = require(path.join(__dirname, "./router/api"));
const userRouter = require(path.join(__dirname, "./router/user"));
app.use("/pug", pugRouter);
app.use('/api', apiRouter);
app.use("/user", userRouter);



app.get("/sqltest", async (req, res) => {
    let sql = "INSERT INTO board SET title=?, writer=?, wdate=?";
    let sqlVals = ["제목!!!", "관리자2!!", "2020-01-05 15:55:45"];
    const connect = await pool.getConnection(); //await 를 쓰기 위해선 포함하고 있는 함수를 async 로 만들어야함
    // async await 를 쓰면 콜백 처럼 먼저 아래 프로세스를 실행하고 나중에 리턴받는게 아닌 return을 받고 나서 다음 내용을 수행한다.
    // 비동기인 자바스크립트를 동기처럼 쓸 수 있음.
    
    const result = await connect.query(sql, sqlVals);
    // 원래 try catch 로 에러처리를 해줘야 하지만 나중에 처리하기로 하고 뺌
    connect.release();
    res.json(result);
   
});


//res.send html 다이렉트로
//res.json api 구현 json
//res.render pug로 보내는거