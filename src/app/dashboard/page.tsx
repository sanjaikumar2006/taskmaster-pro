'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, Search, Filter, LogOut, CheckCircle2, 
  Circle, Clock, Trash2, Edit3, ChevronLeft, 
  ChevronRight, Loader2, ListTodo
} from 'lucide-react';
import { decryptData } from '@/lib/crypto'; // Note: Decryption usage for sensitive fields if stored encrypted

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'pending' });
  const [statsData, setStatsData] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const router = useRouter();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: '6',
        status,
        search
      });
      const res = await fetch(`/api/tasks?${query}`);
      const data = await res.json().catch(() => ({ tasks: [], pagination: { pages: 1 } }));
      
      if (res.ok && data.tasks) {
        setTasks(data.tasks);
        setTotalPages(data.pagination.pages);
        if (data.stats) setStatsData(data.stats);
      } else {
        console.error('Task fetch error:', data.details || data.error);
      }
    } catch (error) {
      console.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (res.ok) setUser(data.user);
    } catch (error) {}
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchTasks]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingTask ? `/api/tasks/${editingTask._id}` : '/api/tasks';
    const method = editingTask ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingTask(null);
        setFormData({ title: '', description: '', status: 'pending' });
        fetchTasks();
      }
    } catch (error) {}
  };

  const deleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (res.ok) fetchTasks();
    } catch (error) {}
  };

  const openEditModal = (task: any) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status
    });
    setIsModalOpen(true);
  };

  const getStatusColor = (s: string) => {
    switch(s) {
      case 'completed': return 'var(--success)';
      case 'in-progress': return 'var(--warning)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      {/* Header */}
      <nav className="glass-card" style={{ 
        position: 'sticky', top: 0, zIndex: 10, borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '8px' }}>
            <ListTodo color="white" size={20} />
          </div>
          <h2 style={{ fontSize: '1.25rem' }}>TaskMaster</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ textAlign: 'right', display: 'none', md: 'block' } as any}>
            <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.name}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem' }}>
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Controls */}
        <div style={{ 
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', 
          marginBottom: '2rem', gap: '1rem' 
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Your Tasks</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage and track your productivity</p>
          </div>
          <button onClick={() => { setEditingTask(null); setFormData({ title: '', description: '', status: 'pending' }); setIsModalOpen(true); }} className="btn btn-primary">
            <Plus size={20} /> New Task
          </button>
        </div>

        {/* Stats Section */}
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' 
        }}>
          {[
            { label: 'Total Tasks', value: statsData.total, color: 'var(--primary)', icon: <ListTodo size={20} /> },
            { label: 'Pending', value: statsData.pending, color: 'var(--text-muted)', icon: <Circle size={20} /> },
            { label: 'In Progress', value: statsData.inProgress, color: 'var(--warning)', icon: <Clock size={20} /> },
            { label: 'Completed', value: statsData.completed, color: 'var(--success)', icon: <CheckCircle2 size={20} /> },
          ].map((stat, i) => (
            <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
              <div style={{ background: `${stat.color}20`, color: stat.color, padding: '0.75rem', borderRadius: '12px' }}>
                {stat.icon}
              </div>
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>{stat.label}</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="card" style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              className="input-field" 
              style={{ paddingLeft: '40px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['all', 'pending', 'in-progress', 'completed'].map((s) => (
              <button 
                key={s}
                onClick={() => setStatus(s)}
                className={`btn ${status === s ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.875rem', textTransform: 'capitalize' }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Task Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <Loader2 className="animate-spin" size={40} color="var(--primary)" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <ListTodo size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>No tasks found. Create one to get started!</p>
          </div>
        ) : (
          <>
            <div style={{ 
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem', marginBottom: '2rem' 
            }}>
              {tasks.map((task: any) => (
                <div key={task._id} className="card animate-fade" style={{ display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', cursor: 'default' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ 
                      fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.75rem', borderRadius: '20px',
                      background: `${getStatusColor(task.status)}20`, color: getStatusColor(task.status),
                      textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.375rem'
                    }}>
                      {task.status === 'completed' && <CheckCircle2 size={12} />}
                      {task.status === 'in-progress' && <Clock size={12} />}
                      {task.status === 'pending' && <Circle size={12} />}
                      {task.status}
                    </span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => openEditModal(task)} className="btn btn-outline" style={{ padding: '0.4rem', border: 'none' }}>
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => deleteTask(task._id)} className="btn btn-outline" style={{ padding: '0.4rem', border: 'none', color: 'var(--error)' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <h3 style={{ marginBottom: '0.5rem' }}>{task.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', flex: 1 }}>{task.description}</p>
                  <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                <button 
                  disabled={page === 1} 
                  onClick={() => setPage(p => p - 1)}
                  className="btn btn-outline"
                >
                  <ChevronLeft size={18} />
                </button>
                <span style={{ fontWeight: 600 }}>Page {page} of {totalPages}</span>
                <button 
                  disabled={page === totalPages} 
                  onClick={() => setPage(p => p + 1)}
                  className="btn btn-outline"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div style={{ 
          position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.8)', 
          backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div className="card animate-fade" style={{ maxWidth: '540px', width: '100%', padding: '2.5rem', border: '1px solid var(--glass-border)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Title</label>
                <input 
                  type="text" 
                  className="input-field" 
                  required 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Description</label>
                <textarea 
                  className="input-field" 
                  rows={4} 
                  style={{ resize: 'none' }}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Status</label>
                <select 
                  className="input-field"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {editingTask ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
