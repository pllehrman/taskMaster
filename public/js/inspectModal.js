document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('inspectModal');
    const closeBtn = modal.querySelector('.close');

    // Close modal when the close button is clicked
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close modal when clicking anywhere outside of the modal content
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    // Existing logic for handling inspect buttons
    document.querySelectorAll('.inspect-button').forEach(button => {
        button.addEventListener('click', function() {
            const taskId = this.getAttribute('data-task-id');
            const description = this.getAttribute('data-task-description');
            const isAssigner = this.getAttribute('data-is-assigner') === 'true';
            const modalContent = modal.querySelector('.modal-content');
            const buttonWrapper = document.getElementById('deleteTaskButton').parentNode;
    
            // Correctly clear previous dynamic content, leaving static elements like close button and delete button intact
            const dynamicElements = modalContent.querySelectorAll('p, .description-label');
            dynamicElements.forEach(elem => elem.remove());
    
            // Create and append the description label
            const descriptionLabel = document.createElement("h3");
            descriptionLabel.textContent = "Description:";
            descriptionLabel.classList.add("description-label"); // For optional styling
    
            // Create and append the actual description
            const descriptionElement = document.createElement("p");
            descriptionElement.textContent = description;

            modalContent.insertBefore(descriptionLabel, buttonWrapper);
            modalContent.insertBefore(descriptionElement, buttonWrapper);
    
            // Optionally show a delete button for assigners
            const deleteTaskButton = document.getElementById('deleteTaskButton');
            deleteTaskButton.setAttribute('data-task-id', taskId);
            deleteTaskButton.style.display = isAssigner ? "block" : "none";

            // Show the modal
            modal.style.display = "block";
        });
    });
});


