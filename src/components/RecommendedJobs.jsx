import React, { useEffect, useState } from 'react';

function RecommendedJobs() {
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommended() {
      setLoading(true);
      try {
        const res = await fetch('/api/jobs/recommended', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await res.json();
        setJobs(data.jobs || []);
        setMessage(data.message || '');
      } catch (err) {
        setMessage('Failed to load recommendations.');
      } finally {
        setLoading(false);
      }
    }
    fetchRecommended();
  }, []);

  if (loading) return <div>Loading recommendations...</div>;

  return (
    <section>
      <h2>Recommended for You</h2>
      {jobs.length === 0 ? (
        <div>{message || 'Complete your profile to improve job matches.'}</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {jobs.map(job => (
            <li key={job.id} style={{ marginBottom: '1rem', border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
              <div><strong>{job.title}</strong> <span style={{ color: '#888' }}>({job.company})</span></div>
              <div>Location: {job.location || 'Remote'}</div>
              <div>Match: <span style={{ fontWeight: 'bold', color: '#2a9d8f' }}>{job.matchScore}%</span></div>
              <button style={{ marginTop: 8 }}>Quick Apply</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default RecommendedJobs;
