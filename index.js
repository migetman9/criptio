#!/usr/bin/env node

const yargs = require('yargs')
const ProgressBar = require('progress');
const inquirer = require("inquirer");
const crypto = require('crypto');
const fs = require('fs');
const CONSTANTS = require('./constants.js')

function bar(stream, file, encrypt) {
    var fileSize = fs.statSync(file).size;
    var barOpts = {
        width: 20,
        total: fileSize,
        clear: false
    };
    var bar = new ProgressBar((encrypt ? 'encrypting' : 'decrypting') + ' [:bar] :percent :etas', barOpts);
    stream.on('data', function (chunk) {
        bar.tick(chunk.length);
    });
}

function encrypt(argv) {
    inquirer.prompt(questions, function( answers ) {
        const cipher = crypto.createCipher(answers.algorithm, answers.password);
        const r = fs.createReadStream(argv._[1]);
        const w = fs.createWriteStream(argv._[2] || argv._[1]+'.encrypted');
        bar(r,argv._[1], true)
        r.pipe(cipher).pipe(w);
        console.log(argv._[1]+" encrypted, "+(argv._[2] || argv._[1]+'.encrypted'));
    });
}

function decrypt(argv) {
    inquirer.prompt(questions, function( answers ) {
        const decipher = crypto.createDecipher(answers.algorithm, answers.password);
        const r = fs.createReadStream(argv._[1]);
        const w = fs.createWriteStream(argv._[2] || argv._[1]+'.decrypted');
        bar(r,argv._[1], false)
        r.pipe(decipher).pipe(w);
        console.log(argv._[1]+" decrypted, "+(argv._[2] || argv._[1]+'.decrypted'));
    });
}

var questions = [CONSTANTS.QUESTION_PASSWORD,CONSTANTS.QUESTION_ALGORITHM]

/* commands */
yargs
.command('encrypt','Encrypt file', function(yargs) {
    return yargs
    .demand(2)
    .option('password', CONSTANTS.YARGS_OPTIONS_ENCRYPT_PASSWORD)
    .option('algorithm', CONSTANTS.YARGS_OPTIONS_ENCRYPT_ALOGORITHM)
    .usage(CONSTANTS.YARGS_OPTIONS_ENCRYPT_USAGE)
    .example(CONSTANTS.YARGS_OPTIONS_ENCRYPT_EXAMPLE_1)
    .example(CONSTANTS.YARGS_OPTIONS_ENCRYPT_EXAMPLE_2)
    .help()
},encrypt)
.command('decrypt','Decrypt file', function(yargs) {
    return yargs
    .demand(2)
    .option('password', CONSTANTS.YARGS_OPTIONS_DECRYPT_PASSWORD)
    .option('algorithm', CONSTANTS.YARGS_OPTIONS_DECRYPT_ALOGORITHM)
    .usage(CONSTANTS.YARGS_OPTIONS_DECRYPT_USAGE)
    .example(CONSTANTS.YARGS_OPTIONS_DECRYPT_EXAMPLE_1)
    .example(CONSTANTS.YARGS_OPTIONS_DECRYPT_EXAMPLE_2)
    .help()
},decrypt)
.demand(2)
.usage(CONSTANTS.YARGS_USAGE)
.example(CONSTANTS.YARGS_EXAMPLE)
.demand('password')
.alias('password', 'p')
.nargs('password', 1)
.describe('password', CONSTANTS.YARGS_OPTIONS_PASSWORD)
.alias('algorithm', 'a')
.nargs('algorithm', 1)
.describe('algorithm', CONSTANTS.YARGS_OPTIONS_ALGORITHM)
.choices('algorithm', CONSTANTS.QUESTION_ALGORITHM.choices)
.epilogue(CONSTANTS.EPILOGUE_TEXT)
.argv;