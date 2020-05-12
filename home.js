const headers = {
    'Content-Type': 'application/json',
    "Authorization": "Bearer 543ec6d91418d05024df4b2e96cff29433b81057"
} 

const getTasks = async () => {
    const url = "https://api.todoist.com/rest/v1/tasks?filter=today"
    const response = await fetch(url, {
        method: 'GET',
        headers: headers
    })
    return response.json();
}

// 