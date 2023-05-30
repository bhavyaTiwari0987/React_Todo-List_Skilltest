const url = "https://jsonplaceholder.typicode.com/posts";

// For fetching the todos.
export const fetchToDo = async () => {
  let data = [];
  try {
    const response = await fetch(url + "?userId=1");
    data = await response.json();
    return {
      data,
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

// For Adding Todos
export const addToDo = async (title , userId) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        title,
        userId,
        completed: false,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

// For deleting todo.
export const deleteToDo = async (id) => {
  try {
    await fetch(`${url}/${id}`, {
        method: 'DELETE',
      });
      return{
        success: true,
      }
  } catch (err) {
    return {
        success: false,
        message: err.message,
      };

  }
};

// for updating todo.
export const updateToDo = async (task) => {
  try {
    const response = await fetch(`${url}/${task.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: 'foo',
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      const data = response.json();
      return {
        data,
        success: true,
      }
  } catch (err) {
    return {
        success: false,
        message: err.message,
      };
  }
};
