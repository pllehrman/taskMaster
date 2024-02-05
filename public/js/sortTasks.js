document.addEventListener('DOMContentLoaded', function() {
    const sortSelect = document.getElementById('sortTasks');
    // Set the selected option based on the URL parameter
    const params = new URLSearchParams(window.location.search);
    const sortValue = params.get('sort');
    if (sortValue) {
        sortSelect.value = sortValue;
    }

    sortSelect.addEventListener('change', function() {
        const selectedSortOption = this.value;
        console.log(selectedSortOption)
        window.location.href = `/tasks?sort=${selectedSortOption}`;
    });
});