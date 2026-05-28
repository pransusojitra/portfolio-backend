const Project = require('../models/Project');
const ChatHistory = require('../models/ChatHistory');
const AppError = require('../utils/AppError');

const GEMINI_API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

const getGeminiConfig = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

  if (!apiKey) {
    throw new AppError('Gemini API key is not configured', 500);
  }

  return { apiKey, model };
};

const extractKeywords = (message) => {
  const techKeywords = [
    'react', 'vue', 'angular', 'node', 'express', 'mongo', 'sql', 'postgres',
    'typescript', 'javascript', 'python', 'django', 'flask', 'next', 'nuxt',
    'graphql', 'rest', 'api', 'docker', 'kubernetes', 'aws', 'firebase',
    'tailwind', 'bootstrap', 'css', 'html', 'redux', 'mern', 'mean', 'fullstack',
    'frontend', 'backend', 'mobile', 'ai', 'machine learning', 'devops',
  ];
  const lower = message.toLowerCase();
  return techKeywords.filter((kw) => lower.includes(kw));
};

const detectCategory = (message) => {
  const lower = message.toLowerCase();
  const categoryMap = {
    frontend: ['frontend', 'ui', 'interface', 'react', 'vue', 'angular'],
    backend: ['backend', 'api', 'server', 'node', 'express', 'django'],
    fullstack: ['fullstack', 'full stack', 'full-stack', 'mern', 'mean'],
    mobile: ['mobile', 'android', 'ios', 'react native', 'flutter'],
    ai: ['ai', 'machine learning', 'deep learning', 'nlp', 'gemini', 'gpt'],
    devops: ['devops', 'docker', 'kubernetes', 'ci/cd', 'aws', 'cloud'],
  };

  for (const [cat, terms] of Object.entries(categoryMap)) {
    if (terms.some((term) => lower.includes(term))) return cat;
  }

  return null;
};

const fetchRelevantProjects = async (message) => {
  const keywords = extractKeywords(message);
  const category = detectCategory(message);

  if (keywords.length > 0) {
    try {
      const textResults = await Project.find(
        { $text: { $search: keywords.join(' ') } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(5)
        .lean();

      if (textResults.length > 0) return textResults;
    } catch (_) {
      // Text index may not exist yet; regex search below is the fallback.
    }

    const regexes = keywords.map((kw) => new RegExp(kw, 'i'));
    const regexQuery = {
      $or: [
        { title: { $in: regexes } },
        { description: { $in: regexes } },
        { technologies: { $in: regexes } },
      ],
    };

    if (category) regexQuery.category = category;

    const regexResults = await Project.find(regexQuery).limit(5).lean();
    if (regexResults.length > 0) return regexResults;
  }

  if (category) {
    return Project.find({ category }).limit(5).lean();
  }

  return Project.find({ featured: true }).sort({ createdAt: -1 }).limit(5).lean();
};

const formatProjectsForContext = (projects) => {
  if (!projects.length) return 'No matching projects found.';

  return projects
    .map((project, index) => {
      const technologies = (project.technologies || []).join(', ');
      const description = project.shortDescription || project.description?.slice(0, 150) || '';

      return `${index + 1}. ${project.title} [${project.category}]
Technologies: ${technologies}
Description: ${description}
${project.githubUrl ? `GitHub: ${project.githubUrl}` : ''}
${project.liveDemoUrl ? `Live Demo: ${project.liveDemoUrl}` : ''}`;
    })
    .join('\n\n');
};

const toGeminiContents = (messages) =>
  messages.map((message) => ({
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: message.content }],
  }));

const callGemini = async ({ systemPrompt, messages }) => {
  const { apiKey, model } = getGeminiConfig();
  const url = `${GEMINI_API_BASE_URL}/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: toGeminiContents(messages),
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 600,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data.error?.message || 'Gemini request failed';
    throw new AppError(message, response.status);
  }

  const reply = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || '')
    .join('')
    .trim();

  if (!reply) {
    throw new AppError('Gemini returned an empty response', 502);
  }

  return {
    reply,
    tokensUsed: data.usageMetadata?.totalTokenCount || 0,
    model,
  };
};

const processChat = async (userMessage, sessionId, userId = null, ipAddress = '') => {
  const projects = await fetchRelevantProjects(userMessage);
  const projectContext = formatProjectsForContext(projects);

  let chatHistory = await ChatHistory.findOne({ sessionId });
  if (!chatHistory) {
    chatHistory = new ChatHistory({ sessionId, userId, ipAddress, messages: [] });
  }

  const systemPrompt = `You are an intelligent AI assistant for a developer portfolio website.
Help visitors discover projects, answer technical questions, and make practical recommendations.

PORTFOLIO CONTEXT:
${projectContext}

GUIDELINES:
- Be conversational, helpful, and technically accurate.
- When showing projects, use a clear structured format.
- If asked about skills or technologies, use the actual project data above.
- For general coding questions, answer directly.
- Keep responses concise unless the user asks for detail.
- Recommend GitHub or live demo links when available.
- If no projects match, suggest alternatives from the portfolio.
- Support FAQ topics: contact info, skills, experience, and project details.

CURRENT DATE: ${new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}`;

  const recentMessages = chatHistory.messages.slice(-20).map((message) => ({
    role: message.role,
    content: message.content,
  }));

  const { reply, tokensUsed, model } = await callGemini({
    systemPrompt,
    messages: [
      ...recentMessages,
      { role: 'user', content: userMessage },
    ],
  });

  chatHistory.messages.push({ role: 'user', content: userMessage });
  chatHistory.messages.push({ role: 'assistant', content: reply });
  chatHistory.totalTokensUsed += tokensUsed;
  chatHistory.model = model;
  await chatHistory.save();

  return { reply, tokensUsed, projectsFound: projects.length };
};

module.exports = { processChat };
