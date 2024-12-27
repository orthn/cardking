const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const card = require('cards');

const secretKey = process.env.JWT_SECRET;

function createQuizForUser(userId) {
    let quizId = 1;
    return quizId;
}

function getNextCard(quizId, currentCard) {
    return undefined;
}

router.get('/', function (req, res, next) {
    res.send("WIP: Default Quiz Page");
});

/**
 * Generates a quiz for an user and returns the quizId with JWT
 * POST: localhost:3000/quiz/startQuiz
 */
router.get('/startQuiz', function (req, res){
    const { userId } = req.body;
    const quizId = createQuizForUser(userId);

    const token = jwt.sign(
        {
            userId: userId,
            quizId : quizId,
            progress: {
                currentCard: 0,
                score: 0,
            }
        },
        secretKey,
        {expiresIn: '1h'}
    );

    res.json({ token });

});



/**
 * Returns the next card of the quiz
 */
router.get('getNextCard', async function (req, res){
    const token = req.headers.authorization;

    try {
        const decoded = jwt.verify(token, secretKey);
        const {userId, quizId, progress} = decoded;

        // get the next card of the quiz
        const nextCard = getNextCard(quizId, progress.currentCard);

        // update token
        const updatedToken = jwt.sign(
            {
                userId: userId,
                quizId: quizId,
                progress: {
                    currentCard: progress.currentCard + 1,
                    score: progress.score
                },
            },
            secretKey,
            { expiresIn: '1h' }
        );

        res.json({ card: nextCard, token: updatedToken });

    } catch (err) {
        res.status(401).json({error: 'Invalid or expired token'})
    }
});

/**
 *  Submit answer of current card and validate it
 */
router.post('submitAnswer', async function(req, res){
    const token = req.headers.authorization;

    try {
        const decoded = jwt.verify(token, secretKey);
        const {userId, quizId, progress} = decoded;

        const { cardId, answer } = req.body;

        // Call checkAnswer and get the result
        try {
            const { status, message } = await card.checkAnswer(cardId, answer);

            // If the result is an error, send the error response
            if (status >= 400) {
                return res.status(status).send(message);
            }

            // Otherwise continue
            let isCorrect = message.includes("correct");
            let newScore = isCorrect ? progress.score + 1 : progress.score;

            // Save progress and create a new token
            const updatedToken = jwt.sign(
                {
                    userId: userId,
                    quizId: quizId,
                    progress: { currentCard: progress.currentCard, score: newScore },
                },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Send the response with updated score and token
            res.status(status).json({ isCorrect, message, token: updatedToken });

        } catch (err) {
            res.status(401).json({ error: 'Error occured during answer check'});
        }
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});


module.exports = router
