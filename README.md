# UMass-Campus-Navigator

UMass Campus Navigator is a web-based application designed to help newcomers to the University of Massachusetts Amherst navigate the campus efficiently. By uploading (or manually inputting) their weekly class schedule, students can generate an optimized walking route from their dormitory to all of their classes for a given day. The system focuses on providing clear, efficient paths to help students learn the campus layout, minimize walking time between classes, and reduce the stress of finding their way in a new environment.

# Features

- User Account Management: The application will be account-based, allowing students to log in to see saved schedules and routes.
- Route Management: Users can create and save routes, which can easily be retrieved, modified, and displayed on the map.
- Schedule Management: Users can manually input their schedules.
- Multi-Stop Routes: Routes can have a number of stops, as well as including an estimated walking time.
- Interactive Map: Routes are displayed on a clear, interactive map of the UMass campus.

# Structure
UMass Campus Navigator is a React-based project. As such, it requires both Node.js (created with v20.11.0) and npm (created with v10.2.4)
It uses a Node.js/Express backend with MySQL database

The file structure is as follows:

node_modules/.. # local folder - dependencies are put here upon running `npm install`


public/........ # contains public files such as logos or downloadables


src/........... # contains most of the code for the project, contains:

|

+-- components/... # shared components used across the entire application

|

+-- config/....... # global configurations, exported env variables etc.

|

+-- context/...... # React context providers (AuthContext for authentication)

|

+-- models/....... # object models and/or interfaces

|

+-- pages/........ # individual web pages in the app, containing a folder for each page

|

+-- testing/.....  # test utilities and functions


server/........ # Node.js backend server

|

+-- config/....... # database connection

|

+-- routes/....... # API route definitions

|

+-- database/..... # SQL schema and seed data files



## Pages

Each webpage's folder (within /pages/) has two files:
- index.tsx................... # the page's source code
- [pagename].module.scss...... # the styling for the page

The name of the folder should be the URL extension used to access that page
- If the folder is called `login`, the page should be hosted at `localhost:3000/login`
- When you add a new page, make sure to add its export - and the proper route - to `pages/index.tsx`
- You probably want to add a link to the page in the navbar as well


## Running the Project ##
- First, ensure you have Node.js (includes npm) and MySQL installed
  - For MySQL: Download from https://dev.mysql.com/downloads/installer/ and choose Developer Default install type
- Clone the repository and navigate to the project directory
- Run `npm install` to install dependencies (might need to include --legacy-peer-deps)
- Run `npm run setup-db` to create the database and add sample data (only need to run this once)
- Run `npm run dev` to run both frontend and backend together
  - Frontend runs at `http://localhost:3000`
  - Backend API runs at `http://localhost:5000`
- Alternatively: `npm start` for frontend only, or `npm run server` for backend only

### Connecting to Google Maps API
You will need to create a .env.local file in the root folder. This file should contain the following:
REACT_APP_API_KEY = "YOUR_KEY"
For the mapping to work properly, YOUR_KEY must be a valid Google Maps API key with the following APIs enabled:
- Maps Embed API
- Maps JavaScript API
- Maps Static API
- Navigation SDK
- Routes API
- Places API
- Directions API
- Geolocation API

### Test Login Credentials
After running `npm run setup-db`, use these credentials to login:
- **Email**: `test@umass.edu`
- **Password**: `test`

### Authentication Flow
1. Visit `localhost:3000` → automatically redirected to `/account` (login page)
2. Login with test credentials or register a new account
3. After login, you'll have access to all features:
   - Homepage with interactive map
   - Schedule builder for creating routes
   - Account page to view profile and logout
4. Session persists across page refreshes (stored in localStorage)

## API Documentation ##

### Base URL
- Backend runs at `http://localhost:5000`
- All endpoints are prefixed with `/api`

### Endpoints

#### Authentication
```
POST   /api/users/login        Login with email and password
                                Request: { email, password }
                                Response: { user: { id, name, email } }

POST   /api/users/register     Register a new user account
                                Request: { name, email, password }
                                Response: { user: { id, name, email } }
```

#### Users
```
GET    /api/users              Get all users
GET    /api/users/:id          Get specific user
POST   /api/users              Create new user
PUT    /api/users/:id          Update user
DELETE /api/users/:id          Delete user
```

#### Routes (nested under users)
```
GET    /api/users/:userId/routes                    Get all routes for a user
GET    /api/users/:userId/routes/:routeId           Get specific route
POST   /api/users/:userId/routes                    Create new route for user
PUT    /api/users/:userId/routes/:routeId           Update route (must belong to user)
DELETE /api/users/:userId/routes/:routeId           Delete route (must belong to user)
```

#### Locations
```
GET    /api/locations          Get all campus locations
```
#### AuthContext (`src/context/AuthContext.tsx`): Provides authentication state across the app
```  
  - `isLoggedIn`: Boolean indicating if user is authenticated
  - `user`: Current user object (id, name, email)
  - `login(userData)`: Function to log in and store user data
  - `logout()`: Function to clear authentication state
```

## Testing ##

### Setup
All test dependencies are installed with `npm install`. For E2E tests, you also need to install browsers:
```bash
npx playwright install
```

### Frontend Unit Tests (Jest + React Testing Library)
```bash
npm run test:frontend
```
**14 tests** covering components, authentication context, and user interactions:
- `tests/Frontend/NavBar.test.tsx` - Navigation component (2 tests)
- `tests/Frontend/AuthContext.test.tsx` - Authentication state management (4 tests)
- `tests/Frontend/AccountPage.test.tsx` - Login/register forms (4 tests)
- `tests/Frontend/HomePage.test.tsx` - Route planning page (4 tests)

### Backend API Tests (Jest + Supertest)
```bash
npm run test:backend
```
**19 tests** validating API endpoints and database operations:
- `tests/Backend/users.test.js` - User authentication and management (8 tests)
- `tests/Backend/routes.test.js` - Route CRUD operations (11 tests)
- `tests/Backend/locations.test.js` - Location endpoints

### End-to-End Tests (Playwright)
```bash
npm run test:e2e
```
**51 tests** across 3 browsers (Chromium, Firefox, WebKit):

**User Flows** (6 tests):
- Authentication: Login, registration, form switching, error handling
- Navigation: Navbar display, authentication redirects

**Responsive Design** (2 tests):
- Mobile and tablet viewport testing

**Schedule Builder - Route Management** (9 tests):
- Create and save new routes
- Edit existing routes
- Delete routes
- Multi-stop routes
- Reset functionality
- Form validation (route name and location requirements)

**Schedule Builder - Backend Integration** (1 test):
- Route persistence after page reload

**Note:** E2E tests automatically start the dev server before running and use real backend integration at `localhost:5000`.

### Run All Tests
```bash
npm run test:all
```
