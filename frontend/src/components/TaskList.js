import React, { useState, useEffect, useCallback } from 'react';
import { getTasks, createTask, updateTaskStatus, getMembers, deleteTask } from '../api';

function TaskList({ groupId }) {
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [assignToAll, setAssignToAll] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await getTasks(groupId);
      // Handle both single task and array of tasks
      const tasksData = Array.isArray(response.data) ? response.data : [response.data];
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [groupId]);

  const fetchMembers = useCallback(async () => {
    try {
      const response = await getMembers(groupId);
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  }, [groupId]);

  useEffect(() => {
    fetchTasks();
    fetchMembers();
  }, [fetchTasks, fetchMembers]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      alert('Please provide task title.');
      return;
    }
    
    if (!assignToAll && !assignedTo) {
      alert('Please assign task to a member or select "Assign to all members".');
      return;
    }
    
    setIsCreating(true);
    try {
      const taskData = {
        title: newTaskTitle,
        description: newTaskDesc,
        assign_to_all: assignToAll,
        ...(assignToAll ? {} : { assigned_to_id: parseInt(assignedTo) })
      };
      
      await createTask(groupId, taskData);
      setNewTaskTitle('');
      setNewTaskDesc('');
      setAssignedTo('');
      setAssignToAll(false);
      setShowAddForm(false);
      setIsCreating(false);
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      setIsCreating(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          Tasks
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary flex items-center text-sm px-4 py-2"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Task
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 animate-slide-up">
          <form onSubmit={handleCreateTask} className="space-y-4">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Task title"
              className="input-field"
              required
            />
            <textarea
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              placeholder="Task description (optional)"
              className="input-field resize-none"
              rows="3"
            />
            <select 
              value={assignedTo} 
              onChange={(e) => setAssignedTo(e.target.value)} 
              className="input-field"
              disabled={assignToAll}
              required={!assignToAll}
              style={{ color: 'white' }}
            >
              <option value="">Assign to member...</option>
              {members.map((member) => (
                <option key={member.id} value={member.id} style={{ color: 'black' }}>
                  {member.name}
                </option>
              ))}
            </select>
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                id="assignToAll"
                checked={assignToAll}
                onChange={(e) => setAssignToAll(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
              />
              <label htmlFor="assignToAll" className="text-white text-sm font-medium">
                Assign to all group members
              </label>
            </div>
            <div className="flex space-x-3">
              <button 
                type="submit" 
                className="btn-primary flex-1"
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create Task'
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {tasks.map((task, index) => {
          const assignedMember = members.find(m => m.id === task.assigned_to_id);
          return (
            <div 
              key={task.id} 
              className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-lg mb-2">{task.title}</h4>
                  {task.description && (
                    <p className="text-white/60 text-sm mb-3">{task.description}</p>
                  )}
                  <div className="flex items-center space-x-4">
                    {assignedMember && (
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">
                            {assignedMember.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-white/60 text-sm">{assignedMember.name}</span>
                      </div>
                    )}
                    <span className="text-white/40 text-xs">
                      Created {new Date(task.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <select 
                    value={task.status} 
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center space-x-1 ${getStatusColor(task.status)}`}
                  >
                    <option value="pending" className="bg-gray-800">Pending</option>
                    <option value="in_progress" className="bg-gray-800">In Progress</option>
                    <option value="completed" className="bg-gray-800">Completed</option>
                  </select>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="px-3 py-1 rounded-lg border border-red-500/30 bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                    title="Delete task"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0015.838 3L12 15.172l3.627-3.627A2 2 0 0115.838 21L17 7z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-white/60 text-lg mb-2">No tasks yet</p>
          <p className="text-white/40 text-sm">Create tasks to start managing work</p>
        </div>
      )}
    </div>
  );
}

export default TaskList;
