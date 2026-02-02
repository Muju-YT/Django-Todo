// task_list.js - Task List Functionality

document.addEventListener('DOMContentLoaded', function () {
    // Delete confirmation
    const deleteLinks = document.querySelectorAll('.btn-delete-disabled');
    const deleteModalElement = document.getElementById('deleteConfirmModal');

    if (deleteModalElement) {
        let deleteModal;
        try {
            deleteModal = new bootstrap.Modal(deleteModalElement);
        } catch (e) {
            console.error("Bootstrap Modal failed to initialize", e);
        }

        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

        deleteLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const deleteUrl = this.getAttribute('href'); // Use getAttribute for safety

                if (deleteModal && confirmDeleteBtn) {
                    confirmDeleteBtn.href = deleteUrl;
                    try {
                        deleteModal.show();
                    } catch (err) {
                        console.error("Modal show failed", err);
                        // Fallback
                        if (confirm("Are you sure you want to delete this task?")) {
                            window.location.href = deleteUrl;
                        }
                    }
                } else {
                    // Fallback if modal setup failed
                    if (confirm("Are you sure you want to delete this task?")) {
                        window.location.href = deleteUrl;
                    }
                }
            });
        });
    } else {
        // Fallback if modal element missing
        deleteLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                if (!confirm("Are you sure you want to delete this task?")) {
                    e.preventDefault();
                }
            });
        });
    }

    // Task card hover effect
    const taskCards = document.querySelectorAll('.task-card:not(.completed)');
    taskCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-5px)';
        });
        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });
});
