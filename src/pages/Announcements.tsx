import { useState, useEffect, FormEvent } from 'react';

type Announcement = {
  id: number;
  title: string;
  content: string;
  date: string;
};

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('hub_announcements');
    if (saved) setAnnouncements(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('hub_announcements', JSON.stringify(announcements));
  }, [announcements]);

  const handlePost = (e: FormEvent) => {
    e.preventDefault();
    if (!title ||!content) return;
    
    const newPost: Announcement = {
      id: Date.now(),
      title,
      content,
      date: new Date().toLocaleDateString('en-KE', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    
    setAnnouncements([newPost,...announcements]);
    setTitle('');
    setContent('');
  };

  const handleDelete = (id: number) => {
    setAnnouncements(announcements.filter(a => a.id!== id));
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>📢 Announcements</h1>
      
      <button 
        onClick={() => setIsAdmin(!isAdmin)}
        style={{ 
          marginBottom: '1rem', 
          padding: '0.5rem 1rem',
          background: isAdmin? '#10b981' : '#6b7280',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        {isAdmin? 'Admin Mode: ON' : 'Admin Mode: OFF'}
      </button>

      {isAdmin && (
        <form onSubmit={handlePost} style={{ 
          marginBottom: '2rem', 
          padding: '1.5rem', 
          border: '1px solid #e5e7eb', 
          borderRadius: '8px',
          background: '#f9fafb'
        }}>
          <h3>Post New Announcement</h3>
          <input
            type="text"
            placeholder="Announcement Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              marginBottom: '1rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px'
            }}
          />
          <textarea
            placeholder="Announcement content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              marginBottom: '1rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              resize: 'vertical'
            }}
          />
          <button 
            type="submit"
            style={{ 
              padding: '0.75rem 1.5rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Post Announcement
          </button>
        </form>
      )}

      <div>
        {announcements.length === 0? (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
            No announcements yet. Toggle Admin Mode to post one!
          </p>
        ) : (
          announcements.map((post) => (
            <div 
              key={post.id} 
              style={{ 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px', 
                padding: '1.5rem', 
                marginBottom: '1rem',
                background: 'white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#111827' }}>{post.title}</h3>
                  <p style={{ margin: '0 0 1rem 0', color: '#374151', lineHeight: '1.6' }}>{post.content}</p>
                  <small style={{ color: '#6b7280' }}>Posted: {post.date}</small>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(post.id)}
                    style={{ 
                      padding: '0.5rem 1rem',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      marginLeft: '1rem'
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
