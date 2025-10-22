var express = require("express");
const { Prompt } = require("../model/prompt");
var router = express.Router();

/* GET users listing. */
router.get("/get-all-prompts", async function (req, res, next) {
  try {
    const prompts = await Prompt.find({
      userId: {
        $ne: req.userId,
      },
    });
    return res.json(prompts);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/search-prompts", async function (req, res, next) {
  try {
    const prompts = await Prompt.find({
      $and: [
        {
          userId: {
            $ne: req.userId,
          },
        },
        {
          $or: [
            {
              title: { $regex: req.query.search, $options: "i" },
            },
            {
              prompt: { $regex: req.query.search, $options: "i" },
            },
          ],
        },
      ],
    });
    return res.json(prompts);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});
router.get("/get-my-prompts", async function (req, res, next) {
  try {
    const prompts = await Prompt.find({ userId: req.userId });
    return res.json(prompts);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

router.post("/create-prompt", async function (req, res, next) {
  try {
    const prompt = new Prompt({
      userId: req.userId,
      prompt: req.body.prompt,
      imageUrls: req.body.imageUrls,
      title: req.body.title,
      platform: req.body.platform,
    });
    await prompt.save();
    return res.json(prompt);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/get-prompt/:id", async function (req, res, next) {
  try {
    console.log(req.params.id);
    const prompt = await Prompt.findById(req.params.id);
    return res.json(prompt);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

router.put("/edit/:id", async function (req, res, next) {
  try {
    const prompt = await Prompt.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.json(prompt);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

router.delete("/delete/:id", async function (req, res, next) {
  try {
    const prompt = await Prompt.findByIdAndDelete(req.params.id);
    return res.json(prompt);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
