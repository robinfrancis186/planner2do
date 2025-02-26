import React, { useState, useEffect, useRef } from 'react';
import { usePageContext } from '../context/PageContext';
import { IoIosArrowDown, IoMdAdd } from 'react-icons/io';
import { IoEllipsisVertical } from 'react-icons/io5';
import { FaSave } from 'react-icons/fa';

// Define styles as a separate object for better organization
const styles = {
  sidebar: {
    width: '250px',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minWidth: '250px',
    maxWidth: '250px'
  },
  sidebarHeader: {
    padding: '1.25rem 1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  sidebarTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: 0
  },
  sidebarContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem'
  },
  sidebarSection: {
    marginBottom: '1.5rem'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
    cursor: 'pointer'
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: 'bold',
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  sectionToggle: {
    fontSize: '1.25rem',
    fontWeight: 'bold'
  },
  sectionContent: {
    marginLeft: '0.5rem'
  },
  pageList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  pageItem: {
    marginBottom: '0.5rem'
  },
  pageEditContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  pageInput: {
    width: '100%',
    padding: '0.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '0.25rem',
    color: 'white',
    fontSize: '0.875rem'
  },
  buttonContainer: {
    display: 'flex',
    gap: '0.5rem'
  },
  primaryButton: {
    padding: '0.25rem 0.5rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '0.25rem',
    fontSize: '0.75rem',
    cursor: 'pointer'
  },
  secondaryButton: {
    padding: '0.25rem 0.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    border: 'none',
    borderRadius: '0.25rem',
    fontSize: '0.75rem',
    cursor: 'pointer'
  },
  pageItemContainer: (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem',
    borderRadius: '0.25rem',
    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background-color 0.2s'
  }),
  pageColor: (color) => ({
    display: 'inline-block',
    width: '0.75rem',
    height: '0.75rem',
    borderRadius: '50%',
    marginRight: '0.5rem',
    backgroundColor: color || '#3b82f6'
  }),
  pageName: {
    fontSize: '0.875rem',
    flex: 1
  },
  pageActions: (isVisible) => ({
    display: isVisible ? 'flex' : 'none',
    position: 'absolute',
    right: '0.5rem',
    gap: '0.25rem',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    padding: '0.25rem',
    borderRadius: '0.25rem',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
  }),
  actionButton: {
    backgroundColor: 'transparent',
    color: 'white',
    border: 'none',
    padding: '0.25rem',
    fontSize: '0.75rem',
    cursor: 'pointer'
  },
  deleteButton: {
    backgroundColor: 'transparent',
    color: '#ef4444',
    border: 'none',
    padding: '0.25rem',
    fontSize: '0.75rem',
    cursor: 'pointer'
  },
  addPageForm: {
    marginTop: '0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  addPageButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '0.5rem',
    marginTop: '0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    border: 'none',
    borderRadius: '0.25rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  settingsOption: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  settingsLabel: {
    fontSize: '0.875rem'
  },
  sidebarFooter: {
    padding: '1rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  userAvatar: {
    width: '2rem',
    height: '2rem',
    backgroundColor: '#3b82f6',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold'
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column'
  },
  userName: {
    fontSize: '0.875rem',
    fontWeight: 'bold'
  },
  userEmail: {
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.7)'
  }
};

const Sidebar = ({ onEfficiencyClick, onPageClick }) => {
  const { pages, selectedPage, setSelectedPage, addPage, deletePage, updatePage } = usePageContext();
  const [isAddingPage, setIsAddingPage] = useState(false);
  const [newPageName, setNewPageName] = useState('');
  const [editingPageId, setEditingPageId] = useState(null);
  const [editPageName, setEditPageName] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    pages: true,
    efficiency: false,
    settings: false
  });
  const [hoveredPageId, setHoveredPageId] = useState(null);
  const sidebarRef = useRef(null);

  // Force sidebar styling on mount
  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.style.cssText = `
        width: 250px !important;
        min-width: 250px !important;
        max-width: 250px !important;
        background-color: #0f172a !important;
        color: #f8fafc !important;
        display: flex !important;
        flex-direction: column !important;
        height: 100% !important;
      `;
    }
  }, []);

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const handleAddPage = () => {
    if (newPageName.trim()) {
      addPage(newPageName);
      setNewPageName('');
      setIsAddingPage(false);
    }
  };

  const handleEditPage = (pageId) => {
    const page = pages.find(p => p.id === pageId);
    if (page) {
      setEditingPageId(pageId);
      setEditPageName(page.name);
    }
  };

  const handleSaveEdit = () => {
    if (editPageName.trim()) {
      updatePage(editingPageId, { name: editPageName });
      setEditingPageId(null);
      setEditPageName('');
    }
  };

  const handleDeletePage = (pageId) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      deletePage(pageId);
    }
  };

  const handlePageClick = (page) => {
    setSelectedPage(page);
    if (onPageClick) onPageClick();
  };

  return (
    <div 
      ref={sidebarRef}
      className="sidebar"
      style={styles.sidebar}
    >
      <div className="sidebar-header">
        <h1 className="sidebar-title">TaskPlanner</h1>
      </div>

      <div className="sidebar-content">
        <div className="sidebar-section">
          <div 
            className="section-header"
            onClick={() => toggleSection('pages')}
          >
            <h2 className="section-title">Pages</h2>
            <span className="section-toggle">{expandedSections.pages ? '−' : '+'}</span>
          </div>
          
          {expandedSections.pages && (
            <div className="section-content">
              <ul className="page-list">
                {pages.map(page => (
                  <li key={page.id} className="page-item">
                    {editingPageId === page.id ? (
                      <div className="page-edit-container">
                        <input
                          type="text"
                          value={editPageName}
                          onChange={(e) => setEditPageName(e.target.value)}
                          className="page-input"
                          autoFocus
                        />
                        <div className="button-container">
                          <button 
                            onClick={handleSaveEdit}
                            className="primary-button"
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => setEditingPageId(null)}
                            className="secondary-button"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className={`page-item-container ${selectedPage && selectedPage.id === page.id ? 'active' : ''}`}
                        onClick={() => handlePageClick(page)}
                        onMouseEnter={() => setHoveredPageId(page.id)}
                        onMouseLeave={() => setHoveredPageId(null)}
                      >
                        <span 
                          className="page-color"
                          style={styles.pageColor(page.color)}
                        ></span>
                        <span className="page-name">{page.name}</span>
                        <div 
                          className="page-actions"
                          style={styles.pageActions(
                            hoveredPageId === page.id || (selectedPage && selectedPage.id === page.id)
                          )}
                        >
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditPage(page.id);
                            }}
                            className="action-button"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePage(page.id);
                            }}
                            className="delete-button"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              
              {isAddingPage ? (
                <div className="add-page-form">
                  <input
                    type="text"
                    value={newPageName}
                    onChange={(e) => setNewPageName(e.target.value)}
                    placeholder="Page name"
                    className="page-input"
                    autoFocus
                  />
                  <div className="button-container">
                    <button 
                      onClick={handleAddPage}
                      className="primary-button"
                    >
                      Add
                    </button>
                    <button 
                      onClick={() => setIsAddingPage(false)}
                      className="secondary-button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAddingPage(true)}
                  className="add-page-button"
                >
                  + Add Page
                </button>
              )}
            </div>
          )}
        </div>

        <div className="sidebar-section">
          <div 
            className="section-header"
            onClick={() => toggleSection('efficiency')}
          >
            <h2 className="section-title">Efficiency</h2>
            <span className="section-toggle">{expandedSections.efficiency ? '−' : '+'}</span>
          </div>
          
          {expandedSections.efficiency && (
            <div className="section-content">
              <div 
                className="page-item-container"
                onClick={onEfficiencyClick}
              >
                <span 
                  className="page-color"
                  style={{...styles.pageColor('#3b82f6'), backgroundColor: '#3b82f6'}}
                ></span>
                <span className="page-name">Efficiency Dashboard</span>
              </div>
              
              <div className="settings-option">
                <span className="settings-label">Current Month</span>
                <span style={{ fontSize: '0.75rem', color: '#3b82f6' }}>100%</span>
              </div>
              
              <div className="settings-option">
                <span className="settings-label">Tasks in Progress</span>
                <span style={{ fontSize: '0.75rem', color: '#3b82f6' }}>0</span>
              </div>
              
              <div className="settings-option">
                <span className="settings-label">Tasks Completed</span>
                <span style={{ fontSize: '0.75rem', color: '#22c55e' }}>0</span>
              </div>
            </div>
          )}
        </div>

        <div className="sidebar-section">
          <div 
            className="section-header"
            onClick={() => toggleSection('settings')}
          >
            <h2 className="section-title">Settings</h2>
            <span className="section-toggle">{expandedSections.settings ? '−' : '+'}</span>
          </div>
          
          {expandedSections.settings && (
            <div className="section-content">
              <div className="settings-option">
                <span className="settings-label">Dark Mode</span>
                <button className="secondary-button">
                  Toggle
                </button>
              </div>
              <div className="settings-option">
                <span className="settings-label">Notifications</span>
                <button className="secondary-button">
                  Toggle
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">U</div>
          <div className="user-details">
            <span className="user-name">User</span>
            <span className="user-email">user@example.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 