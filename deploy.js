/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config()
const { NodeSSH } = require('node-ssh')

const fs = require('fs')
const ssh = new NodeSSH()

async function run() {
  await ssh.connect({
    host: process.env.DEPLOY_HOST,
    username: process.env.DEPLOY_USER,
    password: process.env.DEPLOY_PASSWD,
  })

  const apiPath = __dirname + '/packages/server'
  const expeditorsPagePath = __dirname + '/packages/app'
  const formPath = __dirname + '/packages/form'

  await ssh.execCommand('rm -rf /var/www/api', { cwd: '/' })

  console.info('[SERVER] Folder removed')

  await ssh.putDirectory(`${apiPath}/dist`, `${process.env.DEPLOY_SERVER_PATH}`, {
    recursive: true,
    concurrency: 10,
  })

  console.info('[SERVER] Folder putted in')

  await ssh.putFile(`${apiPath}/package.json`, `${process.env.DEPLOY_SERVER_PATH}/package.json`)

  console.info('[SERVER] Package file putted in')

  await ssh.execCommand('npm i', { cwd: `${process.env.DEPLOY_SERVER_PATH}` })

  console.info('[SERVER] Packages installed')

  console.info('[SERVER] Deployed succesefully')

  await ssh.execCommand('rm -rf /var/www/app', { cwd: '/' })

  console.info('[CLIENT] Folder removed')

  await ssh.putDirectory(`${expeditorsPagePath}/dist`, `${process.env.DEPLOY_CLIENT_PATH}`, {
    recursive: true,
    concurrency: 10,
  })

  console.info('[CLIENT] Deployed succesefully')

  await ssh.execCommand('rm -rf /var/www/form', { cwd: '/' })

  await ssh.putDirectory(`${formPath}/dist`, `${process.env.DEPLOY_FORM_PATH}`, {
    recursive: true,
    concurrency: 10,
  })

  console.info('[FORM] Deployed succesefully')

  fs.rmdir(`${apiPath}/dist`, { recursive: true }, () => {
    console.log(`${apiPath}/dist is deleted!`)
    fs.rmdir(`${expeditorsPagePath}/dist`, { recursive: true }, () => {
      console.log(`${expeditorsPagePath}/dist is deleted!`)
      fs.rmdir(`${formPath}/dist`, { recursive: true }, () => {
        console.log(`${formPath}/dist is deleted!`)

        process.exit()
      })
    })
  })
}

run()
