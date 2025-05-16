/**
 * Unit tests for main.js
 */

// Set up the DOM elements needed for the tests
document.body.innerHTML = `
<div id="app-version">1.0.1</div>
<div id="build-date">May 12, 2023</div>
<div id="counter">0</div>
<nav>
  <a href="#home">Home</a>
  <a href="#features">Features</a>
  <a href="#pipeline">Pipeline</a>
</nav>
<div id="home" style="position: absolute; top: 100px;"></div>
<div id="features" style="position: absolute; top: 200px;"></div>
<div id="pipeline" style="position: absolute; top: 300px;"></div>
`;

// Load the JavaScript code to test
require('../../js/main.js');

describe('Counter Functionality', () => {
  test('updateCounter should increment the counter', () => {
    // Initial state
    expect(document.getElementById('counter').textContent).toBe('0');
    
    // Call the function
    updateCounter();
    
    // Check the updated state
    expect(document.getElementById('counter').textContent).toBe('1');
  });
  
  test('updateCounter should show appropriate alerts at milestone clicks', () => {
    // Reset counter for this test
    counter = 0;
    document.getElementById('counter').textContent = '0';
    
    // Click 4 times (no alert yet)
    for (let i = 0; i < 4; i++) {
      updateCounter();
    }
    expect(alert).not.toHaveBeenCalled();
    
    // 5th click should trigger first alert
    updateCounter();
    expect(alert).toHaveBeenCalledWith('You clicked 5 times! Keep going to test the application.');
    alert.mockClear();
    
    // Click to 10
    for (let i = 0; i < 4; i++) {
      updateCounter();
    }
    expect(alert).toHaveBeenCalledWith('Great job! You\'ve clicked 10 times. This app is working perfectly!');
    alert.mockClear();
    
    // Click to 20
    for (let i = 0; i < 9; i++) {
      updateCounter();
    }
    expect(alert).toHaveBeenCalledWith('Wow! 20 clicks! You\'re really testing this application thoroughly.');
  });
});

describe('Version Management', () => {
  test('checkDeploymentVersion should save current version to localStorage', () => {
    // Call the function
    checkDeploymentVersion();
    
    // Check that the current version was saved
    expect(localStorage.getItem('appVersion')).toBe('1.0.1');
  });
  
  test('checkDeploymentVersion should alert when version changes', () => {
    // Set up previous version
    localStorage.setItem('appVersion', '1.0.0');
    
    // Call the function
    checkDeploymentVersion();
    
    // Check that alert was shown
    expect(alert).toHaveBeenCalledWith('Application updated! Previous version: 1.0.0, New version: 1.0.1');
  });
  
  test('checkDeploymentVersion should not alert for same version', () => {
    // Set up same version
    localStorage.setItem('appVersion', '1.0.1');
    
    // Call the function
    checkDeploymentVersion();
    
    // Check that no alert was shown
    expect(alert).not.toHaveBeenCalled();
  });
});

describe('Build Information', () => {
  test('updateBuildInfo should not modify build date (handled by CI/CD)', () => {
    const originalDate = document.getElementById('build-date').textContent;
    
    // Call the function
    updateBuildInfo();
    
    // Check that date wasn't changed
    expect(document.getElementById('build-date').textContent).toBe(originalDate);
  });
});

describe('Welcome Message', () => {
  test('showWelcomeMessage should log welcome messages after a delay', () => {
    // Call the function
    showWelcomeMessage();
    
    // Verify that nothing is logged yet
    expect(console.log).not.toHaveBeenCalled();
    
    // Fast-forward time
    jest.advanceTimersByTime(1000);
    
    // Now messages should be logged
    expect(console.log).toHaveBeenCalledWith('Welcome to the AWS DevOps Demo Application!');
    expect(console.log).toHaveBeenCalledWith('This application demonstrates CI/CD pipelines with AWS CodePipeline.');
  });
});

describe('Navigation', () => {
  test('clicking nav links should scroll to the target element', () => {
    // Call initApp to set up event listeners
    initApp();
    
    // Get a nav link
    const featuresLink = document.querySelector('a[href="#features"]');
    
    // Simulate click
    featuresLink.click();
    
    // Check that scrollTo was called correctly
    expect(scrollTo).toHaveBeenCalledWith({
      top: 120, // 200 (element top) - 80 (offset)
      behavior: 'smooth'
    });
  });
});

describe('Application Initialization', () => {
  test('initApp should call all required initialization functions', () => {
    // Spy on the functions
    const checkVersionSpy = jest.spyOn(global, 'checkDeploymentVersion');
    const updateBuildSpy = jest.spyOn(global, 'updateBuildInfo');
    const welcomeSpy = jest.spyOn(global, 'showWelcomeMessage');
    
    // Call initApp
    initApp();
    
    // Check that all functions were called
    expect(checkVersionSpy).toHaveBeenCalled();
    expect(updateBuildSpy).toHaveBeenCalled();
    expect(welcomeSpy).toHaveBeenCalled();
    
    // Clean up spies
    checkVersionSpy.mockRestore();
    updateBuildSpy.mockRestore();
    welcomeSpy.mockRestore();
  });
  
  test('DOMContentLoaded event should trigger initApp', () => {
    // Spy on initApp
    const initSpy = jest.spyOn(global, 'initApp');
    
    // Simulate DOMContentLoaded event
    document.dispatchEvent(new Event('DOMContentLoaded'));
    
    // Check that initApp was called
    expect(initSpy).toHaveBeenCalled();
    
    // Clean up spy
    initSpy.mockRestore();
  });
});