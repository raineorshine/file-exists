#!/usr/bin/env node
'use strict'

const fileExists = require('./index')
const mri = require('mri')

const options = mri(process.argv.slice(2))
const args = options._.join('')

if(fileExists(options)) {
  console.log(`${file} exists`)
  process.exit(!options.not)
}
else {
  process.exit(options.not)
}
