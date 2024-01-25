window.onload = function() {
    var container = document.querySelector('.organization-container');
    var scrollAmount = 0;
    setInterval(function() {
        container.scrollLeft += 10;
        scrollAmount += 10;
        if (scrollAmount >= container.scrollWidth) {
            container.scrollLeft = 0;
            scrollAmount = 0;
        }
    }, 100);
};
