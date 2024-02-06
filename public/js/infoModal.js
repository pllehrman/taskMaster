// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the modal
    var infoModal = document.getElementById('infoModal');

    // Get the button that opens the modal
    var infoButton = document.getElementById('infoButton');

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName('close')[0];

    // When the user clicks the button, open the modal 
    infoButton.onclick = function() {
        infoModal.style.display = 'block';
    };

    // Also, you might want to close the modal if the user clicks outside of it
    window.onclick = function(event) {
        if (event.target == infoModal) {
            infoModal.style.display = 'none';
        }
    };
});

document.addEventListener('DOMContentLoaded', function() {
    // Get all close buttons
    var closeButtons = document.getElementsByClassName('close');

    // Function to close the modal
    var closeModal = function() {
        // This function will find the closest parent with class 'modal' and hide it
        var modal = this.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
        }
    };

    // Attach the close event to all close buttons
    Array.from(closeButtons).forEach(function(button) {
        button.onclick = closeModal;
    });

    // Close the modal if the user clicks outside of it
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    };
});

