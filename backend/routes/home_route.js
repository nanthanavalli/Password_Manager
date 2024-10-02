const express = require("express");
const router = express.Router();
const User = require("../model/user_model");
const aes = require("../middleware/aes");

router.get("/passwords", async (req, res, next) => {
  const result = await User.findOne(
    {
      _id: req.body.userId,
    },
    { passwordList: 1 }
  );
  const decryptedList = result.passwordList.map((ele) => {
    return {
      _id: ele._id,
      name: ele.name,
      username: ele.username,
      email: ele.email,
      password: aes.decrypt(
        ele.password.iv,
        ele.password.data,
        ele.password.tag
      ),
      url: ele.url,
      note: ele.note,
      type: ele.type,
    };
  });
  res.json(decryptedList);
});

router.post("/passwords", aes.encrypt, async (req, res, next) => {
  try {
    const result = await User.findOneAndUpdate(
      { _id: req.body.userId },
      {
        $push: {
          passwordList: {
            $each: [
              {
                email: req.body.email,
                password: {
                  iv: req.body.iv,
                  data: req.body.data,
                  tag: req.body.tag,
                },
                name: req.body.name,
                username: req.body.username,
                url: req.body.url,
                note: req.body.note,
                type: req.body.type,
              },
            ],
            $position: 0, // Insert at the beginning of the array
          },
        },
      },
      { new: true } // This option returns the modified document
    );
    res.json({ newId: result.passwordList[0]._id.toString() });
  } catch {
    res.status(400).json({ error: "Something went Wrong" });
  }
});

router.patch("/passwords", aes.encrypt, async (req, res, next) => {
  try {
    const result = await User.updateOne(
      {
        _id: req.body.userId,
        "passwordList._id": req.body._id,
      },
      {
        $set: {
          "passwordList.$.email": req.body.email,
          "passwordList.$.password": {
            iv: req.body.iv,
            data: req.body.data,
            tag: req.body.tag,
          },
          "passwordList.$.username": req.body.username,
          "passwordList.$.name": req.body.name,
          "passwordList.$.note": req.body.note,
          "passwordList.$.url": req.body.url,
          "passwordList.$.type": req.body.type,
        },
      }
    );
    res.send();
  } catch {
    res.status(400).json({ error: "Something went Wrong" });
  }
});

router.delete("/passwords/:_id", async (req, res, next) => {
  try {
    const result = await User.updateOne(
      { _id: req.body.userId },
      {
        $pull: {
          passwordList: { _id: req.params._id },
        },
      }
    );
    res.send();
  } catch {
    res.status(400).json({ error: "Something went wrong" });
  }
});

module.exports = router;
