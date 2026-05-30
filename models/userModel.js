const pool = require('../config/db');

async function upsertUser(userData) {
    const { id, login, name, public_repos, followers, total_stars, top_language, summary } = userData;
    const sql = `
        INSERT INTO users (id, login, name, public_repos, followers, total_stars, top_language, summary)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            public_repos = VALUES(public_repos),
            followers = VALUES(followers),
            total_stars = VALUES(total_stars),
            top_language = VALUES(top_language),
            summary = VALUES(summary),
            last_fetched = CURRENT_TIMESTAMP
    `;
    const [result] = await pool.execute(sql, [id, login, name, public_repos, followers, total_stars, top_language, summary]);
    return result;
}

module.exports = { upsertUser };