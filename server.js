let express=require('express');
let path=require('path');
let fs=require('fs');
let bodyPaser=require('body-parser');
let app=express();
app.use(express.static(path.resolve('./')));
app.use(bodyPaser.json());
//获取所有的books
app.get('/books',function (req,res) {
    readBooks(function (books) {
        res.send(books);
    });
});
//根据id获取指定book
app.get('/books/:id',function (req,res) {
    let curBookId=req.params.id;
    readBooks(function (books) {
        let book=books.find(function (item) {
            return curBookId==item.id;
        });
        res.send(book);
    })
});
//根据id修改book
app.put('/books/:id',function (req,res) {
    let book=req.body;
    let bookId=req.params.id;
    readBooks(function (books) {
        books=books.map(function (item) {
           if(bookId==item.id){
               return book;
           }else {
               return item;
           }
        });
        writeBooks(books);
        res.send();
    });
});
//根据id删除book
app.delete('/books/:id',function (req,res) {
    let bookId=req.params.id;
    readBooks(function (books) {
        books=books.filter(function (item) {
            return bookId != item.id;
        });
        writeBooks(books);
        res.send();
    })
});
//新增book
app.post('/books',function (req,res) {
    let book=req.body;
    readBooks(function (books) {
        if(books){
            book.id=books[books.length-1].id+1;
        }else {
            book.id=1;
        }
        books.push(book);
        writeBooks(books);
        res.send();
    })
});

function readBooks(callback) {
    fs.readFile('./public/json/books.json','utf-8',function (err,books) {
        callback && callback(JSON.parse(books));
    });
}

function writeBooks(data) {
    fs.writeFile('./public/json/books.json',JSON.stringify(data));
}













app.listen(8090);