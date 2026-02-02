// add_task.js - New Task Creation

document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const form = document.getElementById('addTaskForm');
    const submitBtn = form.querySelector('.btn-primary');
    const description = document.querySelector('textarea[name="description"]');
    const charCount = document.getElementById('charCount');
    const clearDateBtn = document.getElementById('clearDate');
    const dateInput = document.getElementById('due_date');
    const priorityOptions = document.querySelectorAll('.priority-option');
    const successToast = document.getElementById('successToast');

    // Character Counter
    if (description) {
        description.addEventListener('input', function () {
            const count = this.value.length;
            charCount.textContent = count;

            if (count > 450) {
                charCount.parentElement.classList.add('warning');
            } else {
                charCount.parentElement.classList.remove('warning');
            }

            if (count > 500) {
                this.value = this.value.substring(0, 500);
                charCount.textContent = 500;
                charCount.parentElement.classList.add('error');
            } else {
                charCount.parentElement.classList.remove('error');
            }
        });
    }

    // Clear Date Button
    if (clearDateBtn && dateInput) {
        clearDateBtn.addEventListener('click', function () {
            dateInput.value = '';
        });
    }

    // Priority Selection
    priorityOptions.forEach(option => {
        option.addEventListener('click', function () {
            priorityOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });

    if (form) {
        form.addEventListener('submit', function () {
            submitBtn.classList.add('loading');
        });
    }


    // Add Tag Functionality
    const addTagBtn = document.querySelector('.btn-add-tag');
    if (addTagBtn) {
        addTagBtn.addEventListener('click', function () {
            const tagInput = document.querySelector('.tag-input');
            tagInput.style.display = 'block';
            tagInput.focus();
        });
    }

    // Initialize date to today
    const today = new Date().toISOString().split('T')[0];
    if (dateInput) {
        dateInput.min = today;
    }

    // Initialize first priority as active
    const firstPriority = document.querySelector('.priority-option');
    if (firstPriority) {
        firstPriority.click();
    }
});
