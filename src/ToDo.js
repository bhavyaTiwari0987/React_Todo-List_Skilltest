// Importing all the required components, functions and libraries
import { useEffect, useState, useMemo, useRef } from "react";
import "./ToDo.css";
import { fetchToDo, addToDo, deleteToDo, updateToDo } from "./api/index.js";
import { Store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

// TodoContainer component
function TodoContainer() {
  // setting up loading state
  const [isLoading, setisLoading] = useState(true);
  // setting up todo state
  const [Todo, setTodo] = useState([]);
  // setting up editing state
  const [isEdit, setisEdit] = useState({
    edit: false,
    task: {},
  });
  // setting up the userId
  const userId = 1;
  // For Add Task Form
  const title = useRef();

  // making a notification variable for react notifications
  const notifications = useMemo(() => {
    return {
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 1000,
        onScreen: true,
      },
    };
  }, []);

  // setting up function for updating the task
  async function updateHandler(task, requested) {
    if (requested) {
      setisEdit({
        edit: true,
        task,
      });
      return;
    }
    Store.addNotification({
      title: "In Progress",
      message: "updating data",
      type: "info",
      ...notifications,
    });
    const data = await updateToDo(task);
    if (data.success) {
      Store.addNotification({
        title: "Hurry",
        message: "Task updated succesfully",
        type: "success",
        ...notifications,
      });
    } else {
      Store.addNotification({
        title: "Oh God!",
        message: data.message,
        type: "error",
        ...notifications,
      });
    }
    setisEdit({
      edit: false,
      task: {},
    });
  }
  // setting up functions for deleting a particular task
  async function deleteHandler(id) {
    Store.addNotification({
      title: "In Progress",
      message: "Deleting Data",
      type: "info",
      ...notifications,
    });
    const result = await deleteToDo(id);
    if (result.success) {
      const todo = Todo.filter((data) => {
        return data.id !== id;
      });
      setTodo(todo);
      Store.addNotification({
        title: "Hurry",
        message: "Task deleted succesfully",
        type: "success",
        ...notifications,
      });
    } else {
      Store.addNotification({
        title: "Sorry",
        message: result.message,
        type: "error",
        ...notifications,
      });
    }
  }
  //adding functionalty for adding a new todo task
  async function addData(title) {
    Store.addNotification({
      title: "In Progress",
      message: "Adding Data",
      type: "info",
      ...notifications,
    });
    const data = await addToDo(title, userId);
    if (data.success) {
      Store.addNotification({
        title: "Hurry",
        message: "Task added succesfully",
        type: "success",
        ...notifications,
      });
      
      setTodo([data.data, ...Todo]);
    } else {
      Store.addNotification({
        title: "Sorry",
        message: data.message,
        type: "error",
        ...notifications,
      });
    }
  }

  // useEffect hook for fetching todo list data again and again..
  useEffect(
    () => {
      async function post() {
        Store.addNotification({
          title: "In Progress",
          message: "fetching Data",
          type: "info",
          ...notifications,
        });
        const data = await fetchToDo();
        if (data.success) {
          setisLoading(false);
          setTodo(data.data);
        } else {
          setisLoading(false);
          Store.addNotification({
            title: "Sorry",
            message: data.message,
            type: "error",
            ...notifications,
          });
        }
      }
      post();

      title.current.value = isEdit.edit ? isEdit.task.title : "";
    },
    [notifications],
    [isEdit]
  );


  return (
    <div className="Container">
      <header className="ToDo-header">
        {/* Form for adding and updating to do item in the list. */}
        <div id="Add-ToDo-Conatiner">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addData(title.current.value);
              title.current.value = "";
            }}
          >
            <input
              ref={title}
              type="text"
              placeholder="Add ToDos..."
              name="todo"
              required
            />
            <div>
              {/* checking for editing state or not */}
              {isEdit.edit ? (
                <button
                  type="button"
                  onClick={() => {
                    const task = isEdit.task;
                    task.title = title.current.value;
                    updateHandler(task, false);
                  }}
                >
                  Save
                </button>
              ) : (
                <button type="submit">ADD TASK</button>
              )}
            </div>
          </form>
        </div>
        {/* To do list  */}
        <div id="ToDo-List">
          {isLoading ? (
            <h2>Loading...</h2>
          ) : (
            Todo.length > 0 &&
            Todo.map((item, index) => {
              return (
                <div key={index} className="ToDo-Item">
                  <span>{item.title}</span>
                  <button
                   onClick={() => {
                    updateHandler(item, true);
                  }}
                  >Update</button>
                  <button
                   onClick={() => {
                    deleteHandler(item.id);
                  }}
                  >Delete</button>
                </div>
              );
            })
          )}
        </div>
      </header>
    </div>
  );
}

export default TodoContainer;
