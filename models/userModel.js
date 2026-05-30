const pool = require('../config/db');

async function upsertUser(userData) {
    const { id, login, name, public_repos, followers, total_stars, top_language } = userData;
    const sql = `
        INSERT INTO users (id, login, name, public_repos, followers, total_stars, top_language)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            public_repos = VALUES(public_repos),
            followers = VALUES(followers),
            total_stars = VALUES(total_stars),
            top_language = VALUES(top_language),
            last_fetched = CURRENT_TIMESTAMP
    `;
    const [result] = await pool.execute(sql, [id, login, name, public_repos, followers, total_stars, top_language]);
    return result;
}

async function findByLogin(username) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE login = ?', [username]);
    return rows[0];
}

async function findAllUsers() {
    const [rows] = await pool.execute('SELECT * FROM users ORDER BY last_fetched DESC');
    return rows;
}

module.exports = { upsertUser, findByLogin, findAllUsers };