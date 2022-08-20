//status is set to false to refer that task is not completed
//favourite is set to false to refer that task is not in user's favourites
const taskObj = [
    {key:"id", value:Date.now()},
    {key:"name", value:null},
    {key:"details", value:null},
    {key:"deadlineDate", value:null},
    {key:"deadlineTime", value:null},
    {key:"status", value:false},
    {key:"favourite", value:false}
];

////////////// index functions //////////////////////////////////
const allTasksSec = document.querySelector("#allTasksSec");
const tasksDiv = document.querySelector("#tasksDiv");

const readFromLocalStorage = (key = "tasks")=>{
    let data;
    try{
        if(key == "taskIndex") return JSON.parse(localStorage.getItem(key));
        data = JSON.parse(localStorage.getItem(key)) || [];
        if(!Array.isArray(data)) throw new Error('invalid data');
    }catch(e){
        console.log(e);
    }
    return data;
}

const writeToLocalStorage = (data,storageKey = "tasks")=>{
    localStorage.setItem(storageKey,JSON.stringify(data));
}

const createElement = (child,parent,classes="",value="",typeInput="")=>{
    const element = document.createElement(child);
    element.classList = classes;
    element.innerHTML = value;
    if(typeInput) element.type = typeInput;
    parent.appendChild(element);
    return element;
}

const showWarningMessage = (task,currentDate)=>{
    const dateArr = task["deadlineDate"].split("-");
    const timeArr = task["deadlineTime"].split(":");

    if (currentDate && currentDate.getFullYear() == Number(dateArr[0])){
        if ((currentDate.getMonth()+1) == Number(dateArr[1])){
            if(currentDate.getDate()+2 > Number(dateArr[2])){     
                return true;
            }else if(currentDate.getDate()+2 == Number(dateArr[2])){
                if(currentDate.getHours() < Number(timeArr[0]) ||
                 (currentDate.getHours() == Number(timeArr[0]) &&
                 currentDate.getMinutes() > Number(timeArr[1]))){
                    return true;
                }
            }
        }
    }
    return false;
}

const showOverDueMessage = (task,currentDate)=>{
    const dateArr = task["deadlineDate"].split("-");
    const timeArr = task["deadlineTime"].split(":");

    if(dateArr.length > 1 && timeArr.length > 1){
        if(currentDate.getFullYear() > Number(dateArr[0])){
            return true;
        }else if(currentDate.getFullYear() == Number(dateArr[0])){
            if(currentDate.getMonth()+1 > Number(dateArr[1])){
                return true;
            }else if(currentDate.getMonth()+1 == Number(dateArr[1])){
                if(currentDate.getDate() > Number(dateArr[2])){
                    return true;
                }else if(currentDate.getDate() == Number(dateArr[2])){
                    if(currentDate.getHours() > Number(timeArr[0])){
                        return true;
                    }else if(currentDate.getHours() == Number(timeArr[0])){
                        if(currentDate.getMinutes() > Number(timeArr[1])){
                            return true;
                        }
                    }
                }
            }
        }
    }
    return false;
}

const unCompleteTheTask = (i,pageTasks,allTasks)=>{
    const taskIndex = allTasks.findIndex((element)=>element.id == pageTasks[i].id);
    allTasks[taskIndex].status = false;
    pageTasks.splice(i,1);
    writeToLocalStorage(allTasks);
    showTasks(pageTasks,allTasks);
}

const completeTheTask = (i,pageTasks,allTasks)=>{
    const taskIndex = allTasks.findIndex((element)=>element.id == pageTasks[i].id);
    allTasks[taskIndex].status = true;
    pageTasks.splice(i,1);
    writeToLocalStorage(allTasks);
    showTasks(pageTasks,allTasks);
}

const deleteTask = (i,pageTasks,allTasks)=>{
    const taskIndex = allTasks.findIndex((element)=>element.id == pageTasks[i].id);
    allTasks.splice(taskIndex,1);
    pageTasks.splice(i,1);
    writeToLocalStorage(allTasks);
    showTasks(pageTasks,allTasks)
}

const unfavouriteTheTask = (i,pageTasks,allTasks)=>{
    const taskIndex = allTasks.findIndex((element)=>element.id == pageTasks[i].id);
    allTasks[taskIndex].favourite = false;
    writeToLocalStorage(allTasks);
    showTasks(pageTasks,allTasks);
}

const favouriteTheTask = (i,pageTasks,allTasks)=>{
    const taskIndex = allTasks.findIndex((element)=>element.id == pageTasks[i].id);
    allTasks[taskIndex].favourite = true;
    writeToLocalStorage(allTasks);
    showTasks(pageTasks,allTasks);
}

const viewTaskDetails = (i,pageTasks,allTasks)=>{
    const taskIndex = allTasks.findIndex((element)=>element.id == pageTasks[i].id);
    writeToLocalStorage(taskIndex,"taskIndex");
    window.location.href = "taskDetails.html";
}

const drawSingleTask = (task,i,pageTasks,allTasks,currentDate = "")=>{

    const div1 = createElement("div",tasksDiv,"card w-25 mt-5 ms-2");
    const h5 = createElement("h5",div1,"card-header d-flex justify-content-between");
    const h5Div1 = createElement("div",h5,"",task["name"]);
    const h5Div2 = createElement("div",h5,"form-check");
    const label = createElement("label",h5Div2,"fs-6","Complete");
    const star = createElement("i",h5Div2,"ms-1 fa-solid fa-star showPointer");
    if(task.favourite) star.classList.add("yellowStar");
    const inputCheck = createElement("input",h5Div2,"form-check-input showPointer","","checkbox");
    if(task.status) inputCheck.checked = true;
    const div2 = createElement("div",div1,"card-body text-center");
    
    if(showOverDueMessage(task,currentDate)){
        if(!task.status){
            createElement("p",div2,"","OverDue!!!")
        }
    }else{
        if(showWarningMessage(task,currentDate)){
            const warningP = createElement("p",div2,"","Less than 2 Days left!!!")
        }
    }

    if(task["deadlineDate"] && task["deadlineTime"]){
        const p = createElement("p",div2,"card-text","Deadline: "+task["deadlineDate"]+" "+task["deadlineTime"]);
    }else{
        const p = createElement("p",div2,"card-text","No Deadline");
    }
    const btnViewDetails = createElement("button",div2,"btn btn-primary me-3","View Details");
    const btnDelete = createElement("button",div2,"btn btn-primary","Delete");
    inputCheck.addEventListener("click",()=>{
        if(task.status) unCompleteTheTask(i,pageTasks,allTasks);
        else completeTheTask(i,pageTasks,allTasks);
    });
    btnDelete.addEventListener("click",()=>deleteTask(i,pageTasks,allTasks));
    star.addEventListener("click",()=>{
        if(task.favourite) unfavouriteTheTask(i,pageTasks,allTasks);
        else favouriteTheTask(i,pageTasks,allTasks);
    });
    btnViewDetails.addEventListener("click",()=>viewTaskDetails(i,pageTasks,allTasks));
}

const drawTasks = (pageTasks,allTasks,currentDate = "")=>{
    pageTasks.forEach((task,i)=>{
        drawSingleTask(task,i,pageTasks,allTasks,currentDate);
    });
}

const showTasks = (pageTasks,allTasks)=>{
    const currentDate = new Date();
    const noTasksDiv = document.querySelector("#noTasksDiv");

    if(pageTasks.length <= 0) {
        noTasksDiv.classList.replace("hide","show");
        tasksDiv.classList.replace("show","hide");
    }else{
        tasksDiv.innerHTML="";
        noTasksDiv.classList.replace("show","hide");
        tasksDiv.classList.replace("hide","show");
        drawTasks(pageTasks,allTasks,currentDate);
    }
}

if(allTasksSec){
    const allTasks = readFromLocalStorage();
    const allTasksCopy = readFromLocalStorage();
    showTasks(allTasksCopy,allTasks);
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

const addTaskFun = (allTasks)=>{
    const data = {};

    taskObj.forEach((head)=>{
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

///////////////// CompletedTasks Functions ////////////////////////////////
const completedTasksSec = document.querySelector("#completedTasksSec");

if(completedTasksSec){
    const allTasks = readFromLocalStorage();
    const completedTasks = allTasks.filter((task)=>task.status == true);
    showTasks(completedTasks,allTasks);
}

/////////////// notCompletedTasks Functions ///////////////////////////
const notCompletedTasksSec = document.querySelector("#notCompletedTasksSec");

if(notCompletedTasksSec){
    const allTasks = readFromLocalStorage();
    const completedTasks = allTasks.filter((task)=>task.status == false);
    showTasks(completedTasks,allTasks);
}
///////////////// favouriteTasks Functions //////////////////////////////
const favouriteTasksSec = document.querySelector("#favouriteTasksSec");

if(favouriteTasksSec){
    const allTasks = readFromLocalStorage();
    const favouriteTasks = allTasks.filter((task)=>task.favourite == true);
    showTasks(favouriteTasks,allTasks);
}

///////////////// task Details Functions ///////////////////////////////
const viewTaskDiv = document.querySelector("#viewTaskDiv");
const viewEditForm = document.querySelector("#viewEditForm");

const editTask = (taskIndex,allTasks)=>{
    taskObj.forEach((head)=>{
        if(head.value === null)  allTasks[taskIndex][head.key] = viewEditForm.elements[head.key].value;
    });

    writeToLocalStorage(allTasks);
    const alertDiv = createElement("div",viewEditForm,"alert alert-success mt-3","Changes are Saved Successfully");
    setTimeout(()=>alertDiv.remove(),2500);
    
}

const validateEditInputs = (e,taskIndex,allTasks)=>{
    e.preventDefault();

    if(viewEditForm.elements["name"].value==""){
        const alertDiv = createElement("div",viewEditForm,"alert alert-danger mt-3","You Should Enter Task Name");
        setTimeout(()=>alertDiv.remove(),2000);
    }
    else { editTask(taskIndex,allTasks); }
}

if(viewTaskDiv){
    const allTasks = readFromLocalStorage();
    const taskIndex = readFromLocalStorage("taskIndex");
    taskObj.forEach((head)=>{
        if(head.value === null) viewEditForm.elements[head.key].value = allTasks[taskIndex][head.key];
    });
    viewEditForm.addEventListener("submit",(e)=>validateEditInputs(e,taskIndex,allTasks));
}