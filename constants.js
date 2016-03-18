const crypto = require('crypto');

const DEFAULT_ALGORITHM = 'aes-256-ctr';

const CONSTANTS = {
    DEFAULT_ALGORITHM : DEFAULT_ALGORITHM,
    EPILOGUE_TEXT: 'Developed with <3 by Pachito Marco Calabrese <pm.calabrese@gmail.com> - learn more at https://github.com/pmcalabrese/criptio',
    QUESTION_PASSWORD: {
        type: 'password',
        name: 'password',
        message: 'Type your encrypt/decrypt password'
    },
    QUESTION_ALGORITHM: {
        type: 'list',
        name: 'algorithm',
        message: 'Choose an encrypt/decrypt algorithm',
        default: DEFAULT_ALGORITHM,
        choices: crypto.getCiphers()
    },
    YARGS_OPTIONS_ENCRYPT_PASSWORD: {
        alias: 'p',
        describe: 'Encrypt Password'
    },
    YARGS_OPTIONS_ENCRYPT_ALOGORITHM: {
        alias: 'a',
        describe: 'Encrypt algorithm',
        default: DEFAULT_ALGORITHM,
        demand: false
    },
    YARGS_OPTIONS_ENCRYPT_USAGE: '$0 encrypt [--password] [--algorithm] <INPUT_FILE> [OUTPUT_FILE]',
    YARGS_OPTIONS_ENCRYPT_EXAMPLE_1: '$0 encrypt --algorithm='+DEFAULT_ALGORITHM+' myfile.txt',
    YARGS_OPTIONS_ENCRYPT_EXAMPLE_2: '$0 encrypt myfile.txt.encrypted',YARGS_OPTIONS_DECRYPT_PASSWORD: {
        alias: 'p',
        describe: 'Decrypt Password'
    },
    YARGS_OPTIONS_DECRYPT_ALOGORITHM: {
        alias: 'a',
        describe: 'Decrypt algorithm',
        default: DEFAULT_ALGORITHM,
        demand: false
    },
    YARGS_OPTIONS_DECRYPT_USAGE: '$0 decrypt [--password] [--algorithm] <INPUT_FILE> [OUTPUT_FILE]',
    YARGS_OPTIONS_DECRYPT_EXAMPLE_1: '$0 decrypt --algorithm='+DEFAULT_ALGORITHM+' myfile.txt.encrypted',
    YARGS_OPTIONS_DECRYPT_EXAMPLE_2: '$0 decrypt myfile.txt.encrypted',
    YARGS_USAGE: '$0 <COMMAND> [--password] [--algorithm] <INPUT_FILE> [OUTPUT_FILE]',
    YARGS_EXAMPLE: '$0 encrypt myfile.txt',
    YARGS_OPTIONS_PASSWORD: 'Encrypt/Decrypt Password',
    YARGS_OPTIONS_ALGORITHM: 'Encryption/Decryption Algorithm',
    
}

module.exports = CONSTANTS;