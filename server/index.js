import PaperFormats from "./PaperFormats";
import express from "express";
const html_to_pdf = require("html-pdf-node");
const fs = require("fs");
const bodyParser = require("body-parser");
const yup = require("yup");
// const PaperFormats = require("./PaperFormats");
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

const check = async () => {
  return pdfGeneratorSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });
};
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

app.get("/pdftest/", bodyParser.json(), async (req, res) => {
  // let options = { format: "A4" };
  // console.log("req", req);
  console.log("req body", req.body);
  if (!req.body)
    res
      .status(400)
      .send("Missing json!!! Remember to set Content-Type:application/json!!!");
  let validatedValues = null;
  validatedValues = await pdfGeneratorSchema
    .validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    })
    .catch(e => {
      console.log(e);
      res.status(400).send(e.errors);
    });
  console.log(validatedValues)
  const {options} = validatedValues
  console.log('options',options)
  const content = validatedValues.content;
  let file = { content: content };
  html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
    res.contentType("application/pdf");
    res.send(pdfBuffer);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
