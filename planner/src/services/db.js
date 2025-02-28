const DB_NAME = 'taskPlannerDB';
const DB_VERSION = 1;
const TASK_STORE = 'tasks';

class DatabaseService {
  constructor() {
    this.db = null;
    this.initPromise = null;
  }

  async init() {
    if (this.initPromise) {
      return this.initPromise;
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
        if (!db.objectStoreNames.contains(TASK_STORE)) {
          const store = db.createObjectStore(TASK_STORE, { keyPath: 'id' });
          store.createIndex('status', 'status', { unique: false });
          store.createIndex('pageId', 'pageId', { unique: false });
          store.createIndex('priority', 'priority', { unique: false });
        }
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
      request.onsuccess = () => resolve(request.result);
    });
  }

  async addTask(task) {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([TASK_STORE], 'readwrite');
      const store = transaction.objectStore(TASK_STORE);
      
      // Generate a unique ID if not provided
      if (!task.id) {
        task.id = Date.now().toString();
      }
      
      // Add createdAt if not present
      if (!task.createdAt) {
        task.createdAt = new Date().toISOString();
      }

      // Initialize empty subtasks array if not present
      if (!task.subtasks) {
        task.subtasks = [];
      }

      const request = store.add(task);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(task);
    });
  }

  async updateTask(task) {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([TASK_STORE], 'readwrite');
      const store = transaction.objectStore(TASK_STORE);
      const request = store.put(task);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(task);
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
      request.onsuccess = () => resolve(request.result);
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
      request.onsuccess = () => resolve(request.result);
    });
  }
}

const dbService = new DatabaseService();
export default dbService; 