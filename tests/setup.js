// Setup file for Jest tests

// Mock localStorage
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  clear() {
    this.store = {};
  }

  removeItem(key) {
    delete this.store[key];
  }
}

// Create mock for localStorage
global.localStorage = new LocalStorageMock();

// Mock alert
global.alert = jest.fn();

// Mock console.log
global.console.log = jest.fn();

// Mock window.scrollTo
global.scrollTo = jest.fn();

// Set up fake timers
jest.useFakeTimers();

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

// Clean up after tests
afterEach(() => {
  // Clean up any mocks
});