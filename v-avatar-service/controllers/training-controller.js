const TrainingPost = require("../models/training-model");

exports.getTraining = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    let fetchedTrainings;
    const postQuery = TrainingPost.find();

    if (pageSize && currentPage) {
        postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }

    postQuery.find()
        .then((documents) => {
            fetchedTrainings = documents;
            return TrainingPost.find().count();
        })
        .then((count) => {
            res.status(200).json({
                message: "Trainings fetched successfully!",
                trainings: fetchedTrainings,
                maxTrainings: count,
            });
        })
        .catch((error) => {
            res.status(500).json({
                message: "Fetching trainings failed!",
            });
        });
}
