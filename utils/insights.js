// Compute total stars and top language from repos list
function computeRepoInsights(repos) {
    let totalStars = 0;
    const langCount = {};

    for (const repo of repos) {
        totalStars += repo.stargazers_count;
        if (repo.language) {
            langCount[repo.language] = (langCount[repo.language] || 0) + 1;
        }
    }

    let topLanguage = null;
    let maxCount = 0;
    for (const [lang, count] of Object.entries(langCount)) {
        if (count > maxCount) {
            maxCount = count;
            topLanguage = lang;
        }
    }

    return { totalStars, topLanguage };
}

module.exports = { computeRepoInsights };