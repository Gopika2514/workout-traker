const db = require("../models");
const router = require("express").Router();

//get workouts
router.get("/api/workouts", (req, res) => {

    db.Workout.find({}).then(dbWorkout => {
        console.log("ALL WORKOUTS");
        console.log(dbWorkout);
        dbWorkout.forEach(workout => {
            var total = 0;
            workout.exercises.forEach(e => {
                total += e.duration;
            });
            workout.totalDuration = total;

        });


        res.json(dbWorkout);
    })
    // db.Workout.aggregate([
    //     {
    //         $addFields: {
    //             totalDuration: {
    //                 $sum: '$exercises.duration'
    //             }
    //         }
    //     }
    // ]).then(dbWorkout => {
    //     res.json(dbWorkout)
    // })
        .catch (err => {
            res.json(err);
        });
});

// add exercise
router.put("/api/workouts/:id", (req, res) => {

    db.Workout.findOneAndUpdate(
        { _id: req.params.id },
        {
            $inc: { totalDuration: req.body.duration },
            $push: { exercises: req.body }
        },
        { new: true }).then(dbWorkout => {
            res.json(dbWorkout);
        }).catch(err => {
            res.json(err);
        });

});

//create workout
router.post("/api/workouts", ({ body }, res) => {
    // console.log("WORKOUT TO BE ADDED");
    // console.log(body);

    db.Workout.create(body).then((dbWorkout => {
        res.json(dbWorkout);
    })).catch(err => {
        res.json(err);
    });
});

// get workouts in range
router.get("/api/workouts/range", (req, res) => {

    db.Workout.aggregate([
        {
            $addFields: {
                totalDuration: {
                    $sum: '$exercises.duration'
                }
            }
        }
    ])
        .sort({ _id: -1 }).limit(7).then(data => {
            console.log(data)
            res.json(data)
        }).catch(err => {
            res.json(err);
        })

});


module.exports = router;