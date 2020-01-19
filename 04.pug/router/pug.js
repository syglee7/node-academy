const express = require('express');
const router = express.Router();
const { pool, mysqlErr } = require('../modules/mysql-conn');


/*
/pug/update/4 이런 요청 처리시
------router.js-------------
const pugRouter = require("./router/pug");
router.use("/pug", pugRouter);
 */

router.get(["/", "/:page"], async (req, res) => { 
    let page = req.params.page ? req.params.page : "list";
    let vals = {};
    switch(page) {
        case "list":
            vals.title = "게시글 리스트 입니다.";
            let sql = "SELECT * FROM board ORDER BY id DESC";
            const connect = await pool.getConnection();
            const result = await connect.query(sql);
            connect.release();
            vals.lists = result[0];
            //res 가 두개 있으면 에러남. 하나의 라우터에서는 res를 하나만 해야한다.
           /*  vals.lists = [
                {id:1, title: '첫번째 글', writer: '관리자', wdate: '2020-01-03', rnum: 5},
                {id:2, title: '두번째 글', writer: '이선영', wdate: '2020-01-04', rnum: 7},
                {id:3, title: '세번째 글', writer: '현수호', wdate: '2020-01-05', rnum: 8},
            ]; */
            res.render("list", vals); 
            break;
        case "write":
            vals.title = "게시글 작성 입니다.";
            res.render("write", vals);
            break;
        default:
            res.redirect("/pug");
            break;
    
    }
});

// mysql 접근
/* router.get('/sqltest', (req, res) => {
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

router.get("/view/:id", async (req, res) => {
	let vals = {
		title: "게시글 상세 보기",
	}
	let id = req.params.id;
    const connect = await pool.getConnection();
    let sql = "UPDATE board SET rnum = rnum + 1 WHERE id="+id;
    let result = await connect.query(sql);
    sql = "SELECT * FROM board WHERE id="+id;
    result = await connect.query(sql);
    connect.release();
	vals.data = result[0][0];
	res.render("view", vals);
});

router.get("/delete/:id", async (req, res) => {
    let id = req.params.id;
    let sql = "DELETE FROM board WHERE id="+id;
    const connect = await pool.getConnection();
    const result = await connect.query(sql);
    connect.release();
    if (result[0].affectedRows == 1) {
        res.redirect("/pug");
    } else {
        res.send("삭제 실패 하였습니다.");
    }
});

router.get("/update/:id", async (req, res) => {
    const vals = {
        title: "게시글 수정",
    }
    const id = req.params.id;
    const sql = "SELECT * FROM board WHERE id="+id;
    const connect = await pool.getConnection();
    const result = await connect.query(sql);
    connect.release();
    vals.data = result[0][0];
    res.render("update", vals);
});


router.post("/update", async (req, res) => {
    const sqlVals = [];
    sqlVals.push(req.body.title);
    sqlVals.push(req.body.content);
    sqlVals.push(req.body.id);
    const sql = "UPDATE board SET title=?, content=? WHERE id=?";
    const connect = await pool.getConnection();
    const result = await connect.query(sql, sqlVals);
    connect.release();
    
    if (result[0].affectedRows == 1) {
        res.redirect("/pug");
    } else {
        res.send("수정에 실패 하였습니다.");
    }
});

router.post("/create", async (req, res) => {
    let sql = "INSERT INTO board SET title=?, writer=?, wdate=?, content=?, orifile=?, realfile=?";
	let val = [req.body.title, req.body.writer, new Date(), req.body.content, req.file.originalname, req.file.filename];
    const connect = await pool.getConnection();
    const result = await connect.query(sql, val);
    connect.release();
    res.redirect('/pug');
});

 module.exports = router;