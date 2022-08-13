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
        if(!Array.isArray(data)) throw new Error('invalid data');
    }catch(e){
        console.log(e);
    }
    return data;
}

const writeToLocalStorage = (data,storageKey = "tasks")=>{
    localStorage.setItem(storageKey,JSON.stringify(data));
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

const createElement = (child,parent,classes="",value="")=>{
    const element = document.createElement(child);
    element.classList = classes;
    element.innerHTML = value;
    parent.appendChild(element);
    return element;
}

const addTaskFun = (allTasks)=>{
    const data = {};

    task.forEach((head)=>{
        if(head.value === null) data[head.key] = addTaskForm.elements[head.key].value;
        else data[head.key] = head.value;
    });

    allTasks.push(data);
    writeToLocalStorage(allTasks);
    window.location.href="index.html";
}

const validateInputs = (e,allTasks)=>{
    e.preventDefault();

    if(addTaskForm.elements["name"].value==""){
        const alertDiv = createElement("div",addTaskForm,"alert alert-danger mt-3","You Should Enter Task Name");
        setTimeout(()=>alertDiv.remove(),2000);
    }
    else { addTaskFun(allTasks); }
}

if(addTaskForm){
    const allTasks = readFromLocalStorage();
    addTaskBtn.addEventListener("click", openCloseAddTaskForm);
    closeBtn.addEventListener("click",openCloseAddTaskForm);
    addTaskForm.addEventListener("submit", (e)=>validateInputs(e,allTasks));
}

//////////////////////////////////////////////////////////////////