const express = require('express')
const html_to_pdf = require('html-pdf-node');
const fs = require('fs')
const bodyParser = require('body-parser');
// let options = { format: 'A4' };
// var content = fs.readFileSync('Output.html', 'utf8');
// // let file = { content: "<h1>Welcome to html-pdf-node</h1>" };
// let file = { content: content };
// // or //
// // let file = { url: "https://example.com" };
// html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
//   console.log("PDF Buffer:-", pdfBuffer);
//   fs.writeFileSync('some.pdf', pdfBuffer);
// });


const app = express()
const port = process.env.PORT || 3000

// app.use(express.json());
// app.use(express.raw());
// app.use(express.urlencoded({ extended: false }))
// app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/pdf/', bodyParser.json(),(req, res) => {

  let options = { format: 'A4' };
  console.log("req",req)
  console.log("req body",req.body)
  const content = req.body.html || fs.readFileSync('Output.html', 'utf8');
  // var content = "<p>xd</p>";
  let file = { content: content };
  html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
    res.contentType("application/pdf");
  res.send(pdfBuffer)
});

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})