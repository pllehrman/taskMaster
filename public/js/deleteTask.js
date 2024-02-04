// Ensure this is outside the 'forEach' loop to avoid attaching multiple listeners
document.getElementById('deleteTaskButton').addEventListener('click', function() {
    const taskId = this.getAttribute('data-task-id');
    fetch(`/tasks/delete/${taskId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete task');
        }
        return response.json();
    })
    .then(data => {
        window.location.reload(); // Refresh the page or update the DOM as needed
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message);
    });
});
