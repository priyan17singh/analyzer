const githubClient = require('../config/github');
const pool = require('../config/db');
const { computeRepoInsights } = require('../utils/insights');
const { upsertUser } = require('../models/userModel');
const { generateProfileSummary } = require('../services/gemini');  

// Fetch user from GitHub, compute insights, store in DB
const analyzeAndStore = async (req, res) => {
    const { username } = req.params;
    try {
        // fetch user profile
        const userRes = await githubClient.get(`/users/${username}`);
        const user = userRes.data;

        // fetch all repos
        let repos = [];
        let page = 1;
        let hasMore = true;
        while (hasMore) {
            const reposRes = await githubClient.get(`/users/${username}/repos`, {
                params: { per_page: 100, page, sort: 'pushed' }
            });
            repos.push(...reposRes.data);
            if (reposRes.data.length < 100) hasMore = false;
            page++;
        }

        const summary = await generateProfileSummary(user, repos);

        console.log(`Generated summary for ${username}: ${summary}`);

        //compute insights
        const { totalStars, topLanguage } = computeRepoInsights(repos);

        await upsertUser({
            id: user.id,
            login: user.login,
            name: user.name,
            public_repos: user.public_repos,
            followers: user.followers,
            total_stars: totalStars,
            top_language: topLanguage,
            summary : summary
        });

        res.json({
            message: 'User analyzed and stored',
            user: {
                id: user.id,
                login: user.login,
                name: user.name,
                public_repos: user.public_repos,
                followers: user.followers,
                total_stars: totalStars,
                top_language: topLanguage,
                summary: summary
            }
        });
    } catch (err) {
        console.error(err);
        if (err.response?.status === 404) {
            return res.status(404).json({ error: 'GitHub user not found' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Fetch stored user data  from DB
const getUser = async (req, res) => {
    const { username } = req.params;
    try {
        const [rows] = await pool.execute('SELECT * FROM users WHERE login = ?', [username]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found in database. Analyze first via POST.' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM users ORDER BY last_fetched DESC');
        res.json({
            count: rows.length,
            users: rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

module.exports = { analyzeAndStore, getUser, getAllUsers };
