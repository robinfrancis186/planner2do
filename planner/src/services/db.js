const DB_NAME = 'taskPlannerDB';
const DB_VERSION = 1;
const TASK_STORE = 'tasks';

class DatabaseService {
  constructor() {
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
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
          store.createIndex('priority', 'priority', { unique: false });
        }
      };
    });
  }

  async getAllTasks() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([TASK_STORE], 'readonly');
      const store = transaction.objectStore(TASK_STORE);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async addTask(task) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([TASK_STORE], 'readwrite');
      const store = transaction.objectStore(TASK_STORE);
      const request = store.add(task);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async updateTask(task) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([TASK_STORE], 'readwrite');
      const store = transaction.objectStore(TASK_STORE);
      const request = store.put(task);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async deleteTask(taskId) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([TASK_STORE], 'readwrite');
      const store = transaction.objectStore(TASK_STORE);
      const request = store.delete(taskId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getTasksByStatus(status) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([TASK_STORE], 'readonly');
      const store = transaction.objectStore(TASK_STORE);
      const index = store.index('status');
      const request = index.getAll(status);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }
}

const dbService = new DatabaseService();
export default dbService; 