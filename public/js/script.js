document.addEventListener("DOMContentLoaded", function() {
    var expandDetails = document.querySelectorAll('.expand-details');

    expandDetails.forEach(function(indicator) {
        indicator.addEventListener('click', function(event) {
            // Prevent event from bubbling up to avoid triggering any parent click handlers
            event.stopPropagation();

            // Find the closest parent .task-item of the clicked .expand-details span
            var taskItem = this.closest('.task-item');

            // Within the found .task-item, find the .task-details div to toggle
            var details = taskItem.querySelector('.task-details');

            // Toggle the display of the .task-details div
            details.style.display = details.style.display === 'none' ? 'block' : 'none';
        });
    });
});
// Toggle visibility class for the .task-details div
details.classList.toggle('task-details-visible');


