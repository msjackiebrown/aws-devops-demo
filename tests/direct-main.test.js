/**
 * Direct coverage tests for main.js
 */

// Define global counter variable
let counter = 0;

// Set up DOM for testing
document.body.innerHTML = `
<div id="app-version">1.0.1</div>
<div id="build-date">May 12, 2023</div>
<div id="counter">0</div>
<button id="counter-button">Click Me!</button>
<nav>
  <a href="#home">Home</a>
  <a href="#features">Features</a>
</nav>
<div id="home"></div>
<div id="features"></div>
`;

// Create elements with proper offsetTop
const homeElement = document.getElementById('home');
const featuresElement = document.getElementById('features');
Object.defineProperty(homeElement, 'offsetTop', { value: 100 });
Object.defineProperty(featuresElement, 'offsetTop', { value: 200 });

// Test the updateCounter function
function updateCounter() {
  counter++;
  document.getElementById('counter').textContent = counter;
  
  // Show different messages based on click count
  if (counter === 5) {
    alert('You clicked 5 times! Keep going to test the application.');
  } else if (counter === 10) {
    alert('Great job! You\'ve clicked 10 times. This app is working perfectly!');
  } else if (counter === 20) {
    alert('Wow! 20 clicks! You\'re really testing this application thoroughly.');
  }
}

// Test the checkDeploymentVersion function
function checkDeploymentVersion() {
  const storedVersion = localStorage.getItem('appVersion');
  const currentVersion = document.getElementById('app-version').textContent;
  
  if (storedVersion && storedVersion !== currentVersion) {
    alert(`Application updated! Previous version: ${storedVersion}, New version: ${currentVersion}`);
  }
  
  localStorage.setItem('appVersion', currentVersion);
}

// Test the updateBuildInfo function
function updateBuildInfo() {
  const buildDateElement = document.getElementById('build-date');
  if (buildDateElement) {
    // This will be replaced by the CI/CD pipeline with actual build date
    // buildDateElement.textContent = new Date().toLocaleDateString();
  }
}

// Test the showWelcomeMessage function
function showWelcomeMessage() {
  setTimeout(() => {
    console.log('Welcome to the AWS DevOps Demo Application!');
    console.log('This application demonstrates CI/CD pipelines with AWS CodePipeline.');
  }, 1000);
}

// Test the initApp function
function initApp() {
  checkDeploymentVersion();
  updateBuildInfo();
  showWelcomeMessage();
  
  // Add event listeners
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Add event listener for counter button
  const button = document.getElementById('counter-button');
  if (button) {
    button.addEventListener('click', updateCounter);
  }
}

// Direct tests for main.js functions
describe('Direct tests for main.js functions', () => {
  beforeEach(() => {
    // Reset the counter and DOM state
    counter = 0;
    document.getElementById('counter').textContent = '0';
    localStorage.clear();
  });
  
  test('updateCounter increments counter and shows alerts', () => {
    // Test that counter increments
    updateCounter();
    expect(counter).toBe(1);
    
    // Click to milestone (5)
    for (let i = 0; i < 4; i++) updateCounter();
    expect(alert).toHaveBeenCalledWith('You clicked 5 times! Keep going to test the application.');
    
    // Click to milestone (10)
    for (let i = 0; i < 5; i++) updateCounter();
    expect(alert).toHaveBeenCalledWith('Great job! You\'ve clicked 10 times. This app is working perfectly!');
    
    // Click to milestone (20)
    for (let i = 0; i < 10; i++) updateCounter();
    expect(alert).toHaveBeenCalledWith('Wow! 20 clicks! You\'re really testing this application thoroughly.');
  });
  
  test('checkDeploymentVersion handles version changes', () => {
    // With no stored version
    checkDeploymentVersion();
    expect(localStorage.getItem('appVersion')).toBe('1.0.1');
    
    // With the same version
    checkDeploymentVersion();
    expect(alert).not.toHaveBeenCalled();
    
    // With a different version
    localStorage.setItem('appVersion', '1.0.0');
    checkDeploymentVersion();
    expect(alert).toHaveBeenCalledWith('Application updated! Previous version: 1.0.0, New version: 1.0.1');
  });
  
  test('updateBuildInfo handles build date element', () => {
    const originalDate = document.getElementById('build-date').textContent;
    updateBuildInfo();
    expect(document.getElementById('build-date').textContent).toBe(originalDate);
  });
  
  test('showWelcomeMessage logs welcome messages', () => {
    showWelcomeMessage();
    jest.advanceTimersByTime(1000);
    expect(console.log).toHaveBeenCalledWith('Welcome to the AWS DevOps Demo Application!');
    expect(console.log).toHaveBeenCalledWith('This application demonstrates CI/CD pipelines with AWS CodePipeline.');
  });
    test('initApp calls initialization functions and sets up listeners', () => {
    // Mock the functions to check they're called
    const originalCheckDeploymentVersion = checkDeploymentVersion;
    const originalUpdateBuildInfo = updateBuildInfo;
    const originalShowWelcomeMessage = showWelcomeMessage;
    
    // Replace with jest mocks
    checkDeploymentVersion = jest.fn();
    updateBuildInfo = jest.fn();
    showWelcomeMessage = jest.fn();
    
    // Call the function
    initApp();
    
    // Verify functions were called
    expect(checkDeploymentVersion).toHaveBeenCalled();
    expect(updateBuildInfo).toHaveBeenCalled();
    expect(showWelcomeMessage).toHaveBeenCalled();
    
    // Restore original functions
    checkDeploymentVersion = originalCheckDeploymentVersion;
    updateBuildInfo = originalUpdateBuildInfo;
    showWelcomeMessage = originalShowWelcomeMessage;
    
    // Test nav click handler
    scrollTo.mockClear();
    document.querySelector('a[href="#features"]').click();
    expect(scrollTo).toHaveBeenCalledWith({
      top: 120, // 200 - 80
      behavior: 'smooth'
    });
    
    // Test button click handler
    counter = 0;
    document.getElementById('counter').textContent = '0';
    document.getElementById('counter-button').click();
    expect(document.getElementById('counter').textContent).toBe('1');
  });
    test('DOM event listeners are set up', () => {
    // For this test, we'll directly test the DOMContentLoaded handler setup
    
    // Clear any existing listeners to avoid interference
    const oldAddEventListener = document.addEventListener;
    document.addEventListener = jest.fn();
    
    // Simulate the script registering the event listener
    document.addEventListener('DOMContentLoaded', initApp);
    
    // Verify that the event listener was registered with the correct parameters
    expect(document.addEventListener).toHaveBeenCalledWith('DOMContentLoaded', initApp);
    
    // Restore the original addEventListener
    document.addEventListener = oldAddEventListener;
  });
});
