// Nodejs encryption of buffers
var yargs = require('yargs')
var crypto = require('crypto');
    
var DEFAULT_ALGORITHM = 'aes-256-ctr';
var EPILOGUE_TEXT = "Developed by Pachito Marco Calabrese"

var fs = require('fs');
var zlib = require('zlib');

// start pipe
//r.pipe(zip).pipe(encrypt).pipe(decrypt).pipe(unzip).pipe(w);
//r.pipe(encrypt).pipe(w);

/* commands */
yargs
.usage('Usage: $0 <command> [options]')
.command('encrypt','Encrypt file', function(yargs) {
    return yargs
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
    .usage("encrypt --password=[PASSWORD] <INPUT_FILE> <OUTPUT_FILE>")
    .help()
},function (argv) {
    var r = fs.createReadStream(argv._[1] || 'file.txt');
    var encrypt = crypto.createCipher(argv.algorithm, argv.password);
    var w = fs.createWriteStream(argv._[2] || 'file.out.txt');
    r.pipe(encrypt).pipe(w);
    console.log(argv._[1]+" encrypted, "+argv._[2]+" generated");
})
.command('decrypt','Descrypt file', function(yargs) {
    return yargs
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
    .usage("decrypt --password=[PASSWORD] <INPUT_FILE> <OUTPUT_FILE>")
    .help()
},function (argv) {
    var r = fs.createReadStream(argv._[1] || 'file.txt');
    var decrypt = crypto.createDecipher(argv.algorithm, argv.password)
    var w = fs.createWriteStream(argv._[2] || 'file.out.txt');
    r.pipe(decrypt).pipe(w);
    console.log(argv._[1]+" decrypted, "+argv._[2]+" generated");
})
.demand(1)
.example("$0 encrypt --password=[PASSWORD] <INPUT_FILE> <OUTPUT_FILE>")
.demand('p')
.alias('p', 'password')
.nargs('p', 1)
.describe('p', 'Encrypt/Decrypt Password')
.epilogue(EPILOGUE_TEXT)
.argv;