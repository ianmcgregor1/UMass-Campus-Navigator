const request = require("supertest");
//mock the current database.
jest.mock("../../server/config/db");
const db = require("../../server/config/db");
const app = require("../../server/server");

describe("users API", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it("should retrieve all users", async() => {
        const mockUsers = [
            {id:1, name:"Alice"},
            {id:2, name:"Bill"}
        ];
        db.query.mockImplementation((query, callback) => {
            callback(null, mockUsers);
        })
        const response = await request(app).get("/api/users");
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toEqual(true);
    });

    it("should retrieve a user by ID of 1", async() => {
        const mockUsers = [
            {id:1, name:"Alice"},
            {id:2, name:"Bill"}
        ];
        db.query.mockImplementation((query, params, callback) => {
            callback(null, mockUsers);
        })
        //get user with ID of 1
        const response = await request(app).get("/api/users/1");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockUsers[0]);
    });

    it("should return 404 for non-existent users", async() => {
        db.query.mockImplementation((query, params, callback) => {
            callback(null, []);
        })
        //get user with ID of 1
        const response = await request(app).get("/api/users/99");
        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('error');
    });

    it("should create a new user", async() => {
        const newUser = {name: "Candice", password: "HelloWorld"}; 
        db.query.mockImplementation((query, params, callback) => {
            callback(null, {insertId: 3});
        })
        //get user with ID of 1
        const response = await request(app).post("/api/users").send(newUser);
        expect(response.statusCode).toBe(201);
        expect(response.body.id).toBe(3);
        expect(response.body.name).toBe("Candice");
    });

    it("should update a user", async() => {
        const updatedUser = {name: "Candice", password: "updatedPassword"}; 
        db.query.mockImplementation((query, params, callback) => {
            callback(null, {affectedRows: 1});
        })
        //get user with ID of 1
        const response = await request(app).put("/api/users/1").send(updatedUser);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
    });

    it("should return 404 because user was not found", async() => {
        db.query.mockImplementation((query, params, callback) => {
            callback(null, {affectedRows: 0});
        })
        //get user with ID of 1
        const response = await request(app).put("/api/users/99").send({name: "test", password: "test"});
        expect(response.statusCode).toBe(404);
        //expect(response.body).toHaveProperty('message');
    });

    it("should delete a user", async() => {
        
        db.query.mockImplementation((query, params, callback) => {
            callback(null, {affectedRows: 1});
        })
        //get user with ID of 1
        const response = await request(app).delete("/api/users/1");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
    });

    it("should return 404 because user was not found (2)", async() => {
        db.query.mockImplementation((query, params, callback) => {
            callback(null, {affectedRows: 0});
        })
        //get user with ID of 1
        const response = await request(app).delete("/api/users/99");
        expect(response.statusCode).toBe(404);
        //expect(response.body).toHaveProperty('message');
    });
});