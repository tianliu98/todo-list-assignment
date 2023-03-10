const myFetch = (url, options = {}) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                const response = JSON.parse(xhr.responseText);
                resolve(response);
                } else {
                reject(new Error(`myFetch failed with status ${xhr.status}`));
                }
            }
        };
        xhr.open(options.method || "GET", url);
        if (options.headers) {
            Object.keys(options.headers).forEach(key => {
                xhr.setRequestHeader(key, options.headers[key]);
            });
        }
        xhr.send(options.body ? JSON.stringify(options.body) : undefined);
    });
};
  
const APIs = (() => {   
    const URL = "http://localhost:3000/todos";

    const addTodo = (newTodo) => {
        // post
        return myFetch(URL, {
            method: "POST",
            body: newTodo,
            headers: { "Content-Type": "application/json" },
        });
    };

    const removeTodo = (id) => {
            return myFetch(URL + `/${id}`, {
            method: "DELETE",
        });
    };

    const getTodos = () => {
        return myFetch(URL);
    };

    const getTodoById = (id) => {
        return myFetch(`http://localhost:3000/todos/${id}`);
    };

    const editTodo = (id, updatedTodo) => {
        return myFetch(URL + `/${id}`, {
            method: "PUT",
            body: updatedTodo,
            headers: { "Content-type": "application/json" },
        });
    };

    return {
        addTodo,
        removeTodo,
        getTodos,
        getTodoById,
        editTodo,
    };
})();

const Model = (() => {
    //todolist
    class State {
        #todos; //[{id: ,title: },{}]
        #onChange;
        constructor() {
            this.#todos = [];
        }

        get todos() {
            return this.#todos;
        }

        set todos(newTodo) {
            console.log("setter");
            this.#todos = newTodo;
            this.#onChange?.();
        }

        subscribe(callback) {
            this.#onChange = callback;
        }
    }
    let { getTodos, getTodoById, removeTodo, addTodo, editTodo } = APIs;

    return {
        State,
        getTodos,
        getTodoById,
        removeTodo,
        addTodo,
        editTodo,
    };
})();

const View = (() => {
    const formEl = document.querySelector(".form");
    const todoListEl = document.querySelector(".todo-list");
    const doneListEl = document.querySelector(".done-list");
    const listEl = document.querySelector(".lists-container");
    const updateTodoList = (todos) => {
        let todo_template = "";
        let done_template = "";
        todos.forEach((todo) => {
            const isChecked = todo.done ? 'checked' : ''
            if (todo.done) {
                const doneTemplate = `  <li>
                                        <button class="move-left" id = "${todo.id}">
                                            <svg class="svg-left" focusable="false" aria-hidden="true" viewBox="0 0 24 24" aria-label="fontSize small">
                                                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
                                            </svg>
                                        </button>
                                        <span>${todo.title}</span>
                                        <button class="btn--edit" id="${todo.id}">
                                            <svg class="svg--edit" focusable="false" aria-hidden="true" viewBox="0 0 24 24"  aria-label="fontSize small">
                                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
                                            </svg>
                                        </button>

                                        <button class="btn--delete" id="${todo.id}">
                                            <svg class="svg--delete" focusable="false" aria-hidden="true" viewBox="0 0 24 24" aria-label="fontSize small">
                                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
                                            </svg>
                                        </button>
                                    </li>`;

                done_template += doneTemplate;
            } else {
                const todoTemplate = `  <li>
                                        <span>${todo.title}</span>
                                        <button class="btn--edit" id="${todo.id}">
                                        <div class = "svg--edit">
                                        <svg class="svg--edit" focusable="false" aria-hidden="true" viewBox="0 0 24 24"  aria-label="fontSize small">
                                            <path class="svg--delete" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
                                        </svg>
                                        </div>
                                        
                                        </button>
                                        
                                        <button class="btn--delete" id="${todo.id}">
                                            <svg class="svg--delete" focusable="false" aria-hidden="true" viewBox="0 0 24 24" aria-label="fontSize small">
                                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
                                            </svg>
                                        </button>

                                        <button class="move-right" id = "${todo.id}">
                                            <svg class="svg-right" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="ArrowForwardIcon" aria-label="fontSize small">
                                                <path d="m12 4-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path>
                                            </svg>
                                        </button>
                                    </li>`;

                todo_template += todoTemplate;
            }   
        });

        
        if(todos.length === 0){
            template = "no task to display"
        }
        todoListEl.innerHTML = todo_template;
        doneListEl.innerHTML = done_template;
    };

    const editBtn = document.querySelector(".btn--edit");
    const delBtn = document.querySelector(".btn--delete");

    return {
        formEl,
        todoListEl,
        doneListEl,
        listEl,
        editBtn,
        delBtn,
        updateTodoList,
    };
})();

const ViewModel = ((View, Model) => {
    console.log("model", Model);
    const state = new Model.State();

    const getTodos = () => {
        Model.getTodos().then((res) => {
            res.reverse();
            state.todos = res;
        });
    };

    const addTodo = () => {
        View.formEl.addEventListener("submit", (event) => {
            event.preventDefault();
            
            const title = event.target[0].value;
            if(title.trim() === "") {
                alert("please input title!");
                return;
            }
            console.log("title", title);
            const newTodo = { title, "done": false };
            Model.addTodo(newTodo)
                .then((res) => {
                    state.todos = [res, ...state.todos];
                    event.target[0].value = ""
                })
                .catch((err) => {
                    alert(`add new task failed: ${err}`);
                });
        });
    };

    const editTodo = () => {
        View.listEl.addEventListener("click",  (event) => {
            const id = event.target.id;
            let cur_item =  Model.getTodoById(id);

            console.log(event.target);
    
            if (event.target.className === 'btn--edit') {
                
                const cur_item = state.todos.find((todo) => todo.id === +id);

                const inputEl = document.createElement("input");
                inputEl.type = "text";
                inputEl.value = cur_item.title;
                inputEl.className = "update-input";

                const titleEl = event.target.previousElementSibling;

                titleEl.parentNode.insertBefore(inputEl, titleEl);
                titleEl.remove();
     
                inputEl.focus();
                inputEl.addEventListener("keyup", (event) => {
                    if (event.key === "Enter") {
                        const title = event.target.value.trim();
                        if (title !== "") {
                            
                            const updatedTodo = { title, done: cur_item.done };
                            
                            Model.editTodo(id, updatedTodo)
                                .then((res) => {
                                    const index = state.todos.findIndex(
                                        (todo) => todo.id === +id
                                    );
                                    if (index !== -1) {
                                        state.todos[index] = res;
                                    }
                                    
                                    const newTitleEl = document.createElement("span");
                                    newTitleEl.innerText = res.title;
                                    inputEl.parentNode.insertBefore(
                                        newTitleEl,
                                        inputEl
                                    );
                                    inputEl.remove();
                                })
                                .catch((err) => {
                                    alert(`update todo failed: ${err}`);
                                });
                        } else {
                            alert("please input title!");
                        }
                    } else if (event.key === "Escape") {
                        
                        const newTitleEl = document.createElement("span");
                        newTitleEl.innerText = cur_item.title;
                        inputEl.parentNode.insertBefore(newTitleEl, inputEl);
                        inputEl.remove();
                    }
                });
            } 
            else if (event.target.className === "btn--delete"){
                Model.removeTodo(id).then(res=>{
                    state.todos = state.todos.filter(todo=> +todo.id !== +id)
                }).catch(err=>alert(`delete todo failed: ${err}`))
            } 
            else if (event.target.className === "move-right"){
                const cur_item = state.todos.find(todo => todo.id === +id);
                const updatedTodo = { ...cur_item, done: true };
                console.log(cur_item);
                Model.editTodo(id, updatedTodo)
                    .then(res => {
                        const index = state.todos.findIndex(todo => todo.id === +id);
                        if (index !== -1) {
                            state.todos[index] = res;
                        }
                    })
                    .catch(err => {
                        alert(`update todo failed: ${err}`);
                    });
            } else if (event.target.className === "move-left"){
                const cur_item = state.todos.find(todo => todo.id === +id);
                const updatedTodo = { ...cur_item, done: false };
                console.log(cur_item);
                Model.editTodo(id, updatedTodo)
                    .then(res => {
                        const index = state.todos.findIndex(todo => todo.id === +id);
                        if (index !== -1) {
                            state.todos[index] = res;
                        }
                    })
                    .catch(err => {
                        alert(`update todo failed: ${err}`);
                    });
            }

        })

    };

    const bootstrap = () => {
        addTodo();
        getTodos();
        editTodo();
        state.subscribe(() => {
            View.updateTodoList(state.todos);
        });
    };

    return {
        bootstrap,
    };
})(View, Model);

ViewModel.bootstrap();
