#!/usr/bin/env node
// Nodejs encryption of buffers
const yargs = require('yargs')
const ProgressBar = require('progress');
const inquirer = require("inquirer");
const crypto = require('crypto');
const fs = require('fs');
    
const DEFAULT_ALGORITHM = 'aes-256-ctr';
const EPILOGUE_TEXT = "Developed by Pachito Marco Calabrese"

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
    .usage("$0 encrypt [--password] [--algorithm] <INPUT_FILE> [<OUTPUT_FILE>]")
    .example("$0 encrypt --algorithm=aes256 myfile.txt")
    .example("$0 encrypt myfile.txt.encrypted")
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
    .usage("$0 decrypt [--password] [--algorithm] <INPUT_FILE> [<OUTPUT_FILE>]")
    .example("$0 decrypt --algorithm=aes256 myfile.txt.encrypted")
    .example("$0 decrypt myfile.txt.encrypted")
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
.usage("$0 <COMMAND> [--password] [--algorithm] <INPUT_FILE> <OUTPUT_FILE>")
.example("$0 encrypt myfile.txt")
.demand('password')
.alias('password', 'p')
.nargs('password', 1)
.describe('password', 'Encrypt/Decrypt Password')
.alias('algorithm', 'a')
.nargs('algorithm', 1)
.describe('algorithm', 'Encryption/Decryption Algorithm')
.choices('algorithm', crypto.getCiphers())
.epilogue(EPILOGUE_TEXT)
.argv;