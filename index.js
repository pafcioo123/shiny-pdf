const express = require("express");
const html_to_pdf = require("html-pdf-node");
const fs = require("fs");
const bodyParser = require("body-parser");
const yup = require("yup");
const PaperFormats = require("./PaperFormats");
const app = express();
const port = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const pdfGeneratorSchema = yup.object().shape({
  content: yup.string().required(),
  options: yup.object().shape({
    scale: yup
      .number()
      .min(0.1)
      .max(2),
    landscape: yup.boolean(),
    format: yup.string().oneOf(PaperFormats),
    margin: yup.object().shape({
      top: yup.string(),
      right: yup.string(),
      bottom: yup.string(),
      left: yup.string()
    })
  })
});

app.get("/pdf/", bodyParser.json(), (req, res) => {
  let options = { format: "A4" };
  console.log("req", req);
  console.log("req body", req.body);
  const content = req.body.html || fs.readFileSync("Output.html", "utf8");
  let file = { content: content };
  html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
    res.contentType("application/pdf");
    res.send(pdfBuffer);
  });
});

app.get("/pdftest/", bodyParser.json(), (req, res) => {
  let options = { format: "A4" };
  console.log("req", req);
  console.log("req body", req.body);
  if (!!req.body)
    res
      .status(400)
      .send("Missing json!!! Remember to set Content-Type:application/json!!!");
  try {
    const validatedValues = await async ()=> {pdfGeneratorSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    })};
    console.log("validated",validatedValues)
    const file = { content: validatedValues.content};
    const options= validatedValues.options
    html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
      res.contentType("application/pdf");
      res.send(pdfBuffer);
    });
  } catch (e) {
    console.log(e);
    res.status(400).send(e.errors);
  }
  // const content = req.body.content || res.status(400).send("missing html code")
  // let file = { content: content };
  // html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
  //   res.contentType("application/pdf");
  //   res.send(pdfBuffer);
  // });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
