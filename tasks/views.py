from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.forms import UserCreationForm
from .models import Task, Profile
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from .forms import TaskForm, RegisterForm, UserUpdateForm, ProfileUpdateForm 

@login_required
def task_list(request):
    filter_type = request.GET.get('filter', 'all')
    
    # Priority ordering: High (3) > Medium (2) > Low (1)
    from django.db.models import Case, When, Value, IntegerField
    
    tasks = Task.objects.filter(user=request.user).annotate(
        priority_order=Case(
            When(priority='High', then=Value(3)),
            When(priority='Medium', then=Value(2)),
            When(priority='Low', then=Value(1)),
            default=Value(0),
            output_field=IntegerField(),
        )
    ).order_by('-priority_order', '-created_at')
    
    if filter_type == 'pending':
        tasks = tasks.filter(completed=False)
    elif filter_type == 'completed':
        tasks = tasks.filter(completed=True)
        
    
    # Calculate counts independent of filter
    total_count = Task.objects.filter(user=request.user).count()
    completed_count = Task.objects.filter(user=request.user, completed=True).count()
    pending_count = Task.objects.filter(user=request.user, completed=False).count()

    context = {
        'tasks': tasks,
        'filter_type': filter_type,
        'total_count': total_count,
        'pending_count': pending_count,
        'completed_count': completed_count
    }
    return render(request, 'task_list.html', context)

@login_required
def add_task(request):
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            task = form.save(commit=False)
            task.user = request.user
            task.save()
            return redirect('task_list')
    else:
        form = TaskForm()

    return render(request, 'add_task.html', {'form': form})

@login_required
def complete_task(request, task_id):
    task = Task.objects.get(id=task_id, user=request.user)
    task.completed = True
    task.save()
    return redirect('task_list')

@login_required
def delete_task(request, task_id):
    task = Task.objects.get(id=task_id, user=request.user)
    task.delete()
    return redirect('task_list')

@login_required
def edit_task(request, id):
    task = get_object_or_404(Task, id=id, user=request.user)

    if request.method == "POST":
        form = TaskForm(request.POST, instance=task)
        if form.is_valid():
            form.save()
            return redirect("task_list")
    else:
        form = TaskForm(instance=task)

    return render(request, "edit_task.html", {"task": task, "form": form})


def register(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST, request.FILES)
        if form.is_valid():
            user = form.save()
            login(request, user)  # auto login after register
            return redirect('task_list')
    else:
        form = RegisterForm()

    return render(request, 'registration/register.html', {'form': form}) 


@login_required
def profile(request):
    # Ensure profile exists
    Profile.objects.get_or_create(user=request.user)

    if request.method == 'POST':
        u_form = UserUpdateForm(request.POST, instance=request.user)
        p_form = ProfileUpdateForm(request.POST, request.FILES, instance=request.user.profile)
        if u_form.is_valid() and p_form.is_valid():
            u_form.save()
            p_form.save()
            return redirect('profile')
    else:
        u_form = UserUpdateForm(instance=request.user)
        p_form = ProfileUpdateForm(instance=request.user.profile)

    context = {
        'u_form': u_form,
        'p_form': p_form,
        'tasks_total': request.user.task_set.count(),
        'tasks_active': request.user.task_set.filter(completed=False).count()
    }

    return render(request, 'profile.html', context)
