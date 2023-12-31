const bodyParser = require("body-parser");
const express = require("express");
const compilar = require('compilex');
const cors = require("cors");
const ejs = require("ejs");
const path = require("path");
const { error } = require("console");
const CodeModel = require("./models/CodeModel");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
app.set('view engine', 'ejs');

// middleware

app.use(
    cors()
  );
  
  app.use(express.json());

  app.use(bodyParser.urlencoded({ extended: false }));

// const port = process.env.PORT || 5000;
const { MONGO_URL, PORT } = process.env;
console.log("connecting to db...");
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

var option = { stats: true };
compilar.init(option);

const messege = {

};


app.get("/get-code", (req, res) => res.render("main", { message: messege }));

app.post("/compile", (req, res) => {

    console.log("called for check");
    const messeges = {
        "code": req.body.code,
        "input": req.body.input,
        "radio": req.body.inputRadio,
        "lang": req.body.lang,
        "output": ""
    }
    const out="";

    var code = req.body.code;
    var input = req.body.input;
    var radio = req.body.inputRadio;
    var lang = req.body.lang;


    console.log(`${code} \n ${input} ${radio} ${lang}`);

    if (lang === 'C' || lang === 'C++') {

        if (radio === 'true') {
            var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };
            compilar.compileCPPWithInput(envData, code, input, (data) => {

                if (data.error) {
                    res.send(`
                    <script>
                    window.alert('${data.error}')
                    window.location.href = "/";
                    </script>
                    
                    `);
                } else {
                    console.log(data);
                    messeges.output = data.output;
                    //     res.send(`
                    //     <script>
                    //         window.alert('your output: ${datas}');
                    //         window.location.href = "/";
                    //     </script>
                    // `);
                    CodeModel.insertMany(messeges);
                    res.render("main", { message: messeges })

                }
            });
        }

        else {

            var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } }
            compilar.compileCPP(envData, code, (data) => {
                console.log(data);

                messeges.output = data.output;
                CodeModel.insertMany(messeges);
                res.render("main", { message: messeges })

            });
        }
    }

        if (lang === "python") {

            if (radio === 'true') {

                var envData = { OS: "windows"  }
                compilar.compilePythonWithInput(envData, code, input, (data) => {
                    if (data.error) {
                        messeges.output = data.error;
                        res.render("main", { message: messeges });
                    }
                    else {
                        messeges.output = data.output;
                        CodeModel.insertMany(messeges);
                        res.render("main", { message: messeges });
                    }
                });
            }

            else {

                var envData = { OS: "windows" };
                compilar.compilePython(envData, code, (data) => {

                    messeges.output = data.output;
                    CodeModel.insertMany(messeges);
                    res.render("main", { message: messeges });

                });


            }
        }

        if (lang === 'java') {


            if (radio === 'true') {


                var envData = { OS: "windows" };
                compilar.compileJavaWithInput(envData, code, input, function (data) {
                    if(data.error){
                        messeges.output = data.error;
                        res.render("main", { message: messeges });
                    }else{
                    messeges.output = data.output;
                    CodeModel.insertMany(messeges);
                    res.render("main", { message: messeges });
                    }
                });

            }
            else {


                var envData = { OS: "windows" };
                compilar.compileJava(envData, code, function (data) {
                    if(error){
                        messeges.output = data.error;
                        res.render("main", { message: messeges });
                    }else{
                    messeges.output = data.output;
                    CodeModel.insertMany(messeges);
                    res.render("main", { message: messeges });
                    }
                });
            }
        }
    //   CodeModel.insertMany(messeges);

   });


app.get("/fullStat", (req, res) => {
    compilar.fullStat((data) => {
        res.send(data);
    })
});


// app.listen(port, () => console.log(` app listening on port port! 5000 /n http://localhost:${port}`));

compilar.flush(() => {
    console.log(`all the temperary files are flushed`);
})