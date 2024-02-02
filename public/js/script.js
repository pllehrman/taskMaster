document.addEventListener("DOMContentLoaded", function() {
    var taskItems = document.querySelectorAll('.task-item');

    taskItems.forEach(function(item) {
        item.addEventListener('click', function() {
            var details = this.querySelector('.task-details');
            details.style.display = details.style.display === 'none' ? 'block' : 'none';
        });
    });
});


function markComplete(taskId) {
    fetch(`/mark-task-complete/${taskId}`, {
        method: 'POST',
        // Additional headers and body as needed
    })
    .then(response => response.json())
    .then(data => {
        console.log('Task marked as complete', data);
        // Optionally, update the UI to reflect the change
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
