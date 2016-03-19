#!/usr/bin/env node

const yargs = require('yargs')
const CONSTANTS = require('./constants.js');
const commands = require('./commands.js')

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
},commands.encrypt)
.command('decrypt','Decrypt file', function(yargs) {
    return yargs
    .demand(2)
    .option('password', CONSTANTS.YARGS_OPTIONS_DECRYPT_PASSWORD)
    .option('algorithm', CONSTANTS.YARGS_OPTIONS_DECRYPT_ALOGORITHM)
    .usage(CONSTANTS.YARGS_OPTIONS_DECRYPT_USAGE)
    .example(CONSTANTS.YARGS_OPTIONS_DECRYPT_EXAMPLE_1)
    .example(CONSTANTS.YARGS_OPTIONS_DECRYPT_EXAMPLE_2)
    .help()
},commands.decrypt)
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