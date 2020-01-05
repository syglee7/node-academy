/* // mysql 연결을 모듈화 시키는 과정 
const mysql = require('mysql');

const conn = mysql.createPool({ 
    host: 'localhost',
    user: 'root',
    password: '000000',
    port: '3307',
    database: 'node',
    connectionLimit: 10

}); 



module.exports = {
    mysql, // mysql: mysql 인데 es6에서는 값과 키가 같으면 생략 가능
    conn
}
*/

const mysql = require('mysql2/promise'); // index 는 기존 콜백 방식이고 promise 를 가져와야 사용 가능
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '000000',
    port: '3307',
    database: 'node',
    connectionLimit: 10
});

const sqlErr = (err) => {
    console.error(err);
}

module.exports = {
    pool,
    sqlErr
}
