# Angular Project - Hero manager app

Welcome to the Hero manager app project, built with Angular CLI version 16.2.2.

## Getting Started

### Prerequisites

Make sure you have Node.js installed along with Angular version 16.2.2.

### Installing Local Packages

After downloading the repository, follow these steps to install the necessary packages locally:

1. Open your terminal and navigate to the project's root directory.
2. Run the following command to install Node.js packages specified in the `package.json` file:

   ```
   npm install
   ```

   This command will download and install all the dependencies required for the project.

3. Once the installation is complete, you are ready to start working with the project locally.

### Local Environment Setup

1. Create a local environment file named "environment.dev.ts" to configure your variables. You can use "environment.example.ts" as a guide.
2. Open your terminal and run the following command:
   ```
   npm start
   ```
3. Explore additional scripts in the `package.json` file for more functionalities.

### Development Server

Run the following command to start a development server:

```
ng serve
```

Navigate to http://localhost:4200/ in your browser. The application will automatically reload upon changes to the source files.

### Code Generation

Use the Angular CLI to generate components, directives, pipes, services, classes, guards, interfaces, enums, or modules:

```
ng generate component component-name
```

### Build

Run the following command to build the project:

```
ng build
```

The build artifacts will be stored in the dist/ directory.

### Running Unit Tests

- Execute unit tests using Karma:

```
ng test

```

```
ng e2e
```

Note: Make sure to add a package that implements end-to-end testing capabilities before using this command.

### Additional Information

- Styling
- In the styles.scss file, you can find color variables that are available for the entire project.

### Best Practices

- We highly recommend following clean code practices, including clear variable names, well-structured methods, and thoughtful data mapping.

### Need Help?

- For more assistance with the Angular CLI, use the following command:

```
ng help
```

You can also refer to the Angular CLI Overview and Command Reference page.

Feel free to customize this README to include any additional information specific to your project. Happy coding!

### Run application locally using Docker

- Execute the following commands:

```
docker build -t heroesmanagerapp .
docker run -p 4200:80 heroesmanagerapp
```

Navigate to http://localhost:4200/ in your browser.

### View app on web

Navigate to https://heroes-manager-app.netlify.app in your browser.
