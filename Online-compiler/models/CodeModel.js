const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create schema
const CodeSchema = new Schema({
    code: { type: String },
    input: { type: String },
    radio: { type: String },
    lang: { type: String },
    output:  { type: String }
});

// create model (collection)
const CodeModel = mongoose.model("codes", CodeSchema);

// export model
module.exports = CodeModel;