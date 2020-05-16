const getTasks = async () => {
    const headers = {
        'Content-Type': 'application/json',
        "Authorization": "Bearer 543ec6d91418d05024df4b2e96cff29433b81057"
    };
    const url = "https://api.todoist.com/rest/v1/tasks?filter=due%20before:Tomorrow"
    const response = await fetch(url, {
        method: 'GET',
        headers: headers
    })
    return response.json();
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
    let random = Math.floor(Math.random()*6) + 1; // 1- 7
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
    getTasks()
    .then(tasks => {        
        // find the max priority 
        sortedTasks = sortTasksByPriroty(tasks);
        console.log(sortedTasks);
        focusTask = sortedTasks.find(x => true);
        if (focusTask) {
            document.getElementById("todo").innerHTML = focusTask.content;
        }

    })
    .catch(error => console.log(error));
};

const setTimerInput = () => {
    let timerInput = document.getElementById("timerInput");
    timerInput.addEventListener("keyup", (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            console.log(timerInput.value)
            
            // show timer 
            
            // kick the timer 


            let count = 10;
            var handle = setInterval(() => {
                count --;
                console.log(count);
                if (count == 0) {
                    alert('ah oh');
                    clearInterval(handle);
                }
            }, 1000);

            

        }
    });
};


document.addEventListener("DOMContentLoaded", function() {    
    setBackground();
    setQuote();
    setTodo();
    setTimerInput();


    // display time 
    setTime();
    setInterval(() => {
        // get time from
        setTime();
    }, 10000);

}, false);
