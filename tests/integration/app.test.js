/**
 * Integration tests for the AWS DevOps Demo application
 */

// Create a more complete DOM simulation
document.body.innerHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>AWS DevOps Demo App</title>
</head>
<body>
  <header>
    <nav>
      <div class="logo">
        <h1>AWS DevOps Demo</h1>
      </div>
      <ul class="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#pipeline">CI/CD Pipeline</a></li>
        <li><a href="#about">About</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <section id="home" class="hero">
      <div class="hero-content">
        <h1>AWS CI/CD Pipeline Demo</h1>
        <p>Version: <span id="app-version">1.0.1</span> | Build Date: <span id="build-date">May 12, 2025</span></p>
        <button class="cta-button" onclick="updateCounter()">Click Me!</button>
        <p>Button clicked <span id="counter">0</span> times</p>
      </div>
    </section>

    <section id="features" class="features">
      <h2>Key Features</h2>
    </section>

    <section id="pipeline" class="pipeline">
      <h2>CI/CD Pipeline Architecture</h2>
    </section>

    <section id="about" class="about">
      <h2>About This Project</h2>
    </section>
  </main>
</body>
</html>
`;

// Load the main.js code
require('../../js/main.js');

describe('Application User Flow', () => {
  beforeEach(() => {
    // Reset state for each test
    counter = 0;
    document.getElementById('counter').textContent = '0';
    localStorage.clear();
  });
  
  test('Application should initialize correctly on page load', () => {
    // Dispatch DOMContentLoaded event
    document.dispatchEvent(new Event('DOMContentLoaded'));
    
    // Fast-forward timers to trigger welcome message
    jest.advanceTimersByTime(1000);
    
    // Check console messages were logged
    expect(console.log).toHaveBeenCalledWith('Welcome to the AWS DevOps Demo Application!');
    expect(console.log).toHaveBeenCalledWith('This application demonstrates CI/CD pipelines with AWS CodePipeline.');
    
    // Version should be stored in localStorage
    expect(localStorage.getItem('appVersion')).toBe('1.0.1');
  });
  
  test('Click button interaction flow', () => {
    // Initialize the app
    initApp();
    
    // Get button element
    const button = document.querySelector('.cta-button');
    
    // Click the button 5 times
    for (let i = 0; i < 5; i++) {
      button.click();
    }
    
    // Check counter updated correctly
    expect(document.getElementById('counter').textContent).toBe('5');
    
    // Check alert was shown
    expect(alert).toHaveBeenCalledWith('You clicked 5 times! Keep going to test the application.');
  });
  
  test('User should be notified when app version changes', () => {
    // Set previous version in localStorage
    localStorage.setItem('appVersion', '1.0.0');
    
    // Initialize the app
    initApp();
    
    // Check alert was shown with version change message
    expect(alert).toHaveBeenCalledWith('Application updated! Previous version: 1.0.0, New version: 1.0.1');
  });
  
  test('Navigation should work correctly', () => {
    // Initialize the app
    initApp();
    
    // Set up element positions for testing
    document.getElementById('features').getBoundingClientRect = () => ({
      top: 500
    });
    
    // Click on a navigation link
    const featuresLink = document.querySelector('a[href="#features"]');
    featuresLink.click();
    
    // Check scrollTo was called correctly
    expect(scrollTo).toHaveBeenCalledWith({
      top: 420, // 500 - 80 offset
      behavior: 'smooth'
    });
  });
});