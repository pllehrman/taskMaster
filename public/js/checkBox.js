function markComplete(taskId) {

    const postUrl = `/tasks/mark/${taskId}`;
    console.log(postUrl);
    fetch(postUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Additional headers here, e.g., for CSRF or authentication
        },
        body: JSON.stringify({
            completed: true // Assuming your server expects a payload. Adjust according to your server's requirements.
        })
    })
    .then(response => response.json()) // Parse the JSON response
    .then(data => { console.log(data.message); // Log the success message
    })
    .catch(error => {
        console.error('Error:', error);
    });
};

function takeResponsibility(taskId) {

    const postUrl = `/tasks/responsibility/${taskId}`;
    console.log(postUrl);
    fetch(postUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Additional headers here, e.g., for CSRF or authentication
        },
        body: JSON.stringify({
            completed: true // Assuming your server expects a payload. Adjust according to your server's requirements.
        })
    })
    .then(response => response.json()) // Parse the JSON response
    .then(data => { console.log(data.message); // Log the success message
    })
    .catch(error => {
        console.error('Error:', error);
    });
};

function markIncomplete(taskId) {

    const postUrl = `/tasks/incomplete/${taskId}`;
    console.log(postUrl);
    fetch(postUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Additional headers here, e.g., for CSRF or authentication
        },
        body: JSON.stringify({
            completed: true // Assuming your server expects a payload. Adjust according to your server's requirements.
        })
    })
    .then(response => response.json()) // Parse the JSON response
    .then(data => { console.log(data.message); // Log the success message
    })
    .catch(error => {
        console.error('Error:', error);
    });
};

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('refreshTasks').addEventListener('click', function() {
        window.location.reload(); // This reloads the current page
    });
});


