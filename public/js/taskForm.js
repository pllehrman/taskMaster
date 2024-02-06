document.addEventListener('DOMContentLoaded', function() {
    var organizationSelect = document.createElement('select');
    organizationSelect.id = 'organization';
    organizationSelect.name = 'organization';
    organizationSelect.required = true;
    
    // Add a default option prompting user selection
    var defaultOption = document.createElement('option');
    defaultOption.textContent = 'Select An Organization';
    defaultOption.value = '';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    organizationSelect.appendChild(defaultOption);

    document.getElementById('organization-container').appendChild(organizationSelect);

    // Load organizations on page load
    fetch('/organizations/api')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        data.organizations.forEach(org => {
            console.log(org);
            var option = document.createElement('option');
            option.value = org._id;
            option.textContent = org.name;
            organizationSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error fetching organizations:', error));

    // Listen for changes on the organization select and load users for the selected organization
    organizationSelect.addEventListener('change', function() {
        var organizationId = this.value;
        
        // Ensure a valid organization is selected before attempting to fetch users
        if (!organizationId) return; // Skip fetching if the default option is selected

        fetch(`/organizations/users/${organizationId}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            const usersContainer = document.getElementById('users-checkboxes');
            usersContainer.innerHTML = '';
            
            if (data.success && data.organization) {
                const orgObjects = data.organization; // Assuming this is an array of member objects
    
                // Iterate over the members array to populate checkboxes
                orgObjects.forEach(element => {
                    const checkboxContainer = document.createElement('div');
                    checkboxContainer.classList.add('checkbox-container');
            
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = element.member._id; // Assuming element has a member object with _id
                    checkbox.name = 'users[]';
                    checkbox.value = element.member._id; // Assuming element has a member object with _id
                    
                    const label = document.createElement('label');
                    label.htmlFor = element.member._id; // Ensure this ID matches the checkbox's ID
                    label.textContent = element.member.name; // Assuming element has a member object with name
                    
                    checkboxContainer.appendChild(checkbox);
                    checkboxContainer.appendChild(label);
                    usersContainer.appendChild(checkboxContainer);
                });
            } else {
                console.error('Failed to fetch organization members:', data.message);
            }
        })
        .catch(error => console.error('Error fetching organization details:', error));
    });
});
