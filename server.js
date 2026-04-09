const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 8080;
const MIME = {'.html':'text/html','.css':'text/css','.js':'application/javascript','.pdf':'application/pdf','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document','.svg':'image/svg+xml'};
http.createServer((req,res)=>{
  let f='.'+decodeURIComponent(req.url.split('?')[0]);
  if(f==='./') f='./index.html';
  const mime=MIME[path.extname(f).toLowerCase()]||'application/octet-stream';
  fs.readFile(f,(err,data)=>{
    if(err){res.writeHead(404);res.end('Not found');return;}
    res.writeHead(200,{'Content-Type':mime});
    res.end(data);
  });
}).listen(PORT,'127.0.0.1',()=>console.log('Listening on http://localhost:'+PORT));
