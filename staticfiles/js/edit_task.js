// edit_task.js - Task Editor Functionality

document.addEventListener('DOMContentLoaded', function () {
    initializeForm();
    initializeStatusToggle();
    initializeDatePicker();
    initializeTags();
    initializePrioritySelector();
    initializeAutoSave();
});

// Form Initialization
function initializeForm() {
    const form = document.getElementById('editTaskForm');
    const titleField = document.getElementById('id_title');
    const descField = document.getElementById('id_description');

    // Character counters
    if (titleField) {
        titleField.addEventListener('input', function () {
            document.getElementById('titleCounter').textContent =
                `${this.value.length}/120`;
        });
        // Initial counter
        document.getElementById('titleCounter').textContent =
            `${titleField.value.length}/120`;
    }

    if (descField) {
        descField.addEventListener('input', function () {
            document.getElementById('descCounter').textContent =
                `${this.value.length}/1000`;
        });
        // Initial counter
        document.getElementById('descCounter').textContent =
            `${descField.value.length}/1000`;
    }

    // Form change detection
    form.addEventListener('input', function () {
        window.hasUnsavedChanges = true;
        updateFormState();
    });
}

// Task Status Toggle Fix
// Task Status Toggle Fix
function initializeStatusToggle() {
    const completedCheckbox = document.getElementById('id_completed');
    const statusBadge = document.querySelector('.task-status-badge');

    if (completedCheckbox && statusBadge) {
        completedCheckbox.addEventListener('change', function () {
            window.hasUnsavedChanges = true;

            if (this.checked) {
                statusBadge.classList.remove('active');
                statusBadge.classList.add('completed');
                statusBadge.innerHTML = '<i class="fas fa-check-circle"></i><span>Completed</span>';
            } else {
                statusBadge.classList.remove('completed');
                statusBadge.classList.add('active');
                statusBadge.innerHTML = '<i class="fas fa-clock"></i><span>Active</span>';
            }
        });
    }
}


// Date Picker Initialization
function initializeDatePicker() {
    const datePicker = flatpickr('.date-picker-input', {
        dateFormat: "Y-m-d",
        minDate: "today",
        allowInput: true,
        onChange: function (selectedDates, dateStr, instance) {
            window.hasUnsavedChanges = true;
            updateClearDateButton(dateStr);
        }
    });

    // Quick date buttons
    document.querySelectorAll('.date-quick-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const days = parseInt(this.dataset.days);
            const date = new Date();
            date.setDate(date.getDate() + days);

            const formattedDate = date.toISOString().split('T')[0];
            document.getElementById('due_date').value = formattedDate;

            // Trigger change
            document.getElementById('due_date').dispatchEvent(new Event('change'));
        });
    });
}

function clearDate() {
    document.getElementById('due_date').value = '';
    updateClearDateButton('');
}

function updateClearDateButton(dateStr) {
    const clearBtn = document.querySelector('.clear-date-btn');
    if (clearBtn) {
        if (dateStr) {
            clearBtn.style.display = 'flex';
        } else {
            clearBtn.style.display = 'none';
        }
    }
}

// Tags Management
function initializeTags() {
    const tagsInput = document.getElementById('tagsInput');
    const selectedTags = document.getElementById('selectedTags');
    const hiddenTags = document.getElementById('hiddenTags');

    // Load existing tags
    let tags = [];
    try {
        tags = JSON.parse(hiddenTags.value || '[]');
    } catch (e) {
        tags = [];
    }

    renderTags(tags);

    // Add tag on Enter
    tagsInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && this.value.trim()) {
            e.preventDefault();
            addTag(this.value.trim());
            this.value = '';
        }
    });

    // Suggested tags
    document.querySelectorAll('.suggested-tag').forEach(tag => {
        tag.addEventListener('click', function () {
            addTag(this.dataset.tag);
        });
    });

    function addTag(tagText) {
        if (!tags.includes(tagText)) {
            tags.push(tagText);
            renderTags(tags);
            window.hasUnsavedChanges = true;
        }
    }

    function removeTag(tagText) {
        tags = tags.filter(tag => tag !== tagText);
        renderTags(tags);
        window.hasUnsavedChanges = true;
    }

    function renderTags(tagsArray) {
        selectedTags.innerHTML = '';
        tagsArray.forEach(tag => {
            const tagElement = document.createElement('div');
            tagElement.className = 'tag-item';
            tagElement.innerHTML = `
                ${tag}
                <span class="tag-remove" onclick="removeTag('${tag}')">
                    <i class="fas fa-times"></i>
                </span>
            `;
            selectedTags.appendChild(tagElement);
        });
        hiddenTags.value = JSON.stringify(tagsArray);
    }

    // Make functions globally available
    window.addTag = addTag;
    window.removeTag = removeTag;
    window.renderTags = renderTags;
}

// Priority Selector
function initializePrioritySelector() {
    const priorityOptions = document.querySelectorAll('.priority-option');
    const priorityInput = document.getElementById('priorityInput');


    priorityOptions.forEach(option => {
        option.addEventListener('click', function () {
            priorityOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');

            priorityInput.value = this.dataset.value; // ✅ saved to DB
            window.hasUnsavedChanges = true;
        });
    });
}

// Auto-save System
function initializeAutoSave() {
    const form = document.getElementById('editTaskForm');
    let autoSaveTimer;

    form.addEventListener('input', function () {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(saveDraft, 2000);
    });

    // Load draft on page load
    window.addEventListener('load', function () {
        const draft = localStorage.getItem('task_edit_draft');
        if (draft) {
            showDraftNotification(draft);
        }
    });

    // Clear draft on successful submit
    form.addEventListener('submit', function () {
        localStorage.removeItem('task_edit_draft');
        showNotification('Changes saved successfully!', 'success');
    });
}

function saveDraft() {
    const form = document.getElementById('editTaskForm');
    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Save tags
    const tags = JSON.parse(document.getElementById('hiddenTags').value);
    data.tags = tags;

    localStorage.setItem('task_edit_draft', JSON.stringify(data));
    updateSaveIndicator(true);
}

function loadDraft() {
    const draft = localStorage.getItem('task_edit_draft');
    if (!draft) return;

    const data = JSON.parse(draft);

    // Load form data
    Object.keys(data).forEach(key => {
        const element = document.querySelector(`[name="${key}"]`);
        if (element) {
            element.value = data[key];
        }
    });

    // Load tags
    if (data.tags) {
        renderTags(data.tags);
    }

    showNotification('Draft loaded successfully', 'success');
    updateSaveIndicator(false);
}

function clearDraft() {
    localStorage.removeItem('task_edit_draft');
    showNotification('Draft cleared', 'info');
    updateSaveIndicator(false);
}

function updateSaveIndicator(saving) {
    const indicator = document.createElement('div');
    indicator.className = 'save-indicator';
    indicator.innerHTML = saving ?
        '<i class="fas fa-save"></i> Saving...' :
        '<i class="fas fa-check"></i> All changes saved';

    // Remove existing indicator
    const existing = document.querySelector('.save-indicator');
    if (existing) existing.remove();

    // Add new indicator
    document.querySelector('.footer-info').appendChild(indicator);
}

function showDraftNotification(draft) {
    const notification = document.createElement('div');
    notification.className = 'draft-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-file-alt"></i>
            <div class="notification-text">
                <strong>Unsaved draft found</strong>
                <small>From ${new Date(JSON.parse(draft).timestamp).toLocaleTimeString()}</small>
            </div>
            <div class="notification-actions">
                <button onclick="loadDraft()" class="btn-load">Load</button>
                <button onclick="clearDraft()" class="btn-discard">Discard</button>
            </div>
        </div>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 10 seconds
    setTimeout(() => {
        notification.remove();
    }, 10000);
}

// Form State Management
function updateFormState() {
    const saveBtn = document.querySelector('.btn-save-primary');
    if (window.hasUnsavedChanges) {
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes *';
        saveBtn.style.background = 'var(--warning-color)';
    } else {
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        saveBtn.style.background = 'var(--primary-color)';
    }
}

// Form Actions
function resetForm() {
    if (confirm('Are you sure you want to reset all changes?')) {
        document.getElementById('editTaskForm').reset();
        window.hasUnsavedChanges = false;
        updateFormState();
        clearDraft();
        showNotification('Form reset to original values', 'info');
    }
}

function confirmCancel() {
    if (window.hasUnsavedChanges) {
        document.getElementById('confirmModal').classList.add('show');
    } else {
        goBack();
    }
}

function closeConfirmModal() {
    document.getElementById('confirmModal').classList.remove('show');
}

function discardChanges() {
    clearDraft();
    goBack();
}

function goBack() {
    window.location.href = document.querySelector('.back-button').href;
}

// Preview Functionality
const previewBtn = document.getElementById('previewBtn');
if (previewBtn) {
    previewBtn.addEventListener('click', showPreview);
}

function showPreview() {
    const form = document.getElementById('editTaskForm');
    const previewBody = document.getElementById('previewBody');

    // Get form data
    const title = document.getElementById('id_title').value || 'Untitled Task';
    const description = document.getElementById('id_description').value || 'No description provided';
    const completed = document.querySelector('.toggle-switch-large input').checked;
    const priority = document.querySelector('.priority-option.active').dataset.value;
    const dueDate = document.getElementById('due_date').value;
    const notes = document.getElementById('notes').value;
    const tags = JSON.parse(document.getElementById('hiddenTags').value);

    // Generate preview HTML
    previewBody.innerHTML = `
        <div class="preview-task-card">
            <div class="preview-header">
                <div class="preview-title-section">
                    <h2>${title}</h2>
                    <span class="preview-status ${completed ? 'completed' : 'active'}">
                        <i class="fas fa-${completed ? 'check-circle' : 'clock'}"></i>
                        ${completed ? 'Completed' : 'Active'}
                    </span>
                </div>
                <div class="preview-priority priority-${priority}">
                    <i class="fas fa-flag"></i>
                    ${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                </div>
            </div>
            
            ${dueDate ? `
            <div class="preview-due-date">
                <i class="fas fa-calendar-day"></i>
                <strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}
            </div>
            ` : ''}
            
            <div class="preview-description">
                <h4><i class="fas fa-align-left"></i> Description</h4>
                <p>${description.replace(/\n/g, '<br>')}</p>
            </div>
            
            ${tags.length ? `
            <div class="preview-tags">
                <h4><i class="fas fa-tags"></i> Tags</h4>
                <div class="preview-tags-list">
                    ${tags.map(tag => `<span class="preview-tag">${tag}</span>`).join('')}
                </div>
            </div>
            ` : ''}
            
            ${notes ? `
            <div class="preview-notes">
                <h4><i class="fas fa-sticky-note"></i> Notes</h4>
                <div class="notes-content">${notes.replace(/\n/g, '<br>')}</div>
            </div>
            ` : ''}
            
            <div class="preview-meta">
                <div class="meta-item">
                    <i class="fas fa-history"></i>
                    <span>Last Edited: Just now</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-code-branch"></i>
                    <span>Version: Preview</span>
                </div>
            </div>
        </div>
    `;

    document.getElementById('previewModal').classList.add('show');
}

function closePreview() {
    document.getElementById('previewModal').classList.remove('show');
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Prevent accidental navigation
window.addEventListener('beforeunload', function (e) {
    if (window.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return 'You have unsaved changes. Are you sure you want to leave?';
    }
});

// Make functions globally available for inline onclick handlers
window.resetForm = resetForm;
window.confirmCancel = confirmCancel;
window.closeConfirmModal = closeConfirmModal;
window.discardChanges = discardChanges;
window.clearDraft = clearDraft;
window.closePreview = closePreview;
window.clearDate = clearDate;
