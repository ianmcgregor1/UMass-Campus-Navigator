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

describe('Locations API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should retrieve all location", async() => {
        const mockLocations = [
            {id:1, name:"Lederle", location: {lat: 123, lng: 234}},
            {id:2, name:"ILC", location: {lat: 345, lng: 456}}
        ];
        db.query.mockImplementation((query, callback) => {
            callback(null, mockLocations);
        })
        const response = await request(app).get("/api/locations");
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toEqual(true);
        expect(response.body[0].location).toEqual({lat: 123, lng: 234});
    });
});