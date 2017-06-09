// 模拟读取文件过程，readFileFun为读取的核心方法，callback表示读取完成之后打印日志。依次读取文件1，2，3，且读取时间分别为5000，3000，1000。要求读取结果为1，2，3。

const callback = function(error, fileData) {
    console.log(fileData);
};

const readFileFun = function(fileName, callback) {
    var time = 1000;
    if (fileName == 1) {
        time = 5000;
    } else if (fileName == 2) {
        time = 3000;
    } else if (fileName == 3) {
        time = 1000;
    }
    setTimeout(function() {
        var fileStr = 'now file data is for : ' + fileName;
        callback(undefined, fileStr);
    }, time);
};

const needReadFileArr = [1, 2, 3];

/*console.log('默认执行顺序');
readFileFun(1,callback);
readFileFun(2,callback);
readFileFun(3,callback);*/

// 默认执行的结果为：
// now file data is for : 3
// now file data is for : 2
// now file data is for : 1


/*console.log('通过回调方式实现');
readFileFun(1, function(e, fileData) {
    callback(e, fileData);
    readFileFun(2, function(e, fileData) {
        callback(e, fileData);
        readFileFun(3, function(e, fileData) {
            callback(e, fileData)
        });
    });
});*/



/*console.log('依然为回调方式抽象为递归实现');
var i = 0;
var readFileArrFun = function(readFileArr, i) {
    readFileFun(readFileArr[i], function(e, fileData) {
        callback(e, fileData);
        i++;
        if (i < readFileArr.length) {
            readFileArrFun(readFileArr, i);
        }
    });
};
readFileArrFun(needReadFileArr, i);*/


/*console.log('通过Promise方式实现');
new Promise(function(resolve, reject) {
    readFileFun(1, function(e, fileData) {
        resolve(fileData);
    });
}).then(function(fileData) {
    callback(undefined, fileData);
    new Promise(function(resolve, reject) {
        readFileFun(2, function(e, fileData) {
            resolve(fileData);
        })
    }).then(function(fileData) {
        callback(undefined, fileData);
        new Promise(function(resolve, reject) {
            readFileFun(3, function(e, fileData) {
                resolve(fileData);
            })
        }).then(function(fileData) {
            callback(undefined, fileData);
        });
    });
});*/

// 注意 无法取消 Promise，一旦新建它就会立即执行，无法中途取消。更新信息参考 http://www.jianshu.com/p/063f7e490e9a



/*console.log('依然为Promise方式抽象为递归实现');
var i = 0;
var readFileArrFun = function(readFileArr, i) {
    new Promise(function(resolve, reject) {
        readFileFun(readFileArr[i], function(e, fileData) {
            resolve(fileData);
        });
    }).then(function(fileData) {
        callback(undefined, fileData);
        i++;
        if (i < readFileArr.length) {
            readFileArrFun(readFileArr, i);
        }
    });
};
readFileArrFun(needReadFileArr, i);*/


/*console.log('将readFileFun封装为返回Promise的function实现');

var readFileFunPromise = function(fileName) {
    return new Promise(function(resolve, reject) {
        readFileFun(fileName, function(e, fileData) {
            resolve(fileData);
        });
    });
};

readFileFunPromise(1).then(function(fileData) {
    callback(undefined, fileData);
    readFileFunPromise(2).then(function(fileData) {
        callback(undefined, fileData);
        readFileFunPromise(3).then(function(fileData) {
            callback(undefined, fileData);
        });
    });
});*/
// 参考代码https://github.com/shinnn/fs-readfile-Promise
// Promise 的写法只是回调函数的改进，使用then方法以后，异步任务的两段执行看得更清楚了，除此以外，并无新意

/*console.log('通过Generator函数实现的执行顺序');

function run(generatorFunction) {
    var generatorItr = generatorFunction(needReadFileArr, resume);

    function resume(e, fileData) {
        callback(e, fileData)
        generatorItr.next();
    }
    generatorItr.next();
};

var gen = function*(readFileArr, cb) {
    for (var i = 0; i < readFileArr.length; i++) {
        yield readFileFun(readFileArr[i], cb)
    }
};

run(gen);*/

// 参考代码：http://www.html-js.com/article/A-day-to-learn-JavaScript-to-replace-the-callback-function-with-ES6-Generator
// 需要自己编写Generator函数的执行器方法run
// Generator在执行到yield的时候会暂停，直到下次调用next才会继续执行，因此上面的方法就是在readFileFun的回调中调用next，保证每次执行readFileFun则会暂停，而进入回调之后则继续执行


//ou may only yield a function, Promise, generator, array, or object

/*console.log('通过co库来自动执行Generator')

var co = require('co');

var readFileFunPromise = function(fileName) {
    return new Promise(function(resolve, reject) {
        readFileFun(fileName, function(e,fileData) {
            resolve(fileData);
        });
    });
};

var gen = function*() {
    for (var i = 0; i < needReadFileArr.length; i++) {
        var fileData = yield readFileFunPromise(needReadFileArr[i]);
        console.log(fileData);
    }
};
co(gen);


var gen1 = function*(readFileArr) {
    for (var i = 0; i < readFileArr.length; i++) {
        var fileData = yield readFileFunPromise(readFileArr[i]);
        console.log(fileData);
    }
}

var fn = co.wrap(gen1);
fn(needReadFileArr);*/



/*console.log('通过co以及thunkify来自动执行Generator');
const co = require('co');
const thunkify = require('thunkify');
const readFileFunTh = thunkify(readFileFun);
var gen = function* (){
  for (var i = 0; i < needReadFileArr.length; i++) {
      var fileData = yield readFileFunTh(needReadFileArr[i]);
      console.log(fileData);
  }
}
co(gen);*/

// 深坑之一，如果用此种方式，回调函数的第一个参数时err，第二个才是返回值，开始写demo的时候没有处理err，导致执行到第一个就会报错，不会后续执行


/*console.log('通过async/awite 来实现');
var readFileFunPromise = function(fileName) {
    return new Promise(function(resolve, reject) {
        readFileFun(fileName, function(e,fileData) {
            resolve(fileData);
        });
    });
};

var asyncFun = async function() {
    for (var i = 0; i < needReadFileArr.length; i++) {
        var fileData = await readFileFunPromise(needReadFileArr[i]);
        console.log(fileData);
    }
};

asyncFun()*/


console.log('通过async/awite 来实现，promiseify优化获取Promise过程');

var promiseify = require('promiseify');
var readFileFunPromise = promiseify(readFileFun);

var asyncFun = async function() {
    for (var i = 0; i < needReadFileArr.length; i++) {
        var fileData = await readFileFunPromise(needReadFileArr[i]);
        console.log(fileData);
    }
};

asyncFun()
