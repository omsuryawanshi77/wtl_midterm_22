const addMentorForm = document.getElementById('addMentorForm');
const editMentorForm = document.getElementById('editMentorForm');
const submitBtn = document.getElementById('submitBtn');
const editModal = document.getElementById('editModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const statusMessage = document.getElementById('statusMessage');
const mentorTableBody = document.getElementById('mentorTableBody');

// Show notification banner
function showSuccessMessage(message) {
    statusMessage.textContent = message;
    statusMessage.style.display = 'block';
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 3000);
}

// 1. Fetch & Load All Mentors from MySQL Database
async function loadMentors() {
    try {
        const response = await fetch('fetch_mentors.php');
        const mentors = await response.json();

        mentorTableBody.innerHTML = '';
        mentors.forEach(m => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="row-name">${m.name}</td>
                <td class="row-emp-id">${m.emp_id}</td>
                <td class="row-dept">${m.department}</td>
                <td class="row-desig">${m.designation}</td>
                <td class="row-max">${m.max_mentees}</td>
                <td class="row-photo">
                    <img src="${m.photo}" class="mentor-photo" alt="Photo">
                </td>
                <td>
                    <button type="button" onclick="openEditModal(${m.id}, this)">Edit</button>
                    <button type="button" style="background-color: #dc3545;" onclick="confirmDelete(${m.id})">Delete</button>
                </td>
            `;
            mentorTableBody.appendChild(row);
        });
    } catch (err) {
        console.error("Failed to load mentors:", err);
    }
}

// Initial Load
document.addEventListener('DOMContentLoaded', loadMentors);

// 2. Form Validation
if (addMentorForm && submitBtn) {
    const validateForm = () => {
        submitBtn.disabled = !addMentorForm.checkValidity();
    };
    addMentorForm.addEventListener('input', validateForm);
    addMentorForm.addEventListener('change', validateForm);
}

// 3. Add Mentor (POST to add_mentor.php)
addMentorForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(addMentorForm);

    const res = await fetch('add_mentor.php', {
        method: 'POST',
        body: formData
    });
    const data = await res.json();

    if (data.status === 'success') {
        showSuccessMessage(data.message);
        addMentorForm.reset();
        submitBtn.disabled = true;
        loadMentors();
    } else {
        alert(data.message);
    }
});

// 4. Open Edit Modal
let currentEditId = null;
function openEditModal(id, buttonElement) {
    currentEditId = id;
    const row = buttonElement.closest('tr');

    document.getElementById('edit_name').value = row.querySelector('.row-name').textContent;
    document.getElementById('edit_emp_id').value = row.querySelector('.row-emp-id').textContent;
    document.getElementById('edit_department').value = row.querySelector('.row-dept').textContent;
    document.getElementById('edit_designation').value = row.querySelector('.row-desig').textContent;
    document.getElementById('edit_max_mentees').value = row.querySelector('.row-max').textContent;

    editModal.showModal();
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => editModal.close());
}

// 5. Submit Update (POST to update_mentor.php)
editMentorForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(editMentorForm);
    formData.append('id', currentEditId);

    const res = await fetch('update_mentor.php', {
        method: 'POST',
        body: formData
    });
    const data = await res.json();

    if (data.status === 'success') {
        showSuccessMessage(data.message);
        editModal.close();
        editMentorForm.reset();
        loadMentors();
    } else {
        alert(data.message);
    }
});

// 6. Delete Mentor (GET to delete_mentor.php)
async function confirmDelete(id) {
    if (confirm("Are you sure you want to delete this mentor record?")) {
        const res = await fetch(`delete_mentor.php?id=${id}`);
        const data = await res.json();

        if (data.status === 'success') {
            showSuccessMessage(data.message);
            loadMentors();
        } else {
            alert(data.message);
        }
    }
}