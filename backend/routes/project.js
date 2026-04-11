import express from "express";
import { auth } from "../middleware/auth.js";
import Project from "../models/Project.js";
import { v4 as uuidv4 } from "uuid";


const router = express.Router();

router.post("/", auth, async (req, res) => {
  const project = await Project.create({
    name: req.body.name,
    owner: req.user.id,
    members: [req.user.id],
  });

  res.json(project);
});

router.get("/", auth, async (req, res) => {
  const projects = await Project.find({
    members: req.user.id,
  });

  res.json(projects);
});

// router.post("/invite/:id", auth, async (req, res) => {
//   const token = uuidv4();

//   const project = await Project.findByIdAndUpdate(
//     req.params.id,
//     { inviteToken: token, inviteExpiry: Date.now() + 30 * 60 * 1000 },
//     { new: true }
//   );

//   res.json({ token });
// });

router.get("/:id/members", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    res.json(project.members);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching members" });
  }
});


// Generate invite
router.post("/invite/:id", auth, async (req, res) => {
  try {
    const token = uuidv4();

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        inviteToken: token,
        inviteExpiry: Date.now() + 30 * 60 * 1000,
      },
      { new: true }
    );

    const link = `${window.location.origin}/${token}`;

    // ✅ IMPORTANT RETURN
    res.json({
      inviteLink: link,
    });

  } catch (err) {
    res.status(500).json({ msg: "Error generating invite" });
  }
});

router.post("/join/:token", auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      inviteToken: req.params.token,
      inviteExpiry: { $gt: Date.now() },
    });

    if (!project) {
      return res.status(400).json({ msg: "Invalid or expired link" });
    }

    // avoid duplicate
    if (!project.members.includes(req.user.id)) {
      project.members.push(req.user.id);
      await project.save();
    }

    res.json({ msg: "Joined successfully", projectId: project._id });
  } catch (err) {
    res.status(500).json({ msg: "Error joining project" });
  }
});
export default router;