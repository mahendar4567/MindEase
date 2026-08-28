const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// @route   POST api/ai/suggestions
// @desc    Get AI mental wellness suggestions based on journal entry
router.post('/suggestions', auth, async (req, res) => {
  const { content } = req.body;
  
  try {
    // Check if API key is configured or just a placeholder
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      return res.json({ 
        suggestion: "Mock AI Suggestion: It sounds like you're processing a lot right now. Remember to take a deep breath, prioritize self-care, and know that it's okay to feel this way. (Add a real OpenAI key in the backend .env to get live suggestions!)" 
      });
    }

    const completion = await openai.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are an empathetic, professional mental wellness assistant. Based on the user's journal entry, provide a short (2-3 sentences), encouraging, and helpful suggestion or reflection to support their mental well-being." 
        },
        { role: "user", content: content }
      ],
      model: "gpt-3.5-turbo",
    });

    res.json({ suggestion: completion.choices[0].message.content });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('AI Server Error');
  }
});

module.exports = router;
