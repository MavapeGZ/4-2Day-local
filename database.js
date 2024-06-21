document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');

    // Función para obtener tareas desde localStorage
    const getTasks = () => {
        let tasksString = localStorage.getItem('tasks');
        let tasks = tasksString ? JSON.parse(tasksString) : [];
        return tasks;
    };

    // Función para guardar tareas en localStorage
    const saveTasks = (tasks) => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Función para añadir una tarea
    const addTask = async (task) => {
        let tasks = getTasks();
        tasks.push(task);
        saveTasks(tasks);
        return { success: true, message: 'Task added successfully' };
    };

    // Función para eliminar una tarea
    const deleteTask = async (taskId) => {
        let tasks = getTasks().filter(task => task._id !== taskId);
        saveTasks(tasks);
    };

    const updateTable = () => {
        const tasks = getTasks();

        taskList.innerHTML = '';

        const currentDate = new Date().toISOString().split('T')[0];

        tasks.forEach(task => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="name">${task.name}</td>
                <td><img src="./images/${task.type}.png" alt="${task.type}"></td>
                <td>${task.date}</td>
                <td class="description">${task.description}</td>
                <td><img src="./images/delete.png" alt="delete" class="delete-icon" data-id="${task._id}"></td>
            `;

            if (task.date < currentDate) {
                row.classList.add('past-due');
            }

            taskList.appendChild(row);
        });

        // Event listeners para los iconos de eliminar
        document.querySelectorAll('.delete-icon').forEach(icon => {
            icon.addEventListener('click', async (event) => {
                const taskId = event.target.getAttribute('data-id');
                await deleteTask(taskId);
                updateTable();
            });
        });
    };

    taskForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        let name = document.getElementById("name").value;
        let type = document.querySelector('input[name="type"]:checked');
        let date = document.getElementById("date").value;
        let description = document.getElementById("description").value;

        document.getElementById("error-name").style.display = 'none';
        document.getElementById("error-type").style.display = 'none';
        document.getElementById("error-date").style.display = 'none';
        document.getElementById("error-description").style.display = 'none';

        let hasError = false;

        if (name === '') {
            document.getElementById("error-name").innerText = "Please, complete the 'name' field";
            document.getElementById("error-name").style.display = 'block';
            hasError = true;
        }
        if (!type) {
            document.getElementById("error-type").innerText = "Please, complete the 'type' field";
            document.getElementById("error-type").style.display = 'block';
            hasError = true;
        }
        if (date === '') {
            document.getElementById("error-date").innerText = "Please, complete the 'date' field";
            document.getElementById("error-date").style.display = 'block';
            hasError = true;
        }
        if (description === '') {
            document.getElementById("error-description").innerText = "Please, complete the 'description' field";
            document.getElementById("error-description").style.display = 'block';
            hasError = true;
        }

        if (hasError) {
            return false;
        }

        let task = {
            name: name,
            type: type.value,
            date: date,
            description: description,
            _id: Date.now().toString() // Generamos un ID único para la tarea
        };

        const result = await addTask(task);
        
        if (result.success) {
            console.log(result.message);
            updateTable();
            taskForm.reset();
        } else {
            console.error(result.message);
        }
    });

    // Llamamos a updateTable inicialmente para cargar las tareas existentes
    updateTable();
});