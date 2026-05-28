const Project = require('../models/Project');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// ─── GET /api/search?q=...&type=... ──────────────────────────────────────────

/**
 * Global search across projects (extendable to other collections).
 *
 * Query params:
 *   q      — search string (required)
 *   type   — 'projects' | 'all' (default: 'all')
 *   limit  — max results per type (default: 6)
 */
const globalSearch = asyncHandler(async (req, res) => {
  const { q, type = 'all', limit = 6 } = req.query;

  if (!q || q.trim().length < 2) {
    return sendError(res, 'Search query must be at least 2 characters', 400);
  }

  const searchTerm = q.trim();
  const maxResults = Math.min(parseInt(limit) || 6, 20);
  const results    = {};

  if (type === 'projects' || type === 'all') {
    // Try full-text index first, fall back to regex
    try {
      results.projects = await Project.find(
        { $text: { $search: searchTerm } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(maxResults)
        .select('title shortDescription category technologies images createdAt');

      if (results.projects.length === 0) throw new Error('no text results');
    } catch {
      const regex = new RegExp(searchTerm, 'i');
      results.projects = await Project.find({
        $or: [
          { title: regex },
          { description: regex },
          { technologies: regex },
          { category: regex },
        ],
      })
        .limit(maxResults)
        .select('title shortDescription category technologies images createdAt');
    }
  }

  const totalResults = Object.values(results).reduce((acc, arr) => acc + arr.length, 0);

  return sendSuccess(
    res,
    { ...results, query: searchTerm, total: totalResults },
    `Found ${totalResults} result${totalResults !== 1 ? 's' : ''} for "${searchTerm}"`
  );
});

// ─── GET /api/search/suggestions?q=... ───────────────────────────────────────

/**
 * Lightweight auto-complete — returns project titles and technologies
 * matching the prefix query. Ideal for search-as-you-type dropdowns.
 */
const getSearchSuggestions = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 1) {
    return sendSuccess(res, { suggestions: [] }, 'No query provided');
  }

  const regex = new RegExp(`^${q.trim()}`, 'i');

  const projects = await Project.find({ title: regex })
    .limit(5)
    .select('title category');

  // Collect unique technology matches
  const techProjects = await Project.find({ technologies: regex })
    .limit(10)
    .select('technologies');

  const techSet = new Set();
  techProjects.forEach((p) =>
    p.technologies.forEach((t) => {
      if (regex.test(t)) techSet.add(t);
    })
  );

  const suggestions = [
    ...projects.map((p) => ({ type: 'project', label: p.title, category: p.category })),
    ...[...techSet].slice(0, 5).map((t) => ({ type: 'technology', label: t })),
  ];

  return sendSuccess(res, { suggestions }, 'Suggestions fetched');
});

module.exports = { globalSearch, getSearchSuggestions };
