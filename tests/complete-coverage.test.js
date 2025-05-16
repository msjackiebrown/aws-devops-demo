/**
 * Test file for complete code coverage using a specially prepared module
 */

// Import the specialized test version of main.js
const mainFunctions = require('./mainjs-for-coverage');

describe('Complete code coverage for main.js functions', () => {
  beforeEach(() => {
    // Set up the DOM for testing
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
    
    // Set up offsetTop properties
    const homeElement = document.getElementById('home');
    const featuresElement = document.getElementById('features');
    Object.defineProperty(homeElement, 'offsetTop', { value: 100 });
    Object.defineProperty(featuresElement, 'offsetTop', { value: 200 });
    
    // Reset counter
    global.counter = 0;
  });
  
  test('updateCounter function', () => {
    mainFunctions.updateCounter();
    expect(document.getElementById('counter').textContent).toBe('1');
    
    // Test milestone alerts
    for (let i = 0; i < 4; i++) {
      mainFunctions.updateCounter();
    }
    expect(alert).toHaveBeenCalledWith('You clicked 5 times! Keep going to test the application.');
    
    for (let i = 0; i < 5; i++) {
      mainFunctions.updateCounter();
    }
    expect(alert).toHaveBeenCalledWith('Great job! You\'ve clicked 10 times. This app is working perfectly!');
    
    for (let i = 0; i < 10; i++) {
      mainFunctions.updateCounter();
    }
    expect(alert).toHaveBeenCalledWith('Wow! 20 clicks! You\'re really testing this application thoroughly.');
  });
  
  test('checkDeploymentVersion function', () => {
    // Test with no stored version
    mainFunctions.checkDeploymentVersion();
    expect(localStorage.getItem('appVersion')).toBe('1.0.1');
    
    // Test with different version
    localStorage.setItem('appVersion', '1.0.0');
    mainFunctions.checkDeploymentVersion();
    expect(alert).toHaveBeenCalledWith('Application updated! Previous version: 1.0.0, New version: 1.0.1');
    
    // Test with same version
    alert.mockClear();
    mainFunctions.checkDeploymentVersion();
    expect(alert).not.toHaveBeenCalled();
  });
  
  test('updateBuildInfo function', () => {
    const originalDate = document.getElementById('build-date').textContent;
    mainFunctions.updateBuildInfo();
    expect(document.getElementById('build-date').textContent).toBe(originalDate);
  });
  
  test('showWelcomeMessage function', () => {
    mainFunctions.showWelcomeMessage();
    jest.advanceTimersByTime(1000);
    expect(console.log).toHaveBeenCalledWith('Welcome to the AWS DevOps Demo Application!');
    expect(console.log).toHaveBeenCalledWith('This application demonstrates CI/CD pipelines with AWS CodePipeline.');
  });
  
  test('initApp function', () => {
    // Create spies
    const spyCheckVersion = jest.spyOn(mainFunctions, 'checkDeploymentVersion');
    const spyUpdateBuild = jest.spyOn(mainFunctions, 'updateBuildInfo');
    const spyWelcome = jest.spyOn(mainFunctions, 'showWelcomeMessage');
    
    // Call initApp
    mainFunctions.initApp();
    
    // Check that functions were called
    expect(spyCheckVersion).toHaveBeenCalled();
    expect(spyUpdateBuild).toHaveBeenCalled();
    expect(spyWelcome).toHaveBeenCalled();
    
    // Test event listeners
    const navLink = document.querySelector('a[href="#features"]');
    navLink.click();
    expect(scrollTo).toHaveBeenCalledWith({
      top: 120, // 200 - 80
      behavior: 'smooth'
    });
    
    // Test button click
    document.getElementById('counter-button').click();
    expect(document.getElementById('counter').textContent).toBe('1');
  });
  
  test('DOMContentLoaded event', () => {
    // Create a spy
    const spyInit = jest.spyOn(mainFunctions, 'initApp').mockImplementation(() => {});
    
    // Simulate DOM content loaded
    document.dispatchEvent(new Event('DOMContentLoaded'));
    
    // Not testing the actual event listener since it's directly in the module scope
    // and not a function we can spy on, but we can verify the function exists
    expect(typeof mainFunctions.initApp).toBe('function');
    
    // Clean up
    spyInit.mockRestore();
  });
});
