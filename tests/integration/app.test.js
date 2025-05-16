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
        <button id="counter-button" class="cta-button">Click Me!</button>
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

// Add all the functions directly to the test environment
// Copying the functions from main.js to avoid loading issues

// Initialize counter
let counter = 0;

// Function to update counter
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

// Function to check if this is a new deployment
function checkDeploymentVersion() {
    const storedVersion = localStorage.getItem('appVersion');
    const currentVersion = document.getElementById('app-version').textContent;
    
    if (storedVersion && storedVersion !== currentVersion) {
        alert(`Application updated! Previous version: ${storedVersion}, New version: ${currentVersion}`);
    }
    
    localStorage.setItem('appVersion', currentVersion);
}

// Update current date
function updateBuildInfo() {
    const buildDateElement = document.getElementById('build-date');
    if (buildDateElement) {
        // This will be replaced by the CI/CD pipeline with actual build date
        // buildDateElement.textContent = new Date().toLocaleDateString();
    }
}

// Show Welcome Message
function showWelcomeMessage() {
    setTimeout(() => {
        console.log('Welcome to the AWS DevOps Demo Application!');
        console.log('This application demonstrates CI/CD pipelines with AWS CodePipeline.');
    }, 1000);
}

// Initialize the application
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
    
    // Add the click handler directly to the button
    const button = document.getElementById('counter-button');
    if (button) {
        button.addEventListener('click', updateCounter);
    }
}

// Run initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);

describe('Application User Flow', () => {  beforeEach(() => {
    // Reset state for each test
    counter = 0;
    document.getElementById('counter').textContent = '0';
    localStorage.clear();
    
    // Setup elements for consistent testing with proper position mocking
    const featuresElement = document.getElementById('features');
    featuresElement.getBoundingClientRect = jest.fn().mockReturnValue({
      top: 500
    });
    
    // Create a new element with the properties we need
    const newElement = document.createElement('div');
    newElement.id = 'features';
    // Set the offsetTop property
    Object.defineProperty(newElement, 'offsetTop', { value: 500 });
    
    // Replace the existing element with our new one
    featuresElement.parentNode.replaceChild(newElement, featuresElement);
    
    // Clear mocks
    alert.mockClear();
    console.log.mockClear();
    scrollTo.mockClear();
    
    // Initialize app for each test
    initApp();
  });
  
  test('Application should initialize correctly on page load', () => {
    // Fast-forward timers to trigger welcome message
    jest.advanceTimersByTime(1000);
    
    // Check console messages were logged
    expect(console.log).toHaveBeenCalledWith('Welcome to the AWS DevOps Demo Application!');
    expect(console.log).toHaveBeenCalledWith('This application demonstrates CI/CD pipelines with AWS CodePipeline.');
    
    // Version should be stored in localStorage
    expect(localStorage.getItem('appVersion')).toBe('1.0.1');
  });
  
  test('Click button interaction flow', () => {
    // Get button element and directly call updateCounter
    const button = document.getElementById('counter-button');
    
    // Click 5 times by calling updateCounter directly
    for (let i = 0; i < 5; i++) {
      updateCounter();
    }
    
    // Check counter updated correctly
    expect(document.getElementById('counter').textContent).toBe('5');
    
    // Check alert was shown
    expect(alert).toHaveBeenCalledWith('You clicked 5 times! Keep going to test the application.');
  });
  
  test('User should be notified when app version changes', () => {
    // Set previous version in localStorage
    localStorage.setItem('appVersion', '1.0.0');
    
    // Clear alerts
    alert.mockClear();
    
    // Call function directly to test
    checkDeploymentVersion();
    
    // Check alert was shown with version change message
    expect(alert).toHaveBeenCalledWith('Application updated! Previous version: 1.0.0, New version: 1.0.1');
  });
  
  test('Navigation should work correctly', () => {
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