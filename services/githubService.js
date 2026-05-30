const githubClient = require('../config/github');

async function fetchUserAndRepos(username) {
    // Fetch user profile
    const userRes = await githubClient.get(`/users/${username}`);
    const user = userRes.data;

    // Fetch all repositories (handle pagination)
    let repos = [];
    let page = 1;
    while (true) {
        const reposRes = await githubClient.get(`/users/${username}/repos`, {
            params: { per_page: 100, page, sort: 'pushed' }
        });
        if (reposRes.data.length === 0) break;
        repos.push(...reposRes.data);
        page++;
    }

    // Calculate insights
    let totalStars = 0;
    const langCount = {};

    for (const repo of repos) {
        totalStars += repo.stargazers_count;
        if (repo.language) {
            langCount[repo.language] = (langCount[repo.language] || 0) + 1;
        }
    }

    // Find most used language (by repo count)
    let topLanguage = null;
    let maxCount = 0;
    for (const [lang, count] of Object.entries(langCount)) {
        if (count > maxCount) {
            maxCount = count;
            topLanguage = lang;
        }
    }

    return {
        id: user.id,
        login: user.login,
        name: user.name || null,
        public_repos: user.public_repos,
        followers: user.followers,
        total_stars: totalStars,
        top_language: topLanguage
    };
}

module.exports = { fetchUserAndRepos };