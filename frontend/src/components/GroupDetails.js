import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getGroup, deleteGroup } from '../api';
import MemberList from './MemberList';
import TaskList from './TaskList';

function GroupDetails() {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchGroupDetails = useCallback(async () => {
    try {
      const response = await getGroup(groupId);
      setGroup(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching group details:', error);
      setLoading(false);
    }
  }, [groupId]);

  const handleDeleteGroup = async () => {
    if (window.confirm('Are you sure you want to delete this group? This will also delete all members and tasks associated with it.')) {
      try {
        await deleteGroup(groupId);
        navigate('/');
      } catch (error) {
        console.error('Error deleting group:', error);
      }
    }
  };

  useEffect(() => {
    fetchGroupDetails();
  }, [fetchGroupDetails]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="glass-card p-8">
          <div className="flex items-center space-x-4">
            <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-white text-lg">Loading group details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-12">
        <div className="glass-card p-8 max-w-md mx-auto">
          <svg className="w-16 h-16 text-white/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-white text-lg mb-4">Group not found</p>
          <Link to="/" className="btn-primary inline-flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Groups
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-white/60 hover:text-white transition-colors mb-6">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Groups
        </Link>
        
        <div className="glass-card p-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl font-bold gradient-text mb-2">{group.name}</h1>
                  <div className="flex items-center space-x-4 text-white/60 text-sm">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2 2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Created {new Date(group.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Active Team
                    </span>
                  </div>
                </div>
              </div>
              
              {group.description ? (
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-white/80">{group.description}</p>
                </div>
              ) : (
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-white/40 italic">No description provided</p>
                </div>
              )}
            </div>
            
            <button
              onClick={handleDeleteGroup}
              className="px-4 py-2 rounded-lg border border-red-500/30 bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors flex items-center"
              title="Delete group"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0015.838 3L12 15.172l3.627-3.627A2 2 0 0115.838 21L17 7z" />
              </svg>
              Delete Group
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <MemberList groupId={groupId} />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
          <TaskList groupId={groupId} />
        </div>
      </div>
    </div>
  );
}

export default GroupDetails;
