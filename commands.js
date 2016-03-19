const inquirer = require("inquirer");
const crypto = require('crypto');
const fs = require('fs');
const ProgressBar = require('progress');
const CONSTANTS = require('./constants.js');

var questions = [CONSTANTS.QUESTION_PASSWORD,CONSTANTS.QUESTION_ALGORITHM]

function bar(stream, file, encrypt) {
    var barOpts = {
        width: 20,
        total: fs.statSync(file).size,
        clear: false
    };
    var bar = new ProgressBar((encrypt ? 'encrypting' : 'decrypting') + ' [:bar] :percent :etas', barOpts);
    stream.on('data', function (chunk) {
        bar.tick(chunk.length);
    });
}

var commands = {
    encrypt: function(argv) {
        inquirer.prompt(questions, function(answers) {
            const cipher = crypto.createCipher(answers.algorithm, answers.password);
            const r = fs.createReadStream(argv._[1]);
            const w = fs.createWriteStream(argv._[2] || argv._[1] + '.encrypted');
            bar(r, argv._[1], true)
            r.pipe(cipher).pipe(w);
            console.log(argv._[1] + " encrypted, " + (argv._[2] || argv._[1] + '.encrypted'));
        });
    },
    decrypt: function(argv) {
        inquirer.prompt(questions, function(answers) {
            const decipher = crypto.createDecipher(answers.algorithm, answers.password);
            const r = fs.createReadStream(argv._[1]);
            const w = fs.createWriteStream(argv._[2] || argv._[1] + '.decrypted');
            bar(r, argv._[1], false)
            r.pipe(decipher).pipe(w);
            console.log(argv._[1] + " decrypted, " + (argv._[2] || argv._[1] + '.decrypted'));
        });
    }
}

module.exports = commands;