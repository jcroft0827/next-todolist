import axios from "axios";
import { useEffect, useState } from "react"
import Spinner from "./Spinner";
import { getFormattedDate } from "@/libs/dateFormatter";

export default function TaskList({
    _id,
    task: existingTask,
    date: existingDate,
    details: existingDetails,
}) {

    const todayDate = getFormattedDate();
    let dateHolder = todayDate;

    // Use States
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState(existingTask || '');
    const [date, setDate] = useState(existingDate || '');
    const [details, setDetails] = useState(existingDetails || '');
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editedTask, setEditedTask] = useState({});
    const [inputFocus, setInputFocus] = useState([]);
    const [filterOption, setFilterOption] = useState(todayDate);




    // Use Effect
    // Grab the tasks from the database to fill 'tasks' array state
    useEffect(() => {
        setLoading(true);
        axios.get('/api/todolist').then((response) => {
            setTasks(response.data);
        });
        resetStates();
        setLoading(false);
    }, []);



    // Functions//

    // Remove Task
    async function removeTask(task) {
        await axios.delete('/api/todolist?id=' + task);
        refreshTaskList();
    };

    // Reset States
    function resetStates() {
        setTask('');
        setDate('');
        setDetails('');
        setLoading(false);
        setEditing(false);
        setEditedTask({});
        setInputFocus([]);
        setFilterOption(todayDate);
    }

    // Add Task
    async function addTask(ev) {
        ev.preventDefault();
        const data = { task, date, details };

        if (editing) {
            // Update
            data._id = editedTask._id;
            await axios.put('/api/todolist', data);
        } else {
            // Create
            await axios.post('/api/todolist', data);
        }

        // clear tasks
        resetStates();

        // refresh page
        refreshTaskList();
    };

    // Refresh Task List
    async function refreshTaskList() {
        await axios.get('/api/todolist').then((response) => {
            setTasks(response.data);
        });
    }

    // Switch To Edit Screen
    function editTask(task) {
        setInputFocus([]);
        setInputFocus(['taskName', 'details']);
        setTask(task.task);
        setDetails(task.details);
        setEditing(true);
        setEditedTask(task);



        // Check if date is empty
        if (task.date === undefined || task.date === null) {
            setDate('');
        } else {
            const taskDate = task.date.slice(0, 10);
            setDate(taskDate);
        }

        // Check if details is empty
        // We aren't checking for Task Name here because Task Names are required //
        if (task.details === undefined || task.details === null || task.details === '') {
            setDetails('');
        }

    }

    // Focus Status
    function focusStatus(input) {

        // Get the input element by its ID
        let inputField = document.getElementById(input);

        // Get the value of the input field
        let value = inputField.value;

        if (value !== '') {
            setInputFocus([...inputFocus, input]);
            console.log(value);
        } else if (value === '' && inputFocus.includes(input)) {
            let arr = inputFocus;
            arr = arr.filter(e => e !== input);
            setInputFocus([arr]);
        }
    }

    // Format Date
    function formatDate(date) {

        if (date !== null && date !== undefined) {
            let newDate = date;
            let year = newDate.slice(0, 4);
            let month = newDate.slice(5, 7);
            let day = newDate.slice(8, 10);
            let taskDate = `${month}/${day}/${year}`
            dateHolder = taskDate;
            return dateHolder;
        }
        dateHolder = todayDate;
    }

    // End Functions //




    return (

        <div>
            {loading && (
                <div className="h-24 p-1 flex items-center">
                    <Spinner />
                </div>
            )}

            {/* Filter Text & Filter Options */}
            <div
                className="w-1/2 mx-auto mb-5 flex justify-between"
            >

                <div>
                    {/* Filter Text */}
                    <p className="text-sm text-red-600 mb-2">
                        Showing Tasks For {filterOption}
                    </p>

                    {/* Filter All Tasks */}
                    <button
                        onClick={() => setFilterOption('All')}
                        className="border px-4 rounded-md shadow-md hover:shadow-inner"
                    >
                        All Tasks
                    </button>
                </div>

                {/* Filter Options */}
                <div
                    className="flex flex-col"
                >
                    <label className="text-sm">
                        Filter by date
                    </label>
                    <input
                        type="date"
                        value={filterOption}
                        className="border rounded-md px-2"
                        onChange={(ev) => {
                            formatDate(ev.target.value);
                            setFilterOption(dateHolder);
                        }}
                    />
                </div>

            </div>


            {/* Table */}
            <div className={(loading ? 'hidden' : 'block') + ' mb-10 rounded-md'}>
                <table className={(tasks.length > 0 ? 'block' : 'hidden')}>
                    <thead></thead>
                    <tbody>
                        {tasks.length > 0 &&
                            tasks.map((task) => {
                                formatDate(task.date); // This will format the date using the format Date function, which will return dateHolder

                                if (dateHolder === filterOption) {
                                    return (
                                        <tr
                                            key={task._id}
                                        >
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    id="task"
                                                    name="task"
                                                    className="mr-2"
                                                    value={task._id}
                                                    onChange={() => removeTask(task._id)}
                                                />
                                                <label
                                                    onClick={() => editTask(task)}
                                                    className={editedTask._id === task._id ? 'text-red-600' : 'text-black'}
                                                >
                                                    {task.task}
                                                </label>
                                            </td>
                                        </tr>

                                    )
                                } else if (filterOption === 'All') {
                                    return (
                                        <tr key={task._id}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    id="task"
                                                    name="task"
                                                    className="mr-2"
                                                    value={task._id}
                                                    onChange={() => removeTask(task._id)}
                                                />
                                                <label
                                                    onClick={() => editTask(task)}
                                                    className={editedTask._id === task._id ? 'text-red-600' : 'text-black'}
                                                >
                                                    {task.task}
                                                </label>
                                            </td>
                                        </tr>
                                    )
                                }
                            })}
                    </tbody>
                </table>
            </div>

            {/* Box used to add tasks */}
            <form className='basic' name='Form' onSubmit={addTask}>

                {/* Enter Task Box & Add Task Button */}
                <div
                    className="justify-between mb-5 items-center"
                >

                    {/* Enter Task Box */}
                    <div className="flex flex-col">

                        <label
                            className={inputFocus.includes('taskName') ? 'flex' : 'hidden'}
                        >
                            Task Name
                        </label>

                        <input
                            type="text"
                            value={task}
                            onChange={(ev) => setTask(ev.target.value)}
                            placeholder={inputFocus.includes("taskName") ? '' : 'Task Name'}
                            className="w-full p-1 border rounded-md"
                            id="taskName"
                            onFocusCapture={() => setInputFocus([...inputFocus, 'taskName'])}
                            onBlur={() => { focusStatus('taskName') }}
                        />
                    </div>

                    {/* Add Task Button */}
                    <button
                        className={(editing ? "hidden" : "flex") + " border w-8 h-8 items-center justify-center rounded-lg shadow-md hover:shadow-inner"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>

                </div>

                {/* Date of Task & Details */}
                <div className="items-center justify-center">

                    {/* Date of Task */}
                    <div className="flex flex-col">
                        <label>Date of task</label>
                        <input
                            type="date"
                            value={date}
                            className="border rounded-md px-2"
                            onChange={(ev) => setDate(ev.target.value)}
                        />
                    </div>

                    {/* Details */}
                    <div
                        name="details_container"
                        className="flex flex-col gap-1"
                    >
                        <label
                            className={inputFocus.includes('details') ? 'flex' : 'hidden'}
                        >
                            Details
                        </label>
                        <textarea
                            rows={4}
                            cols={50}
                            placeholder={inputFocus.includes("details") ? '' : 'Details'}
                            value={details}
                            name="details_input"
                            id="details"
                            onFocusCapture={() => setInputFocus([...inputFocus, 'details'])}
                            onBlur={() => { focusStatus('details') }}
                            className="w-full pl-2 pt-2"
                            onChange={(ev) => setDetails(ev.target.value)}
                        ></textarea>
                    </div>

                </div>

                {/* Edit & Cancel Buttons */}
                {editing && (
                    <div className="justify-end items-center gap-5 mt-5">
                        <div className="text-sm font-semibold flex gap-1 items-center">
                            <p>Added On:</p>
                            <input
                                type="date"
                                disabled={true}
                                value={editedTask.createdAt.slice(0, 10)}
                            />
                        </div>

                        <div>
                            <button
                                className="btn btn-primary"
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => resetStates()}
                            >
                                Cancel
                            </button>
                        </div>

                    </div>
                )}


            </form>

            {/* Editing Components */}
        </div>
    )
}
