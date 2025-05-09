const Express = require("express");
const router = Express.Router();
let validateJWT = require("../middleware/validate-jwt");

const { ReviewModel } = require("../models")

// router.get('/practice', validateJWT, (req,res) => {
//     res.send('Hey!! This is a practice route!')
// })

// Review Create
router.post("/create", validateJWT, async (req,res) => {
    if (req.user.role === "admin" || req.user.role === "user"){
    const { gametitle, gameimage, date, feedback, rating } = req.body;
    const { id } = req.user;
    const reviewEntry = {
        gametitle,
        gameimage,
        date,
        feedback,
        rating,
        owner: id
    }
    try {
        const newReview = await ReviewModel.create(reviewEntry);
        res.status(200).json(newReview);
    } catch (err) {
        res.status(500).json({error: err });
    }
}
})

// Review Update

router.put("/update/:feedbackId", validateJWT, async (req, res) => {
    if (req.user.role === "user"){
    const { gametitle, date, feedback, rating } = req.body;
    const reviewId = req.params.feedbackId;
    const userId = req.user.id;

    const query = {
        where: {
            id: reviewId, 
            owner: userId
        }
    };

    const updatedReview = {
        gametitle: gametitle,
        date: date,
        feedback: feedback,
        rating: rating
    };

    try {
        const update = await ReviewModel.update(updatedReview, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({ error:err });
    }
} else if (req.user.role === "admin") {
    const { gametitle, date, feedback, rating } = req.body;
    const reviewId = req.params.feedbackId;

    const query = {
        where: {
            id: reviewId,
        }
    };

    const updatedReview = {
        gametitle: gametitle,
        date: date,
        feedback: feedback,
        rating: rating
    };

    try {
        const update = await ReviewModel.update(updatedReview, query);
        res.status(200).json(update);
    } catch (err) {
        res.status(500).json({ error:err });
    }
}
})

// Review Delete

router.delete("/delete/:id", validateJWT, async (req, res) =>{
    if (req.user.role === "user"){
    const userId = req.user.id;
    const reviewId = req.params.id;
    try {
        const query = {
            where: {
                id: reviewId,
                owner: userId
            }
        };
        await ReviewModel.destroy(query);
        res.status(200).json({ message: "Review Entry Removed" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
} else if (req.user.role === "admin") {
    const reviewId = req.params.id;

    try {
        const query = {
            where: {
                id: reviewId,
            }
        };
        await ReviewModel.destroy(query);
        res.status(200).json({ message: "Review Entry Removed" });
    } catch (err) {
        res.status(500).json({ error: err });
    }
}
});

// Review Mine

router.get("/mine", validateJWT, async (req, res) => {
    if (req.user.role === 'user'){
        const { id } = req.user;
        try {
            const userReviews = await ReviewModel.findAll({
                where: {
                    owner: id
                }
            });
            res.status(200).json(userReviews);
        } catch (err) {
            res.status(500).json({ error: err });
        }
    } else if (req.user.role === 'admin') {
        try {
            const entries = await ReviewModel.findAll();
            res.status(200).json(entries);
        } catch (err) {
            res.status(500).json({ error: err })
        }
    }
})

// Review All

router.get("/", async (req, res) => {
    try {
        const entries = await ReviewModel.findAll();
        res.status(200).json(entries);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

module.exports = router;