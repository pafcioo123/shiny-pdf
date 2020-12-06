const express = require('express')
var html_to_pdf = require('html-pdf-node');
// var fs = require('fs')
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
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/pdf/', (req, res) => {
  let options = { format: 'A4' };
  var content = "<p>xd</p>";
  let file = { content: content };
  html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
    // const download = Buffer.from(pdfBuffer.toString('utf-8'), 'base64');
  // console.log("PDF Buffer:-", pdfBuffer);
  // fs.writeFileSync('some.pdf', pdfBuffer);
  //   res.set({"Content-Disposition":"attachment; filename=test.pdf"})
  //   res.setHeader('Content-type', 'application/pdf');
    res.contentType("application/pdf");
  res.send(pdfBuffer)
});

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})