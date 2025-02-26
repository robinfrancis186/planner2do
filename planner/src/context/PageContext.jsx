import { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const PageContext = createContext();

// Custom hook to use the context
export const usePageContext = () => useContext(PageContext);

// Provider component
export const PageProvider = ({ children }) => {
  // State for pages (boards)
  const [pages, setPages] = useState(() => {
    const savedPages = localStorage.getItem('pages');
    return savedPages ? JSON.parse(savedPages) : [
      { id: '1', name: 'My Tasks', color: '#3b82f6' }
    ];
  });
  
  // State for selected page
  const [selectedPage, setSelectedPage] = useState(null);
  
  // Initialize selected page
  useEffect(() => {
    if (pages.length > 0 && !selectedPage) {
      setSelectedPage(pages[0]);
    }
  }, [pages, selectedPage]);

  // Save to localStorage whenever pages change
  useEffect(() => {
    localStorage.setItem('pages', JSON.stringify(pages));
  }, [pages]);

  // Function to add a new page
  const addPage = (name) => {
    const colors = [
      '#ef4444', // red
      '#3b82f6', // blue
      '#10b981', // green
      '#f59e0b', // yellow
      '#6366f1', // indigo
      '#8b5cf6', // purple
      '#ec4899', // pink
    ];
    
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newPage = {
      id: Date.now().toString(),
      name,
      color: randomColor,
    };
    
    setPages([...pages, newPage]);
    return newPage;
  };

  // Function to delete a page
  const deletePage = (pageId) => {
    const updatedPages = pages.filter(page => page.id !== pageId);
    setPages(updatedPages);
    
    // If the deleted page was selected, select the first available page
    if (selectedPage && selectedPage.id === pageId) {
      setSelectedPage(updatedPages.length > 0 ? updatedPages[0] : null);
    }
  };

  // Function to edit a page name
  const updatePage = (pageId, updates) => {
    const updatedPages = pages.map(page => 
      page.id === pageId ? { ...page, ...updates } : page
    );
    setPages(updatedPages);
    
    // Update selected page if it was the one edited
    if (selectedPage && selectedPage.id === pageId) {
      setSelectedPage({ ...selectedPage, ...updates });
    }
  };

  // Value to be provided by the context
  const value = {
    pages,
    selectedPage,
    setSelectedPage,
    addPage,
    deletePage,
    updatePage,
  };

  return (
    <PageContext.Provider value={value}>
      {children}
    </PageContext.Provider>
  );
};

export default PageContext; 