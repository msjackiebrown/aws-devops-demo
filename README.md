# AWS DevOps Demo Web Application

[![Build Status](https://codebuild.us-east-1.amazonaws.com/badges?uuid=example-badge-id)](https://github.com/msjackiebrown/aws-devops-demo)

> A demonstration web application showcasing AWS DevOps practices with comprehensive CI/CD pipeline integration using AWS CodePipeline, CodeBuild, and CodeDeploy. Features a complete testing suite with Jest for unit and integration testing.

---

## Project Details & Pipeline Overview

### Overview

This project demonstrates best practices in AWS DevOps implementation, providing a comprehensive example for the AWS DevOps Engineer Professional certification. It includes:

- Application components (frontend, testing framework)
- CI/CD components (configuration files, deployment strategies, notifications)

### Project Structure

```
aws-devops-demo/
├── index.html                 # Main HTML file
├── css/
│   └── styles.css             # CSS styles
├── js/
│   └── main.js                # JavaScript functionality
├── images/                    # Image assets
├── tests/                     # Testing directory
│   ├── unit/                  # Unit tests
│   ├── integration/           # Integration tests
│   └── coverage/              # Coverage tests
├── scripts/                   # Deployment scripts for CodeDeploy
├── buildspec.yml              # AWS CodeBuild configuration
├── testspec.yml               # AWS CodeBuild test configuration
├── appspec.yml                # AWS CodeDeploy configuration
├── infrastructure.yml         # Main CloudFormation template
└── docs/                      # Project documentation
```

<details>
  <summary><strong>🔍 View detailed project structure</strong></summary>

```
aws-devops-demo/
├── index.html                 # Main HTML file
├── css/
│   └── styles.css             # CSS styles
├── js/
│   └── main.js                # JavaScript functionality
├── images/                    # Image assets
├── tests/
│   ├── setup.js               # Testing environment configuration
│   ├── coverage.test.js       # Coverage testing utilities
│   ├── complete-coverage.test.js  # Comprehensive coverage tests
│   ├── direct-main.test.js    # Direct function testing
│   ├── mainjs-for-coverage.js # Prepared module for coverage
│   ├── unit/
│   │   └── main.test.js       # Unit tests for JavaScript functions
│   ├── integration/
│   │   ├── app.test.js        # Application flow integration tests
│   │   ├── deployment.test.js # Deployment integration tests
│   │   ├── html.test.js       # HTML structure tests
│   │   └── infrastructure.test.js # Infrastructure tests
│   └── coverage/              # Coverage instrumentation tests
├── scripts/                   # Deployment scripts for CodeDeploy
│   ├── before_install.sh      # Pre-installation setup
│   ├── after_install.sh       # Post-installation configuration
│   ├── start_application.sh   # Application startup
│   ├── stop_application.sh    # Application shutdown
│   ├── validate_service.sh    # Service validation
│   ├── setup-pipeline.ps1     # Pipeline setup automation
│   └── create-pipeline-notifications.ps1 # Notification setup
├── buildspec.yml              # AWS CodeBuild configuration
├── appspec.yml                # AWS CodeDeploy configuration
├── infrastructure.yml         # Main CloudFormation template
├── infrastructure-blue-green.yml # Blue-Green deployment template
├── jest.config.js             # Jest configuration
├── package.json               # Node.js package configuration
├── .gitignore                 # Git exclusion patterns
├── docs/
│   └── testing-pipeline.md    # Testing pipeline documentation
└── README.md                  # Project documentation
```
</details>

### CI/CD Pipeline Overview

This application demonstrates a modern CI/CD pipeline using AWS services with separate testing and building phases.  
**By default, the pipeline deploys to production using in-place deployment. Blue/Green deployment is available as an advanced, optional setup.**

```mermaid
graph LR
    A([GitHub Repository]):::source -->|Code Push| B([AWS CodePipeline]):::pipeline
    B --> C([Test Phase]):::test
    C -->|Run Tests| D([Test Reports]):::test
    D -->|Validation| E([Build Phase]):::build
    E -->|Build Artifacts| F([AWS CodeDeploy<br/>(In-Place)]):::deploy
    F --> G([Production Deployment]):::prod
    F -.-> H([Blue/Green Deployment<br/>(Optional)]):::optional

    classDef source fill:#f9f,stroke:#333,stroke-width:2;
    classDef pipeline fill:#bbf,stroke:#333,stroke-width:2;
    classDef test fill:#bfb,stroke:#333,stroke-width:2;
    classDef build fill:#ffb,stroke:#333,stroke-width:2;
    classDef deploy fill:#bdf,stroke:#333,stroke-width:2;
    classDef prod fill:#afa,stroke:#333,stroke-width:2;
    classDef optional fill:#eee,stroke:#333,stroke-width:2,stroke-dasharray: 5 5;
```

- **Solid arrows** show the default in-place deployment path.
- **Dashed arrow** shows Blue/Green as an optional, advanced path.

![AWS CI/CD Pipeline](https://mermaid.ink/img/pako:eNplkE1PwzAMhu_StQwQpK0wMUAcdsgh2lHdYYcJDRGRpCJplYHYu89pGYxpvdi__v-Pbfk83pQFWmCpylmmiYaXEqV-Zx_XWWJqfRBrXuhsxTfmHcX5R67WjCvBi7qyhYDQ1fygdgXslKbkBuVKfYIR5i4BkKWNsdT2uKJnZWK6MpHCBD1_NwSYm5EELcWPxYVZ5rngr6_WNB2HkNrY0mXCXxQFQT6A18MAvfGVxiNZzn7xvGkGcZzEX-36EDQS43iU9MfJtM3vV-N0PJzOejMHI4i5RmsxoFNbLtFDODn-J7lJFoXP9_ALxR5HRw?type=png)

> **Note:** For most demos and cost-effective setups, use in-place deployment. Blue/Green deployment is available for advanced, zero-downtime scenarios—see the [Manual Pipeline Setup Guide](docs/manual-pipeline-setup.md) for details.

For full details on pipeline stages, features, and AWS DevOps certification topics, see this file and the [Manual Pipeline Setup Guide](docs/manual-pipeline-setup.md).

---

## Table of Contents
- [Manual Pipeline Setup Guide](docs/manual-pipeline-setup.md)
- [Testing Pipeline Details](docs/testing-pipeline.md)

---

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/aws-devops-demo.git
cd aws-devops-demo

# Install dependencies
npm install
```

## Usage

- See the Project Details & Pipeline Overview above for architecture, features, and pipeline stages.
- For AWS deployment and CI/CD setup, follow the [Manual Pipeline Setup Guide](docs/manual-pipeline-setup.md).
- To run the app locally, open `index.html` in your browser.

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage
```

See [Testing Pipeline Details](docs/testing-pipeline.md) for more info.

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements.

## License

This project is open-source and available for educational purposes under the MIT license.

---

For full documentation, see the [docs](docs/) folder.