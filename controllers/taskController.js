const Task = require("../models/taskModel");
const Workspace = require("../models/workspaceModel");

//create task
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, assignedTo, workspaceId } = req.body;
    const task = new Task({
      title,
      description,
      dueDate,
      assignedTo,
      createdBy: req.user.id,
      workspaceId,
    });
    const savedTask = await task.save();
    await Workspace.findByIdAndUpdate(workspaceId, {
      $push: { tasks: savedTask._id },
    });
    res.status(200).json({ msg: "Task created", data: savedTask });
  } catch (error) {
    console.log("Created Task error:", error);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

//get all tasks for a workspace (for kanban)
exports.getWorkspaceTasks = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const tasks = await Task.find({ workspaceId })
      .populate("assignedTo", "name avatar")
      .populate("createdBy", "name");

    res.status(200).json({ msg: "Tasks fetched", data: tasks });
  } catch (error) {
    console.log("GEt Tasks error:", error);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

//update a task (title, status, assignedTo, etc.)
exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updates = req.body;
    const updatedTask = await Task.findByIdAndUpdate(taskId, updates, {
      new: true,
    });
    res.status(200).json({ msg: "Task updated", data: updatedTask });
  } catch (error) {
    console.log("Update Task error: ", error);
    res.status(500).json({ msg: "Something went wrong" });
  }
};

//delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ msg: "Task not found" });
    await Task.findByIdAndDelete(taskId);
    await Workspace.findByIdAndUpdate(task.workspaceId, {
      $pull: { tasks: taskId },
    });
    res.status(200).json({ msg: "Task deleted" });
  } catch (error) {
    console.log("Delete Task error: ", error);
    res.status(500).json({ msg: "Something went wrong" });
  }
};
