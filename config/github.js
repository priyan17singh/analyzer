const axios = require('axios');
require('dotenv').config();

const githubClient = axios.create({
    baseURL: 'https://api.github.com',
    headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json'
    }
});

module.exports = githubClient;