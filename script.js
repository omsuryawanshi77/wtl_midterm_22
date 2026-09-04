const addMentorForm = document.getElementById('addMentorForm');
const editMentorForm = document.getElementById('editMentorForm');
const submitBtn = document.getElementById('submitBtn');
const editModal = document.getElementById('editModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const statusMessage = document.getElementById('statusMessage');
const mentorTableBody = document.getElementById('mentorTableBody');

function showSuccessMessage(message) {
    statusMessage.textContent = message;
    statusMessage.style.display = 'block';
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 3000);
}

// 1. Fetch & Load All Mentors
async function loadMentors() {
    try {
        const response = await fetch('fetch_mentors.php');
        const mentors = await response.json();

        mentorTableBody.innerHTML = '';

        if (!Array.isArray(mentors) || mentors.length === 0) {
            mentorTableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; color: #666; padding: 15px; font-weight: bold;">
                        No mentor found
                    </td>
                </tr>
            `;
            return;
        }

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

document.addEventListener('DOMContentLoaded', loadMentors);

// 2. Add Form Real-time Validation
if (addMentorForm && submitBtn) {
    const validateForm = () => {
        submitBtn.disabled = !addMentorForm.checkValidity();
    };
    addMentorForm.addEventListener('input', validateForm);
    addMentorForm.addEventListener('change', validateForm);
}

// 3. Add Mentor (POST to add_mentor.php)
if (addMentorForm) {
    addMentorForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(addMentorForm);

        try {
            const res = await fetch('add_mentor.php', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.status === 'success') {
                showSuccessMessage(data.message);
                addMentorForm.reset();
                if (submitBtn) submitBtn.disabled = true;
                loadMentors();
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error("Add failed:", err);
            alert("Failed to add mentor. Ensure Employee ID is unique.");
        }
    });
}

// 4. Open Edit Modal
function openEditModal(id, buttonElement) {
    const row = buttonElement.closest('tr');

    document.getElementById('edit_id').value = id;
    document.getElementById('edit_name').value = row.querySelector('.row-name').textContent.trim();
    document.getElementById('edit_emp_id').value = row.querySelector('.row-emp-id').textContent.trim();
    document.getElementById('edit_department').value = row.querySelector('.row-dept').textContent.trim();
    document.getElementById('edit_designation').value = row.querySelector('.row-desig').textContent.trim();
    document.getElementById('edit_max_mentees').value = row.querySelector('.row-max').textContent.trim();
    document.getElementById('edit_photo').value = '';

    if (editModal && typeof editModal.showModal === 'function') {
        editModal.showModal();
    } else if (editModal) {
        editModal.style.display = 'block';
    }
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        if (editModal && typeof editModal.close === 'function') {
            editModal.close();
        } else if (editModal) {
            editModal.style.display = 'none';
        }
    });
}

// 5. Submit Update (POST to update_mentor.php)
if (editMentorForm) {
    editMentorForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(editMentorForm);

        try {
            const res = await fetch('update_mentor.php', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.status === 'success') {
                showSuccessMessage(data.message);
                if (editModal && typeof editModal.close === 'function') {
                    editModal.close();
                } else if (editModal) {
                    editModal.style.display = 'none';
                }
                editMentorForm.reset();
                loadMentors();
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to update mentor.");
        }
    });
}

// 6. Delete Mentor
async function confirmDelete(id) {
    if (confirm("Are you sure you want to delete this mentor record?")) {
        try {
            const res = await fetch(`delete_mentor.php?id=${id}`);
            const data = await res.json();

            if (data.status === 'success') {
                showSuccessMessage(data.message);
                loadMentors();
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error("Delete failed:", err);
        }
    }
}
