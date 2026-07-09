const Report = require('../models/report.model');
const { GoogleGenAI } = require('@google/genai')

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

exports.handleChat = async (req, res) => {
    try {
        const { prompt } = req.body;

        // fetch context
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

        const recentReports = await Report.find({
            status: 'submitted',
            createdAt: { $gte: twoWeeksAgo }
        }).populate('userId', 'fullName').populate('projectId', 'name');

        // format context for the llm
        const simplifiedReports = recentReports.map(r => ({
            employee: r.userId?.fullName,
            project: r.projectId?.name,
            completed: r.tasksCompleted,
            planned: r.tasksPlanned,
            blockers: r.blockers,
            date: r.weekStartDate
        }));

        // prompt
        const systemPrompt = `
        Your are an intelligent assistant at a comapny called Sisenco that helps summarize weekly reports.
        Your job is to answer questions about team activity based strictly on the following recent reports data.
        If the data does not conatine answer, politely state that you do not have enough information to answer the question.
        Be concise, professional, and directly answer the question. Do not make up any information.

        CURRENT REPORT DATA:
        ${JSON.stringify(simplifiedReports)}
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: `${systemPrompt}\n\nUser Question: ${prompt}`,
        });

        res.status(200).json({ reply: response.text });
    } catch (error) {
        console.error("AI error", error);
        res.status(500).json({ message: 'Error processing AI request', error: error.message });
    }
};