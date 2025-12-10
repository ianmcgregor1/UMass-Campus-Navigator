const request = require("supertest");
//mock the current database.
jest.mock("../../server/config/db");
const db = require("../../server/config/db");
const app = require("../../server/server");

// Mock mysql2 to prevent connection hanging
jest.mock('mysql2', () => ({
    createConnection: jest.fn(() => ({
        connect: jest.fn((cb) => cb && cb()),
        query: jest.fn(),
        end: jest.fn(),
        destroy: jest.fn()
    }))
}));

describe('Routes API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should retrieve all routes of a specific user", async() => {
        const mockRoutes = [
            {id:1, name:"Route to class 1", stops:[101, 102, 103], user_id: 1},
            {id:2, name:"Route to class 2", stops:[104, 105, 106, 107], user_id: 1}
        ];
        db.query.mockImplementation((query, params, callback) => {
            callback(null, mockRoutes);
        })
        const response = await request(app).get("/api/users/1/routes");
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toEqual(true);
        expect(response.body.length).toBe(2);
        expect(Array.isArray(response.body[0].stops)).toBe(true);
        expect(response.body[0].stops).toEqual([101, 102, 103]);
    });

    it("should return an empty array if the user has no routes", async() => {
        db.query.mockImplementation((query, params, callback) => {
            callback(null, []);
        })
        const response = await request(app).get("/api/users/1/routes");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });

    it("should retrieve a specific route for a specific user", async() => {
        const mockRoutes = [
            {id:1, name:"Route to class 1", stops:[101, 102, 103], user_id: 1},
            {id:2, name:"Route to class 2", stops:[104, 105, 106, 107], user_id: 1}
        ];
        db.query.mockImplementation((query, params, callback) => {
            callback(null, mockRoutes);
        })
        const response = await request(app).get("/api/users/1/routes/1");
        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(1);
        expect(response.body.name).toBe("Route to class 1");
        expect(Array.isArray(response.body.stops)).toBe(true);
        expect(response.body.stops).toEqual([101, 102, 103]);
    });

    it("should get a specific route, except it's not found", async() => {
        db.query.mockImplementation((query, params, callback) => {
            callback(null, []);
        })
        const response = await request(app).get("/api/users/1/routes/1");
        expect(response.statusCode).toBe(404);
        expect(Array.isArray(response.body)).toEqual(false);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Route not found for this user');
    });

    it("should add a new route to a user", async() => {
        const addedRoute = {name:"Route to class 1", stops:[101, 102, 103]};
        db.query.mockImplementation((query, params, callback) => {
            callback(null, {insertId: 1});
        })
        const response = await request(app).post("/api/users/1/routes").send(addedRoute);
        expect(response.statusCode).toBe(201);
        expect(response.body.id).toBe(1);
        expect(response.body.name).toBe("Route to class 1");
        expect(Array.isArray(response.body.stops)).toBe(true);
        expect(response.body.stops).toEqual([101, 102, 103]);
    });

    it("should return 500 during a database error", async() => {
        const addedRoute = {name:"Route to class 1", stops:[101, 102, 103]};
        db.query.mockImplementation((query, params, callback) => {
            callback(new Error("Database connection failed"), null);
        })
        const response = await request(app).post("/api/users/1/routes").send(addedRoute);
        expect(response.statusCode).toBe(500);
        expect(response.body).toHaveProperty('error');
    });

    it("should update a previous route of a user", async() => {
        const updatedRoute = {name:"Updated route name", stops:[201, 202, 203]};
        db.query.mockImplementation((query, params, callback) => {
            callback(null, {affectedRows: 1});
        })
        const response = await request(app).put("/api/users/1/routes/1").send(updatedRoute);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Route updated successfully');
    });

    it("should return 404 if the route is not found while trying to update", async() => {
        const updatedRoute = {name:"Updated route name", stops:[201, 202, 203]};
        db.query.mockImplementation((query, params, callback) => {
            callback(null, {affectedRows: 0});
        })
        const response = await request(app).put("/api/users/1/routes/99").send(updatedRoute);
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Route not found for this user');
    });

    it("should delete a route from a specific user", async() => {
        const mockRoutes = [
            {id:1, name:"Route to class 1", stops:[101, 102, 103], user_id: 1},
            {id:2, name:"Route to class 2", stops:[104, 105, 106, 107], user_id: 1}
        ];
        db.query.mockImplementation((query, params, callback) => {
            callback(null, mockRoutes);
        })
        const response = await request(app).delete("/api/users/1/routes/2").send(mockRoutes);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Route deleted successfully');
    });

    it("should return 404 because there was no route to delete", async() => {
        db.query.mockImplementation((query, params, callback) => {
            callback(null, {affectedRows: 0});
        })
        const response = await request(app).delete("/api/users/1/routes/99");
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Route not found for this user');
    });
});