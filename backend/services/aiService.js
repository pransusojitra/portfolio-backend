const OpenAI = require('openai');
const Project = require('../models/Project');
const ChatHistory = require('../models/ChatHistory');
const AppError = require('../utils/AppError');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Extract meaningful keywords from a user message to drive a MongoDB search.
 */
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

/**
 * Determine project category from message intent.
 */
const detectCategory = (message) => {
  const lower = message.toLowerCase();
  const categoryMap = {
    frontend: ['frontend', 'ui', 'interface', 'react', 'vue', 'angular'],
    backend: ['backend', 'api', 'server', 'node', 'express', 'django'],
    fullstack: ['fullstack', 'full stack', 'full-stack', 'mern', 'mean'],
    mobile: ['mobile', 'android', 'ios', 'react native', 'flutter'],
    ai: ['ai', 'machine learning', 'deep learning', 'nlp', 'openai', 'gpt'],
    devops: ['devops', 'docker', 'kubernetes', 'ci/cd', 'aws', 'cloud'],
  };
  for (const [cat, terms] of Object.entries(categoryMap)) {
    if (terms.some((t) => lower.includes(t))) return cat;
  }
  return null;
};

/**
 * Fetch the most relevant projects from MongoDB based on user message.
 */
const fetchRelevantProjects = async (message) => {
  const query = {};
  const keywords = extractKeywords(message);
  const category = detectCategory(message);

  if (category) query.category = category;

  // Full-text search when keywords exist
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
      // Text index might not exist in dev — fall through to regex search
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

  // Fallback: category filter or featured projects
  if (category) {
    return Project.find({ category }).limit(5).lean();
  }
  return Project.find({ featured: true }).sort({ createdAt: -1 }).limit(5).lean();
};

/**
 * Format project data as a concise text block for the AI prompt.
 */
const formatProjectsForContext = (projects) => {
  if (!projects.length) return 'No matching projects found.';
  return projects
    .map(
      (p, i) =>
        `${i + 1}. **${p.title}** [${p.category}]
   Technologies: ${(p.technologies || []).join(', ')}
   Description: ${p.shortDescription || p.description?.slice(0, 150)}...
   ${p.githubUrl ? `GitHub: ${p.githubUrl}` : ''}
   ${p.liveDemoUrl ? `Live Demo: ${p.liveDemoUrl}` : ''}`
    )
    .join('\n\n');
};

// ─── Main service function ────────────────────────────────────────────────────

/**
 * Process a user chat message:
 *  1. Fetch relevant projects from MongoDB
 *  2. Build an optimised system prompt with portfolio context
 *  3. Send to OpenAI with conversation history
 *  4. Persist the exchange to ChatHistory
 *  5. Return the AI reply
 *
 * @param {string} userMessage   The user's question
 * @param {string} sessionId     Unique session identifier
 * @param {string|null} userId   Authenticated user ID (optional)
 * @param {string} ipAddress     Caller's IP for logging
 * @returns {{ reply: string, tokensUsed: number }}
 */
const processChat = async (userMessage, sessionId, userId = null, ipAddress = '') => {
  // 1. Fetch relevant projects
  const projects = await fetchRelevantProjects(userMessage);
  const projectContext = formatProjectsForContext(projects);

  // 2. Load or create chat history for this session
  let chatHistory = await ChatHistory.findOne({ sessionId });
  if (!chatHistory) {
    chatHistory = new ChatHistory({ sessionId, userId, ipAddress, messages: [] });
  }

  // 3. Build system prompt
  const systemPrompt = `You are an intelligent AI assistant for a developer's portfolio website.
Your role is to help visitors discover projects, answer technical questions, and provide smart recommendations.

PORTFOLIO CONTEXT:
${projectContext}

GUIDELINES:
- Be conversational, helpful, and technically accurate.
- When showing projects, use a structured format with emojis for readability.
- If asked about skills or technologies, refer to the actual project data above.
- For general coding questions, answer based on your knowledge.
- Keep responses concise but informative (max 300 words unless detail is needed).
- Always recommend checking GitHub or Live Demo links when available.
- If no projects match, suggest alternatives from the portfolio.
- Support FAQ topics: contact info, skills, experience, project details.

CURRENT DATE: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;

  // 4. Build messages array (last 10 exchanges for context window efficiency)
  const recentMessages = chatHistory.messages.slice(-20).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const messages = [
    { role: 'system', content: systemPrompt },
    ...recentMessages,
    { role: 'user', content: userMessage },
  ];

  // 5. Call OpenAI
  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    messages,
    max_tokens: 600,
    temperature: 0.7,
  });

  const reply = completion.choices[0].message.content;
  const tokensUsed = completion.usage?.total_tokens || 0;

  // 6. Persist conversation
  chatHistory.messages.push({ role: 'user', content: userMessage });
  chatHistory.messages.push({ role: 'assistant', content: reply });
  chatHistory.totalTokensUsed += tokensUsed;
  chatHistory.model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
  await chatHistory.save();

  return { reply, tokensUsed, projectsFound: projects.length };
};

module.exports = { processChat };
