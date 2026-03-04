import React, { useState } from 'react';
import TheatreAdmin from './TheatreAdmin';
import MovieAdmin from './MovieAdmin';

const AdminModule = () => {
  const [view, setView] = useState('theatres');

  return (
    <div style={styles.adminContainer}>
      <div style={styles.tabContainer}>
        <button onClick={() => setView('theatres')} style={view === 'theatres' ? styles.activeTab : styles.tab}>Theatres</button>
        <button onClick={() => setView('movies')} style={view === 'movies' ? styles.activeTab : styles.tab}>Movies</button>
      </div>

      <style>{`
        .screen-row .hover-actions { opacity: 0; transition: opacity 0.2s; }
        .screen-row:hover .hover-actions { opacity: 1; }
      `}</style>

      {view === 'theatres' ? <TheatreAdmin styles={styles} /> : <MovieAdmin styles={styles} />}
    </div>
  );
};

const styles = {
  adminContainer: { width: '100%', maxWidth: '1000px', margin: '0 auto', boxSizing: 'border-box' },
  // Fixed awkward scrolling for admin side by matching user side module limits
  moduleWrapper: { display: 'flex', minHeight: '600px', height: '75vh', maxHeight: '850px', background: '#111', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333' },
  columnStyle: { flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' },
  scrollContainer: { flex: 1, overflowY: 'auto', paddingRight: '10px' },
  flexColumn: { display: 'flex', flexDirection: 'column', height: '100%' },
  titleStyle: { marginTop: 0, color: '#fff', fontSize: '1.2rem', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '15px' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  cardStyle: { padding: '12px', marginBottom: '8px', cursor: 'pointer', borderRadius: '8px' },
  formStyle: { display: 'flex', flexDirection: 'column', gap: '10px' },
  inputStyle: { padding: '10px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', borderRadius: '6px' },
  submitBtn: { padding: '10px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  tabContainer: { display: 'flex', gap: '10px', marginBottom: '10px' },
  tab: { padding: '8px 16px', background: '#222', color: '#888', border: '1px solid #333', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem' },
  activeTab: { padding: '8px 16px', background: '#f3ce00', color: '#000', border: '1px solid #f3ce00', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold' },
  screenCard: { padding: '12px', background: '#1a1a1a', border: '1px solid #222', borderRadius: '6px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  actionGroup: { display: 'flex', gap: '8px' },
  editBtn: { padding: '4px 10px', background: '#2196f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' },
  deleteBtn: { padding: '4px 10px', background: '#f44336', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' },
  addScreenBtn: { width: '100%', padding: '10px', background: 'transparent', color: '#f3ce00', border: '1px dashed #f3ce00', borderRadius: '6px', cursor: 'pointer', marginTop: '10px' },
  backSmallBtn: { padding: '4px 8px', background: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalContent: { background: '#111', padding: '30px', borderRadius: '12px', border: '1px solid #333', width: '400px' },
};

export default AdminModule;