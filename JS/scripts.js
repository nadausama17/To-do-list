//status is set to false to refer that task is not completed
//favourite is set to false to refer that task is not in user's favourites
const task = [
    {key:"id", value:Date.now()},
    {key:"name", value:null},
    {key:"details", value:null},
    {key:"deadline", value:null},
    {key:"status", value:false},
    {key:"favourite", value:false}
];

////////////// index functions //////////////////////////////////
const notCompletedTasksSec = document.querySelector("#notCompletedTasksSec");

const readFromLocalStorage = ()=>{
    let data;
    try{
        data = JSON.parse(localStorage.getItem("tasks")) || [];
    }catch(e){
        console.log(e);
    }
    return data;
}

const showTasks = (tasks)=>{
    const noTasksDiv = document.querySelector("#noTasksDiv");
    const tasksDiv = document.querySelector("#tasksDiv");

    if(tasks.length <= 0) {
        noTasksDiv.classList.replace("hide","show");
        tasksDiv.classList.replace("show","hide");
    }else{
        tasksDiv.innerHTML="";
        noTasksDiv.classList.replace("show","hide");
        tasksDiv.classList.replace("hide","show");
    }
}

if(notCompletedTasksSec){
    const notCompletedTasks=readFromLocalStorage().filter((task)=>{
        return task.status == false ;
    });
    showTasks(notCompletedTasks);
}

//add task functions
const addTaskBtn = document.querySelector("#addTaskBtn");
const addTaskForm = document.querySelector("#addTaskForm");
const addTaskDiv = document.querySelector("#addTaskDiv");
const closeBtn = document.querySelector("#closeBtn");

const openCloseAddTaskForm = (e=false)=> {
    if(e) e.preventDefault();
    addTaskDiv.classList.toggle("d-none");
}

if(addTaskForm){
    addTaskBtn.addEventListener("click", openCloseAddTaskForm);
    closeBtn.addEventListener("click",openCloseAddTaskForm);
}

//////////////////////////////////////////////////////////////////