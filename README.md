# UMass-Campus-Navigator

UMass Campus Navigator is a web-based application designed to help newcomers to the University of Massachusetts Amherst navigate the campus efficiently. By uploading (or manually inputting) their weekly class schedule, students can generate an optimized walking route from their dormitory to all of their classes for a given day. The system focuses on providing clear, efficient paths to help students learn the campus layout, minimize walking time between classes, and reduce the stress of finding their way in a new environment.

# Features

- User Account Management: The application will be account-based, allowing students to log in to see saved schedules and routes.
- Schedule Management: Users can upload or manually input their schedules
- Multi-Stop Routes: Routes can have a number of stops, as well as including an estimated walking time.
- Interactive Map: Routes are displayed on a clear, interactive map of the UMass campus

# Structure
UMass Campus Navigator is a React-based project. As such, it requires both Node.js (created with v20.11.0) and npm (created with v10.2.4)
It uses a [CHOOSE BACKEND LATER] backend

The file structure is as follows:

node_modules/.. # local folder - dependencies are put here upon running `npm install`


public/........ # contains public files such as logos or downloadables


src/........... # contains most of the code for the project, contains:

|

+-- api/.......... # api files, links frontend to database

|

+-- components/... # shared components used across the entire application

|

+-- config/....... # global configurations, exported env variables etc.

|

+-- models/....... # object models and/or interfaces

|

+-- pages/........ # individual web pages in the app, containing a folder for each page

|

+-- testing/.....  # test utilities and functions



## Pages

Each webpage's folder (within /pages/) has two files:
- index.tsx               # the page's source code
- [pagename].module.scss       # the styling for the page

The name of the folder will be the URL extension used to access that page
- If the folder is called `login`, the page will be hosted at `localhost:3000/login`
- Nesting pages works intuitively


## Running the Project ##
- First, ensure you have npm and node installed
- Run `npm install` to install dependencies
- [STEP TO START DB]
- Run `npm start` to run the app in development mode at localhost:3000

## Running Tests ##
- `npm test` launches the test runner in the interactive watch mode
   - See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
