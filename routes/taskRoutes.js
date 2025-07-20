const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  createTask,
  getWorkspaceTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

router.use(protect);

// Create a task
router.post("/", createTask);

// Get all tasks in a workspace
router.get("/workspace/:workspaceId", getWorkspaceTasks);

// Update a task
router.put("/:taskId", updateTask);

// Delete a task
router.delete("/:taskId", deleteTask);

module.exports = router;
