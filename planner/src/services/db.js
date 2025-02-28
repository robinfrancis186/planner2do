const DB_NAME = 'taskPlannerDB';
const DB_VERSION = 2;
const TASK_STORE = 'tasks';

class DatabaseService {
  constructor() {
    this.db = null;
    this.initPromise = null;
  }

  async deleteDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(DB_NAME);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async init() {
    if (this.initPromise) {
      return this.initPromise;
    }

    try {
      // Try to delete existing database first
      await this.deleteDatabase();
    } catch (error) {
      console.warn('Error deleting database:', error);
    }

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Delete old object store if it exists
        if (db.objectStoreNames.contains(TASK_STORE)) {
          db.deleteObjectStore(TASK_STORE);
        }

        // Create new object store with correct schema
        const store = db.createObjectStore(TASK_STORE, { keyPath: 'id' });
        
        // Add indexes
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('pageId', 'pageId', { unique: false });
        store.createIndex('priority', 'priority', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      };
    });

    return this.initPromise;
  }

  async ensureInitialized() {
    if (!this.db) {
      await this.init();
    }
  }

  async getAllTasks() {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([TASK_STORE], 'readonly');
      const store = transaction.objectStore(TASK_STORE);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  }

  async addTask(task) {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([TASK_STORE], 'readwrite');
      const store = transaction.objectStore(TASK_STORE);
      
      // Ensure task has all required fields with correct types
      const taskToAdd = {
        id: task.id || Date.now().toString(),
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'NotStarted',
        priority: task.priority || 'Medium',
        pageId: task.pageId || null,
        createdAt: task.createdAt || new Date().toISOString(),
        dueDate: task.dueDate || null,
        imageUrl: task.imageUrl || null,
        subtasks: Array.isArray(task.subtasks) ? task.subtasks : []
      };

      const request = store.add(taskToAdd);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(taskToAdd);
    });
  }

  async updateTask(task) {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([TASK_STORE], 'readwrite');
      const store = transaction.objectStore(TASK_STORE);

      // Ensure all required fields are present
      const taskToUpdate = {
        ...task,
        id: task.id,
        title: task.title || '',
        status: task.status || 'NotStarted',
        priority: task.priority || 'Medium',
        subtasks: Array.isArray(task.subtasks) ? task.subtasks : []
      };

      const request = store.put(taskToUpdate);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(taskToUpdate);
    });
  }

  async deleteTask(taskId) {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([TASK_STORE], 'readwrite');
      const store = transaction.objectStore(TASK_STORE);
      const request = store.delete(taskId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getTasksByStatus(status) {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([TASK_STORE], 'readonly');
      const store = transaction.objectStore(TASK_STORE);
      const index = store.index('status');
      const request = index.getAll(status);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  }

  async getTasksByPage(pageId) {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([TASK_STORE], 'readonly');
      const store = transaction.objectStore(TASK_STORE);
      const index = store.index('pageId');
      const request = index.getAll(pageId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || []);
    });
  }
}

const dbService = new DatabaseService();
export default dbService; 