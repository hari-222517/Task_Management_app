import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getGroups, createGroup } from '../api';

function GroupList() {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fetchGroups = useCallback(async () => {
    try {
      const response = await getGroups();
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    
    setIsCreating(true);
    try {
      await createGroup({ name: newGroupName, description: newGroupDesc });
      setNewGroupName('');
      setNewGroupDesc('');
      setIsCreating(false);
      fetchGroups();
    } catch (error) {
      console.error('Error creating group:', error);
      setIsCreating(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ minHeight: '100vh', padding: '2rem' }}>
      <div className="text-center mb-12" style={{ color: 'white' }}>
        <h2 className="text-5xl font-bold text-white mb-4" style={{ color: 'white', fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>Team Groups</h2>
        <p className="text-white/80 text-lg" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.125rem' }}>Organize your teams and collaborate efficiently</p>
      </div>

      <div className="max-w-md mx-auto mb-12">
        <form onSubmit={handleCreateGroup} className="glass-card p-6" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '1.5rem' }}>
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center" style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Group
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Group name"
              className="input-field"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', marginBottom: '1rem' }}
              required
            />
            <textarea
              value={newGroupDesc}
              onChange={(e) => setNewGroupDesc(e.target.value)}
              placeholder="Group description (optional)"
              className="input-field resize-none"
              rows="3"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: 'white', marginBottom: '1rem', resize: 'none' }}
            />
            <button 
              type="submit" 
              className="btn-secondary w-full flex items-center justify-center"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'linear-gradient(to right, #22c55e, #16a34a)', color: 'white', fontWeight: '600', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Group
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {groups.map((group, index) => (
          <Link 
            key={group.id} 
            to={`/groups/${group.id}`}
            className="card-hover"
            style={{ animationDelay: `${index * 100}ms`, textDecoration: 'none' }}
          >
            <div className="glass-card p-6 h-full" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', padding: '1.5rem', height: '100%', transition: 'transform 0.2s' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center" style={{ width: '3rem', height: '3rem', background: 'linear-gradient(to right, #3b82f6, #a855f7)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1.5rem', height: '1.5rem', color: 'white' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{ width: '0.75rem', height: '0.75rem', backgroundColor: '#4ade80', borderRadius: '50%' }}></div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2" style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{group.name}</h3>
              <p className="text-white/60 text-sm mb-4 line-clamp-2" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {group.description || 'No description available'}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-white/40 text-xs" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
                  Created {new Date(group.created_at).toLocaleDateString()}
                </span>
                <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1rem', height: '1rem', color: 'rgba(255,255,255,0.4)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {groups.length === 0 && (
        <div className="text-center py-12" style={{ textAlign: 'center', padding: '3rem 0' }}>
          <div className="w-24 h-24 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center" style={{ width: '6rem', height: '6rem', margin: '0 auto 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg className="w-12 h-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '3rem', height: '3rem', color: 'rgba(255,255,255,0.4)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-white/60 text-lg" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.125rem' }}>No groups yet</p>
          <p className="text-white/40 text-sm" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem' }}>Create your first group to get started</p>
        </div>
      )}
    </div>
  );
}

export default GroupList;
