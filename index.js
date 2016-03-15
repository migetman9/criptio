#!/usr/bin/env node
// Nodejs encryption of buffers
const yargs = require('yargs')
const ProgressBar = require('progress');
const inquirer = require("inquirer");
const crypto = require('crypto');
    
var DEFAULT_ALGORITHM = 'aes-256-ctr';
var EPILOGUE_TEXT = "Developed by Pachito Marco Calabrese"

var fs = require('fs');
var zlib = require('zlib');

// start pipe
//r.pipe(zip).pipe(encrypt).pipe(decrypt).pipe(unzip).pipe(w);
//r.pipe(encrypt).pipe(w);

function bar(stream,file,encrypt) {
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

var questions = [{
    type: 'password',
    name: 'password',
    message: 'Type your encrypt/decrypt password'
},{
    type: 'list',
    name: 'algorithm',
    message: 'Choose an encrypt/decrypt algorithm',
    default: DEFAULT_ALGORITHM,
    choices: crypto.getCiphers()
}]

/* commands */
yargs
.usage('Usage: $0 <command> [options]')
.command('encrypt','Encrypt file', function(yargs) {
    return yargs
    .demand(2)
    .option('password', {
        alias: 'p',
        describe: 'Encrypt Password'
    })
    .option('algorithm', {
        alias: 'a',
        describe: 'Encrypt algorithm',
        default: DEFAULT_ALGORITHM,
        demand: false
    })
    .usage("$0 encrypt <INPUT_FILE> [<OUTPUT_FILE>]")
    .help()
},function (argv) {
    inquirer.prompt(questions, function( answers ) {
        // Use user feedback for... whatever!! 
        const cipher = crypto.createCipher(answers.algorithm, answers.password);
        var r = fs.createReadStream(argv._[1] || 'file.txt');
        var w = fs.createWriteStream(argv._[2] || argv._[1]+'.encrypted');
        bar(r,argv._[1] || 'file.txt', true)
        r.pipe(cipher).pipe(w);
        console.log(argv._[1]+" encrypted, "+(argv._[2] || argv._[1]+'.encrypted'));
    });
})
.command('decrypt','Descrypt file', function(yargs) {
    return yargs
    .demand(2)
    .option('password', {
        alias: 'p',
        describe: 'Encrypt Password'
    })
    .option('algorithm', {
        alias: 'a',
        describe: 'Encrypt algorithm',
        default: DEFAULT_ALGORITHM,
        demand: false
    })
    .usage("decrypt <INPUT_FILE> [<OUTPUT_FILE>]")
    .help()
},function (argv) {
    inquirer.prompt(questions, function( answers ) {
        const decipher = crypto.createDecipher(answers.algorithm, answers.password);
        var r = fs.createReadStream(argv._[1] || 'file.txt');
        var w = fs.createWriteStream(argv._[2] || argv._[1]+'.decrypted');
        bar(r,argv._[1] || 'file.txt', false)
        r.pipe(decipher).pipe(w);
        console.log(argv._[1]+" decrypted, "+(argv._[2] || argv._[1]+'.decrypted'));
    });
})
.demand(2)
.example("$0 <COMMAND> [--password] [--algorithm] <INPUT_FILE> <OUTPUT_FILE>")
.demand('password')
.alias('password', 'p')
.nargs('password', 1)
.describe('password', 'Encrypt/Decrypt Password')
.alias('algorithm', 'a')
.nargs('algorithm', 1)
.describe('algorithm', 'Encryption/Decryption Algorithm')
.choices('algorithm', [DEFAULT_ALGORITHM,])
.epilogue(EPILOGUE_TEXT)
.argv;