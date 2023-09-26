import TodoModel from "../models/todoModel.js";

// Get all todos
export const getTodos = async (req, res) => {
  try {
    // Find all todos
    const todos = await TodoModel.find({});

    // Return todos
    return res.status(200).json(todos);
  } catch (error) {
    // If there is an error, return 500 and the error message
    // You can read more about HTTP status codes here:
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    // Or this meme:
    // https://external-preview.redd.it/VIIvCoTbkXb32niAD-rxG8Yt4UEi1Hx9RXhdHHIagYo.jpg?auto=webp&s=6dde056810f99fc3d8dab920379931cb96034f4b
    return res.status(500).json({ message: error.message });
  }
};
// Create a todo
export const createTodo = async (req, res) => {
  const { title,select1Value:select1,select2Value:select2,description } = req.body;
  console.log(req.body);
  //console.log("createfuntionok");
  // Check title and description
  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "Title and description are required!" });
  }

  // Create a new todo
  try {
    const newTodo = await TodoModel.create({
      title,
      select1,
      select2,
      description,
      completed: false,
    });
    console.log("createfuntionok");
    return res.status(201).json(newTodo);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
   
  }
};

// Update a todo
export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { titlechange, select1Valuechange,select2Valuechange,descriptionchange, completed } = req.body;
  
  try {
    // Check if the id is valid
    const existedTodo = await TodoModel.findById(id);
    if (!existedTodo) {
      return res.status(404).json({ message: "Todo not found!" });
    }
    console.log("getin2");
    // Update the todo
    if (titlechange !== undefined) existedTodo.title = titlechange;
    if (descriptionchange !== undefined) existedTodo.description = descriptionchange;
    existedTodo.select1 = select1Valuechange;
    existedTodo.select2 = select2Valuechange;
    if (completed !== undefined) existedTodo.completed = completed;

    console.log(existedTodo.select1);

    // Save the updated todo
    await existedTodo.save();

    // Rename _id to id
    existedTodo.id = existedTodo._id;
    delete existedTodo._id;
    console.log("fuck");
    return res.status(200).json(existedTodo);
  } catch (error) {
    return res.status(500).json({ message: error.message });
    console.log(error);
    console.log("failtoupdate");
  }
};

// Delete a todo
export const deleteTodo = async (req, res) => {
  const { id } = req.params;
  try {
    // Check if the id is valid
    const existedTodo = await TodoModel.findById(id);
    if (!existedTodo) {
      return res.status(404).json({ message: "Todo not found!" });
    }
    // Delete the todo
    await TodoModel.findByIdAndDelete(id);
    return res.status(200).json({ message: "Todo deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
