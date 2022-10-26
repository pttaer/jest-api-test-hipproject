const supertest = require('supertest')
const request = supertest('http://localhost:3000')
const { default: mongoose } = require('mongoose');
const project = require('../pages/api/route/project.route')
let createdId;

// START OF TEST SUITE

describe('test suite', () => {

    // Start before running the tests
    beforeAll(async () => {

        // MONGODB CONNECT
        try {
            await mongoose.connect(
                "mongodb+srv://kimdat0705:kimdatkimdat0705@cluster0.duoyvfe.mongodb.net/hippro"
            );
            await mongoose.connection.on("connected", () => {
                console.log("> Connected to MongoDB");
            });
            await console.log('Started running test cases')
        }
        catch (err) {
            await mongoose.connection.on("error", (err) => {
                console.log("err connecting", err);
            });
        }
    });

    // Start after all the tests has run
    afterAll(async () => {

        //MONGODB DISCONNECT
        await mongoose.connection.close()
        console.log('Ended running test cases')
    });

    // START OF TEST CASES

    // 1. Get all project from Mongo database
    test('Get all projects', async () => {
        const response = await request.get('/api/prj/getallprj', project)
        console.log(response.body)
        expect(response.status).toBe(200);
    })

    // 2. Get many project with projectId
    test.each(['63272f0ae7b4bfbaab9d6fef', '632ad1d5139410a42cf9c6de', '632ad1ea139410a42cf9c6df'])('Get one project', async (id) => {
        const response = await request.get(`/api/prj/getbyid?id=${id}`)
        console.log(id);
        console.log(response.body)
        expect(response.status).toBe(200);
    })

    // 3. Create new project
    test('Post-create a new project', async () => {
        let prj = {
            "name": "projectzeroplus",
        }
        const response = await request.post('/api/prj/create', project).send(prj)
        expect(response.status).toBe(200)
        createdId = response.body._id
        console.log(response.body)
    })

    // 4. Create many new projects as the same time
    test.each(['project001', 'project002', 'project003'])('Post-create new projects', async (name) => {
        let prj = {
            "name": `${name}`
        }
        const response = await request.post('/api/prj/create', project).send(prj)
        expect(response.status).toBe(200)
        console.log(response.body)
    })


    // 5. Delete an existing project with the id createdId
    test('Delete-delete a project', async () => {
        try {
            const response = await request.delete(`/api/prj/delete?id=${createdId}`, project)
            expect(response.status).toBe(200);
            console.log('Project deleted')
        } catch (err) {
            console.log('Delete failed', err)
        }
    })
});