const express = require('express'); // 아무 경로도 없으면 node 는 node_module 에서 찾는다
const app = express(); //익스프레스(커다란 함수 덩어리) 함수를 실행 한 결과
const host = '127.0.0.1';
const port = 3000;
const bodyParser = require('body-parser'); //Middleware html 을 parsing 해줌 

// 지정한 public 폴더를 client가 접근 가능한 정적 폴더로 만든다.
app.locals.pretty = true; // locals 는 전역변수
app.set('view engine', 'pug');
app.set('views', './views');
app.use(bodyParser.json()); //json 을 javascript object 로 바꿔줌 JSON.parse()
app.use(bodyParser.urlencoded({extended: false})); //post 방식으로 넘어온 데이터 중 multipart/formdata 를 제외하고 처리 (다른애가 처리함)
app.use("/", express.static("./public"));

app.listen(port, () => {
    console.log(`http://${host}:${port}`);
});


/* app.get("/", (req, res) => {
    res.send("<h1>hello World============!!</h1>");
}); */

app.get("/hello", (req, res) => {
    res.send("<h1>Hello word2</h1>");
});


app.get("/home", (req, res) => {
    let name = req.query.name;
    res.send(`<h2>${name} 님 입니다<h3>`);
});


app.get("/api/user", (req, res) => {
    let users = {
        user: [
            {id : 1, name: "이선영", age:28},
            {id : 2, name: "이선영2", age:38},
            {id : 3, name: "이선영3", age:48},
        ],

        cnt : 3
    };

    res.json(users);
});

app.get("/blog/:category/:id", (req,res) => {
    let category = req.params.category = req.params.category;
    let id = req.params.id;
    res.send(`category: ${category}, id : ${id}`);
});


app.get("/index", (req, res) => {
    //node는 원칙적으로 클라이언트가 루트 폴더에 직접 접근을 못함
    //res.sendFile("./index.html"); 절대 경로 넣으면 찾음
});

 app.get("/home2", (req, res) => {
    //node는 원칙적으로 클라이언트가 루트 폴더에 직접 접근을 못함
    //res.sendFile("index.html");
}); 

app.post("/join", (req, res) => {
    let userid = req.body.userid;
    let userpw = req.body.userpw;
    res.send(`userid : ${userid} / userpw: ${userpw}`);
});

app.get("/pug", (req, res) => {
    let vals = {
        title : "PUG 연습",
        name : req.query.name || 'TEST',
    }
    res.render("form.pug", vals);
});