import OpenAI from 'openai';

// Initialize the OpenAI client with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// @desc    Summarize session text
// @route   POST /api/ai/summarize
// @access  Private
const summarizeSession = async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === '') {
    return res.status(400).json({ message: 'Please provide text to summarize.' });
  }

  // This is our "prompt engineering". We give the AI a role and a specific format for the output.
  const prompt = `
    You are a helpful assistant for a mentorship platform called SkillSync.
    Your task is to summarize the following session notes or chat log.
    The summary should be concise (2-3 sentences).
    After the summary, provide a clear, bulleted list of actionable "Next Steps" for the mentee based on the text.
    Format your entire response in Markdown.

    Here is the text to summarize:
    ---
    ${text}
    ---
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // A fast and cost-effective model
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5, // A bit of creativity, but not too much
    });

    const summary = completion.choices[0].message.content;
    res.json({ summary });

  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).json({ message: 'Failed to generate summary from AI.', details: error.message });
  }
};

export { summarizeSession };