const axios = require('axios');
require('dotenv').config();

const GITHUB_API = 'https://api.github.com';

const api = axios.create({
    baseURL: GITHUB_API,
    headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
    },
});

async function getIssues(state = 'all') {
    console.log('Token carregado:', process.env.GITHUB_TOKEN);

    const { data } = await api.get(`/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/issues`, {
        params: { state, per_page: 100 },
    });

    // Ignora Pull Requests (eles aparecem junto com issues)
    return data.filter(issue => !issue.pull_request);
}

module.exports = { getIssues };
