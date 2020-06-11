const express=require('express')
const app=express();

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
/*
     bind()  ===> bind(port,ip) ==> 개통
     listen() ==> 대기상태
     accept() ==> 연결이 되면 ~
 */
app.listen(3355,()=>{
    console.log("Server Start ...","http://localhost:3355")
})

const path=require('path');
// public 디렉터리의 내용을 자동으로 응답합니다. --- (※3)
app.use('/', express.static('./public'))
// 최상위 페이지에 접속하면 /public으로 리다이렉트합니다.
app.get('/', function (request, response){
    response.sendFile(path.resolve(__dirname, 'public', 'index.html'));
})
// 뉴스 require(import)
/*
        Java, React ==> import
        C/C++ ==> include
        C# => using
        Node => require
 */
const request=require("request")
const xml2js=require("xml2js")
// 웹 => 사용자가 요청한 정보 모아서 전송 , 응답정보(사용자의 IP,PORT)
//              request                       response  ===> 시스템(webserver)에서 처리
// Spring ===> 톰캣
// Node ==> express
// 영화 ==> /news?fd=영화
app.get('/news',(req,res)=>{
    var fd=encodeURIComponent(req.query.fd)
    // 네이버에 연결
    /*
        http://newssearch.naver.com/search.naver?where=rss&query=%EB%A7%9B%EC%A7%91 인코딩
     */
    var url="http://newssearch.naver.com/search.naver?where=rss&query="+fd;
    // XML => JSON (파서기생성)  explicitArray:false 변환이 안되는 것은 제외
    var parser=new xml2js.Parser({
        explicitArray:false
    })
    // 네이버 서버에 접근
    request({url:url},(err,request,xml)=>{
        //console.log(xml)
        parser.parseString(xml,function (err,pJson) {
            console.log(pJson.rss.channel.item)
            res.json(pJson.rss.channel.item)
        })
    })
})

const Client=require("mongodb").MongoClient
/*
    params:{
        page:page
    }
    /recipe?page=1
 */
app.get('/recipe',(req,res)=>{
    var page=req.query.page; //request.getParameter("page");
    var rowSize=9;
    var skip=(page*rowSize)-rowSize;
    var url="mongodb://211.238.142.181:27017";

    Client.connect(url,(err,client)=>{
        //Database (mydb)
        var db=client.db("mydb");
        // Table => Collection=> recipe
        db.collection("recipe").find({}).skip(skip).limit(rowSize)
            .toArray((err,docs)=>{
                res.json(docs)
                client.close();
            });
    })

})

app.get('/category',(req,res)=>{

    var url="mongodb://211.238.142.181:27017";

    Client.connect(url,(err,client)=>{
        //Database (mydb)
        var db=client.db("mydb");
        // Table => Collection=> recipe
        db.collection("category").find({})
            .toArray((err,docs)=>{
                res.json(docs)
                client.close();
            });
    })

})

app.get('/cate_food',(req,res)=>{
    var cno=req.query.cno;
    var url="mongodb://211.238.142.181:27017";

    Client.connect(url,(err,client)=>{
        //Database (mydb)
        var db=client.db("mydb");
        // Table => Collection=> recipe
        db.collection("food").find({cno:Number(cno)})
            .toArray((err,docs)=>{
                res.json(docs)
                console.log(docs)
                client.close();
            });
    })

})








