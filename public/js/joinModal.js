document.getElementById('joinButton').onclick = function() {
    document.getElementById('joinModal').style.display = 'block';
}

document.getElementsByClassName('close')[0].onclick = function() {
    document.getElementById('joinModal').style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == document.getElementById('joinModal')) {
        document.getElementById('joinModal').style.display = 'none';
    }
}

document.getElementById('confirmJoin').onclick = function() {
    const orgId = document.getElementById('joinButton').getAttribute('data-org-id');
    fetch(`/organizations/join/${orgId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Additional headers as needed
        },
        credentials: 'same-origin' // Include cookies
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Redirect to the specified URL
            window.location.href = data.redirectTo;
            // Understanding that the actual flash message will be shown in the server-rendered page after this redirect
        } else {
            console.error(data.message);
            // Handle error without redirecting, possibly showing an error message client-side
        }
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
};
