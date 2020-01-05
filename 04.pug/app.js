const express = require('express');
const app = express();
const port = 3000;
const host = '127.0.0.1';
//const { mysql, conn } = require('./modules/mysql-conn');
const { pool, mysqlErr } = require('./modules/mysql-conn');

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
app.listen(3000, () => {
	console.log(`http://${host}:${port}`);
});

// express 세팅 및 미들웨어 세팅
app.set('view engine', 'pug');
app.set('views', './views');

// 정적라우터 세팅
app.use('/', express.static('./public'));
// body-parser 세팅
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.locals.pretty = true; // 클라이언트에 보내주는 소스를 들여쓰기 해준다.

app.get(["/pug", "/pug/:page"], async (req, res) => { 
    let page = req.params.page ? req.params.page : "list";
    let vals = {};
    switch(page) {
        case "list":
            vals.title = "게시글 리스트 입니다.";
            let sql = "SELECT * FROM board ORDER BY id DESC";
            const connect = await pool.getConnection();
            const result = await connect.query(sql);
            vals.lists = result[0];
            //res 가 두개 있으면 에러남. 하나의 라우터에서는 res를 하나만 해야한다.
           /*  vals.lists = [
                {id:1, title: '첫번째 글', writer: '관리자', wdate: '2020-01-03', rnum: 5},
                {id:2, title: '두번째 글', writer: '이선영', wdate: '2020-01-04', rnum: 7},
                {id:3, title: '세번째 글', writer: '현수호', wdate: '2020-01-05', rnum: 8},
            ]; */
            res.render("list.pug", vals); 
            break;
        case "write":
            vals.title = "게시글 작성 입니다.";
            res.render("write.pug", vals);
            break;
        default:
            res.redirect("/");
            break;
    
    }
});

// mysql 접근
/* app.get('/sqltest', (req, res) => {
    let connect = conn.getConnection((err, connect) => {
        if (err) {
            res.send('DataBase 접속에 실패 하였습니다.');
        } else {
            let sql = 'INSERT INTO board SET title="테스트!!", writer="관리자", wdate="2020-01-05 14:55:47"';
            connect.query(sql, (err, result) => {
                if (err) {
                    res.send('SQL 문이 실패 하였습니다.');
                } else {
                    res.json(result);
                }
            });
        }
    });
}); */

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

app.post("/board", async (req, res) => {
    let sql = "INSERT INTO board SET title=?, writer=?, wdate=?";
    let val = [req.body.title, req.body.writer, new Date()];
    const connect = await pool.getConnection();
    const result = await connect.query(sql, val);
    connect.release();
    res.json(result);
});

//res.send
//res.json
//res.render