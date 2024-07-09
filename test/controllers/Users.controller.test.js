import { expect } from "chai";
import sinon from "sinon";

import UsersController from "../../src/controllers/Users.controller.js";

describe("Users.controller tests", async () => {
    let usersController;
    let usersServices;
    let req;
    let res;

    beforeEach(() => {
        usersServices = {
            createUser: sinon.stub(),
            createTempUser: sinon.stub(),
            deleteTempUser: sinon.stub(),
            signIn: sinon.stub(),
            getUserByID: sinon.stub(),
        };
        usersController = new UsersController(usersServices);
        req = {
            headers: {},
            body: {},
            params: {},
        };
        res = {
            json: sinon.stub(),
            status: sinon.stub().returnsThis(),
            sendStatus: sinon.stub(),
            send: sinon.stub(),
        };
    });

    describe("signUp Tests", async () => {
        it("should call the service", async () => {
            // Arrange
            req.body.username = "testUsername";
            req.body.password = "testPassword";

            // Act
            await usersController.signUp(req, res);

            // Assert
            expect(usersServices.createUser.calledOnce).to.be.true;
            expect(res.status.calledWith(201)).to.be.true;
        });
        it("should return 400 if a username is not present", async () => {
            // Arrange
            req.body.password = "testPassword";

            // Act
            await usersController.signUp(req, res);

            // Assert
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: "Username invalid" }));
        });
        it("should return 400 if a password is not present", async () => {
            // Arrange
            req.body.username = "testUsername";

            // Act
            await usersController.signUp(req, res);

            // Assert
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: "Password invalid" }));
        });
        it("should throw an error if the service errors", async () => {
            // Arrange
            req.body.username = "testUsername";
            req.body.password = "testPassword";

            const error = new Error("Test error");
            error.status = 400;
            usersServices.createUser.rejects(error);

            // Act
            await usersController.signUp(req, res);

            // Assert
            expect(usersServices.createUser.calledOnce).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
            expect(
                res.json.calledWith({
                    message: "Test error",
                })
            ).to.be.true;
        });
    });

    describe("createTempUser Tests", async () => {
        it("should call the service", async () => {
            // Arrange
            req.body.username = "testUsername";

            // Act
            await usersController.createTempUser(req, res);

            // Assert
            expect(usersServices.createTempUser.calledOnce).to.be.true;
            expect(res.status.calledWith(201)).to.be.true;
        });
        it("should return 400 if a username is not present", async () => {
            // Arrange

            // Act
            await usersController.createTempUser(req, res);

            // Assert
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: "Username invalid" }));
        });
        it("should throw an error if the service errors", async () => {
            // Arrange
            req.body.username = "testUsername";

            const error = new Error("Test error");
            error.status = 400;
            usersServices.createTempUser.rejects(error);

            // Act
            await usersController.createTempUser(req, res);

            // Assert
            expect(usersServices.createTempUser.calledOnce).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
            expect(
                res.json.calledWith({
                    message: "Test error",
                })
            ).to.be.true;
        });
    });

    describe("deleteTempUser Tests", async () => {
        it("should call the service", async () => {
            // Arrange
            req.params.id = "testID";
            const testUser = {};
            usersServices.deleteTempUser.resolves(testUser);

            // Act
            await usersController.deleteTempUser(req, res);

            // Assert
            expect(usersServices.deleteTempUser.calledOnce).to.be.true;
            expect(res.status.calledWith(202)).to.be.true;
        });
        it("should return 400 if there is no id", async () => {
            // Arrange
            const testUser = {};
            usersServices.deleteTempUser.resolves(testUser);

            // Act
            await usersController.deleteTempUser(req, res);

            // Assert
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: "Invalid ID" })).to.be.true;
        });
        it("should return 404 if no user is found", async () => {
            // Arrange
            req.params.id = "testID";
            usersServices.deleteTempUser.resolves(null);

            // Act
            await usersController.deleteTempUser(req, res);

            // Assert
            expect(usersServices.deleteTempUser.calledOnce).to.be.true;
            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ message: "User not found" })).to.be
                .true;
        });
        it("should throw an error if the service errors", async () => {
            // Arrange
            req.params.id = "testID";
            const error = new Error("Test error");
            error.status = 400;
            usersServices.deleteTempUser.rejects(error);

            // Act
            await usersController.deleteTempUser(req, res);

            // Assert
            expect(usersServices.deleteTempUser.calledOnce).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
            expect(
                res.json.calledWith({
                    message: "Test error",
                })
            ).to.be.true;
        });
    });

    describe("signIn Tests", async () => {
        it("should call the service", async () => {
            // Arrange
            req.body.username = "testUsername";
            req.body.password = "testPassword";
            const testUser = {};
            usersServices.signIn.resolves(testUser);

            // Act
            await usersController.signIn(req, res);

            // Assert
            expect(usersServices.signIn.calledOnce).to.be.true;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(testUser));
        });
        it("should return 400 if a username is not present", async () => {
            // Arrange
            req.body.password = "testPassword";
            const testUser = {};

            // Act
            await usersController.signIn(req, res);

            // Assert
            expect(res.status.calledWith(400)).to.be.true;
            expect(
                res.json.calledWith({
                    message: "Invalid username/password combination",
                })
            );
        });
        it("should return 400 if a password is not present", async () => {
            // Arrange
            req.body.username = "testUsername";
            const testUser = {};

            // Act
            await usersController.signIn(req, res);

            // Assert
            expect(res.status.calledWith(400)).to.be.true;
            expect(
                res.json.calledWith({
                    message: "Invalid username/password combination",
                })
            );
        });
        it("should throw an error if the service errors", async () => {
            // Arrange
            req.body.username = "testUsername";
            req.body.password = "testPassword";
            const error = new Error("Test error");
            error.status = 400;
            usersServices.signIn.rejects(error);

            // Act
            await usersController.signIn(req, res);

            // Assert
            expect(usersServices.signIn.calledOnce).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
            expect(
                res.json.calledWith({
                    message: "Test error",
                })
            ).to.be.true;
        });
    });

    describe("getUserByID Tests", async () => {
        it("should call the service", async () => {
            // Arrange
            req.params.id = "testID";
            const testUser = {};
            usersServices.getUserByID.resolves(testUser);

            // Act
            await usersController.getUserByID(req, res);

            // Assert
            expect(usersServices.getUserByID.calledOnce).to.be.true;
            expect(res.status.calledWith(202)).to.be.true;
            expect(res.json.calledWith(testUser));
        });
        it("should return 400 if there is no id", async () => {
            // Arrange
            const testUser = {};
            usersServices.getUserByID.resolves(testUser);

            // Act
            await usersController.getUserByID(req, res);

            // Assert
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: "Invalid ID" })).to.be.true;
        });
        it("should return 404 if no user is found", async () => {
            // Arrange
            req.params.id = "testID";
            usersServices.getUserByID.resolves(null);

            // Act
            await usersController.getUserByID(req, res);

            // Assert
            expect(usersServices.getUserByID.calledOnce).to.be.true;
            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({ message: "User not found" })).to.be
                .true;
        });
        it("should throw an error if the service errors", async () => {
            // Arrange
            req.params.id = "testID";
            const error = new Error("Test error");
            error.status = 400;
            usersServices.getUserByID.rejects(error);

            // Act
            await usersController.getUserByID(req, res);

            // Assert
            expect(usersServices.getUserByID.calledOnce).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
            expect(
                res.json.calledWith({
                    message: "Test error",
                })
            ).to.be.true;
        });
    });
});
