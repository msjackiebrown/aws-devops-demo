// Main JavaScript file for the AWS DevOps Demo application

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
}

// Run initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initApp);
