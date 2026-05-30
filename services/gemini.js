const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL_NAME = 'gemini-flash-latest'

async function generateProfileSummary(userData, repos) {
    //repo info
    const repoInsights = repos.slice(0, 10).map(repo => ({
        name: repo.name,
        description: repo.description || '',
        language: repo.language || 'unknown',
        stars: repo.stargazers_count,
        forks: repo.forks_count
    }));
    
    //languages used
    const langMap = new Map();
    repos.forEach(repo => {
        if (repo.language) {
            langMap.set(repo.language, (langMap.get(repo.language) || 0) + 1);
        }
    });
    const topLanguages = Array.from(langMap.entries())
        .sort((a,b) => b[1] - a[1])
        .slice(0, 4)
        .map(([lang]) => lang)
        .join(', ');
    
    // Detect project types from repo 
    const keywords = ['api', 'app', 'web', 'mobile', 'cli', 'library', 'framework', 'game', 'tool', 'backend', 'frontend', 'fullstack', 'data', 'ml', 'ai', 'blockchain', 'iot'];
    const detectedTypes = [];
    repos.forEach(repo => {
        const text = `${repo.name} ${repo.description || ''}`.toLowerCase();
        keywords.forEach(kw => {
            if (text.includes(kw) && !detectedTypes.includes(kw)) detectedTypes.push(kw);
        });
    });
    const projectTypes = detectedTypes.slice(0, 3).join(', ');
    
    const prompt = `
        You are a GitHub profile summarizer. Write a very short (40-60 words) professional summary for this developer based on their GitHub data:
        
        Name: ${userData.name} || ${userData.login}
        Bio: ${userData.bio || 'Not provided'}
        Public repos count: ${userData.public_repos}
        Followers: ${userData.followers}
        Top languages used: ${topLanguages || 'N/A'}
        Project types detected: ${projectTypes || 'mixed'}
        Example repos (name + description):
        ${repoInsights.map(r => `- ${r.name} (${r.language}): ${r.description.substring(0, 100)}`).join('\n')}
        
        Focus on their tech interests, project types, and what they seem to build. Be concise and insightful.
        Summary:
    `;
    
    try {
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        const result = await model.generateContent(prompt);
        let summary = result.response.text();
        // Clean up
        summary = summary.replace(/^(Summary:|Here is a summary:)/i, '').trim();
        return summary.slice(0, 500);
    } catch (error) {
        console.error('Gemini API error:', error.message);
        return `${userData.login} focuses on ${topLanguages || 'multiple languages'} with ${userData.public_repos} public repos. Projects include ${projectTypes || 'various types'}. ${userData.bio || ''}`.slice(0, 500);
    }
}

module.exports = { generateProfileSummary };