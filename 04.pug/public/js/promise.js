// 콜백 모델 
/* function init() {
    getDays(new Date, function(a) {
        console.log(a.getDays());
    }
}

function getDays(d, fn) {
    var d = new Date();
    fn(d);
}
 
// promise model
 function init() {
    var date = getDays().then(function(d) {
        console.log(d.getDay());
    });
}


function getDays(fn) {
    var d = new Date();
    return promise = new Promise(function(resolve, reject) {
        resolve(d);
    });
} 

async function init() {
    var date = await getDays();
    console.log(date.getDate());
}


function getDays() {
    var d = new Date();
    return promise = new Promise(function(resolve, reject) {
        resolve(d);
    });
}

init(); */

// 기존 콜백의 맹점 
const promise1 = timer();

function timer() {
    setTimeout(function() {
        return 'foo';
    }, 300);
}

console.log(promise1); // undefined 가 나온다

//변경된 promise 동기 방식. 콜백을 받은 후에 콘솔을 찍음
const promise2 = new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve('foo');
    }, 300);
  });
  
  promise2.then(function(value) {
    console.log(value);
    // expected output: "foo"
  });
  
  console.log(promise2);

// async await 변경 방식
function getFoo() {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
          resolve('foo');
        }, 300);
      });
}
  

async function foo() {
    var result = await getFoo();
    console.log(result);
}

foo();
