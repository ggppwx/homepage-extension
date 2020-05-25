var intervalHandle;

const headers = {
    'Content-Type': 'application/json',
    "Authorization": "Bearer 543ec6d91418d05024df4b2e96cff29433b81057"
};

const getTasks = async () => {
    const url = "https://cors-anywhere.herokuapp.com/api.todoist.com/rest/v1/tasks?filter=due%20before:Tomorrow"
    const response = await fetch(url, {
        method: 'GET',
        headers: headers
    })
    return response.json();
};

const completeTask = async (taskid) => {    
    const url = `https://cors-anywhere.herokuapp.com/api.todoist.com/rest/v1/tasks/${taskid}/close`;
    let response = await fetch(url, {
        method: 'POST',
        headers: headers
    })
    return response;
};


const getQuote = async () => {
    const url = "https://quotes.rest/qod?language=en"; 
    const headers = {    
        'accept': 'application/json'
    };
    const response = await fetch(url, {
        method: 'GET',
        headers: headers
    })
    return response.json();
};


const setBackground = () => {
    var now = new Date();
    // let random = Math.floor(Math.random()*6) + 1; // 1- 7
    let random = now.getDate() % 7 + 1;
    let file = `url(./images/${random}.jpg)`;
    document.getElementsByClassName("background")[0].style.backgroundImage = file;
};

const checkTime = (time) => {
    if (time < 10) {
        time = "0" + time;
    }
    return time;
};

const setTime = () => {
    var now = new Date();

    var timeText = checkTime(now.getHours()) + ":" + checkTime(now.getMinutes());
    document.getElementById("clock").innerHTML = timeText;
};


const setQuote = () => {
    console.log("get quotes ...");
    getQuote()
    .then(data => {
        console.log(data);
        let quote = data.contents.quotes[0].quote;
        document.getElementById("quote").innerHTML = quote;
    })
    .catch(error => {
        console.log(error);
    });
};

const sortTasksByPriroty = (tasks) => {
    return tasks.sort((a, b) => {
        return  b.priority - a.priority;
    });
}

const setTodo = () => {
    console.log("get tasks ... ");
    getTasks()
    .then(tasks => {        
        // find the max priority 
        sortedTasks = sortTasksByPriroty(tasks);
        console.log(sortedTasks);
        focusTask = sortedTasks.find(x => true);
        if (focusTask) {
            let todo = document.getElementById("todo")
            todo.innerHTML = "<u>" + focusTask.content + "</u>";
            todo.dataset.taskid = focusTask.id;

            let otherTasks = sortedTasks.slice(1, 6);

            let todos = document.getElementById("todos");
            todos.innerHTML = "";
            otherTasks.forEach(task => {
                let listitem = document.createElement('li');
                listitem.innerHTML = task.content;
                todos.appendChild(listitem);
            });
            
            
        }

    })
    .catch(error => console.log(error));
};

const secondsToTimeStr = (seconds) => {
    let date = new Date(0);
    date.setSeconds(seconds); // specify value for SECONDS here
    let timeString = date.toISOString().substr(11, 8);    
    return timeString;
};



const parseTime = (timeStr) => {
    // 3h2m -> 3 hour 2 m  
    // read the numnber, then read the 
    let totalSeconds = 0;
    let matched = timeStr.match(/\d+\s*[a-z]+/g);    
    matched.forEach(item => {
        matchedItem = item.match(/(\d+)\s*([a-z]+)/);
        console.log(matchedItem);
        let num = parseInt(matchedItem[1]);
        let ind = matchedItem[2];
        if (ind == "h") {
            totalSeconds += num * 3600;
        }
        else if (ind == "m") {
            totalSeconds += num * 60
        }
    });
    console.log(totalSeconds);
    return totalSeconds;
    
};

const showTimerView = () => {
    document.getElementById("clock").classList.add("hide");
    document.getElementById("timer").classList.remove("hide");
    document.getElementById("greets").classList.add("invisible");
};

const showClockView = () => {
    document.getElementById("clock").classList.remove("hide");
    document.getElementById("timer").classList.add("hide");
    document.getElementById("greets").classList.remove("invisible");
};




const showNotification = () => {
    chrome.tabs.getCurrent((tab) => {
        chrome.runtime.sendMessage("", {
            type: "notification",
            tabId: tab.id,
            opt: {
                type: "basic",
                title: "Time is up",
                message: "Ah oh, time is up",
                iconUrl: "/notification.jpg"                
            }        
        });
    });
};

const setTimerText = (seconds) => {
    let text =  secondsToTimeStr(seconds);
    document.getElementById("timer").innerHTML = text;
    document.getElementById("title").innerHTML = text;
};

const clearTimerText = () => {
    document.getElementById("title").innerHTML = "Home";
}

const setTimerInput = () => {
    let timerInput = document.getElementById("timerInput");
    timerInput.addEventListener("keyup", (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            console.log(timerInput.value)
            let count = parseTime(timerInput.value);
            
            // show timer 
            showTimerView();

            // clear existing timer
            if (intervalHandle !== null) {
                clearInterval(intervalHandle);
            }

            // clear the text 
            timerInput.value = "";
            // kick the timer          
            
            setTimerText(count);
            intervalHandle = setInterval(() => {
                count --;
                console.log(count);
                
                setTimerText(count);
                
                if (count == 0) {
                    //alert('ah oh');
                    // back to clock 
                    showClockView();

                    clearInterval(intervalHandle);
                    
                    showNotification();

                    clearTimerText();
                }
            }, 1000);

            

        }
    });
};

const setTodoClick = () => {
    let todo = document.getElementById("todo");
    todo.addEventListener("click", (event) => {        
        console.log(todo.dataset);
        completeTask(todo.dataset.taskid).then(data => {
            // refresh
            setTodo();
        });

    });
}

const focusText = () => {
    document.getElementById("timerInput").focus();
};

document.addEventListener("DOMContentLoaded", function() {    
    setBackground();
    setQuote();
    setTodo();
    setTodoClick();
    setTimerInput();
    focusText();


    // display time 
    setTime();
    setInterval(() => {
        // get time from
        setTime();
    }, 10000);

}, false);
