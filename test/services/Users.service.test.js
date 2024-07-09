import { expect } from "chai";
import sinon from "sinon";

import Users from "../../src/models/Users.model.js";
import UsersService from "../../src/services/Users.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

describe("Users.service Tests", async () => {
    let usersService;
    let caughtError;
    let saveStub;
    let findOneStub;
    let findByIdStub;
    let findOneAndDeleteStub;
    let hashPasswordStub;
    let compareSyncStub;
    let signStub;

    beforeEach(() => {
        usersService = new UsersService();
        saveStub = sinon.stub(Users.prototype, "save");
        findOneStub = sinon.stub(Users, "findOne");
        findByIdStub = sinon.stub(Users, "findById");
        findOneAndDeleteStub = sinon.stub(Users, "findOneAndDelete");
        hashPasswordStub = sinon.stub(bcrypt, "hashSync");
        compareSyncStub = sinon.stub(bcrypt, "compareSync");
        signStub = sinon.stub(jwt, "sign");
    });

    afterEach(() => {
        sinon.restore();
    });

    describe("createUser Tests", () => {
        it("should create a user with the correct properties", async () => {
            // Arrange
            const testUsername = "testUsername";
            const testPassword = "testPassword";

            saveStub.resolvesThis();
            hashPasswordStub.returns("hashedPassword");

            // Act
            const user = await usersService.createUser(
                testUsername,
                testPassword
            );

            // Assert
            expect(user.username).to.equal(testUsername);
            expect(user.password).to.equal("hashedPassword");
            expect(user.logged_in).to.be.true;
            expect(saveStub.calledOnce).to.be.true;
        });
        it("should throw an error if the save errors", async () => {
            // Arrange
            const testUsername = "testUsername";
            const testPassword = "testPassword";

            const error = new Error("Test error");
            saveStub.throws(error);

            // Act
            try {
                await usersService.createUser(testUsername, testPassword);
            } catch (e) {
                caughtError = e;
            }

            // Arrange
            expect(saveStub.calledOnce).to.be.true;
            expect(caughtError).to.deep.equal(error);
        });
    });

    describe("createTempUser Tests", () => {
        it("should create a user with the correct properties", async () => {
            // Arrange
            const testUsername = "testUsername";

            saveStub.resolvesThis();

            // Act
            const user = await usersService.createTempUser(testUsername);

            // Assert
            expect(user.username).to.equal(testUsername);
            expect(user.password).to.equal("temp_password");
            expect(user.logged_in).to.be.false;
            expect(saveStub.calledOnce).to.be.true;
        });
        it("should throw an error if the save errors", async () => {
            // Arrange
            const testUsername = "testUsername";

            const error = new Error("Test error");
            saveStub.throws(error);

            // Act
            try {
                await usersService.createTempUser(testUsername);
            } catch (e) {
                caughtError = e;
            }

            // Arrange
            expect(saveStub.calledOnce).to.be.true;
            expect(caughtError).to.deep.equal(error);
        });
    });

    describe("deleteTempUser Tests", () => {
        it("should delete the correct user when given a temp id", async () => {
            // Arrange
            const testID = "testID";

            const testUser = { logged_in: false };
            findByIdStub.returns(testUser);

            // Act
            const user = await usersService.deleteTempUser(testID);

            // Assert
            expect(findOneAndDeleteStub.calledOnce).to.be.true;
            expect(findOneAndDeleteStub.calledOnceWith({ _id: testID })).to.be
                .true;
        });
        it("should throw an error if a user is not found", async () => {
            // Arrange
            const testID = "testID";

            findByIdStub.returns(null);

            const error = {
                status: 404,
                message: "User not found",
            };
            // Act
            try {
                await usersService.deleteTempUser(testID);
            } catch (e) {
                caughtError = e;
            }

            // Arrange
            expect(findByIdStub.calledOnce).to.be.true;
            expect(caughtError).to.deep.equal(error);
        });
        it("should throw an error if the user is not temp", async () => {
            // Arrange
            const testID = "testID";

            const testUser = { logged_in: true };
            findByIdStub.returns(testUser);

            const error = new Error("Non-temp user could not be deleted");
            // Act
            try {
                await usersService.deleteTempUser(testID);
            } catch (e) {
                caughtError = e;
            }

            // Arrange
            expect(findByIdStub.calledOnce).to.be.true;
            expect(caughtError).to.deep.equal(error);
        });
        it("should throw an error if the database search errors", async () => {
            // Arrange
            const testID = "testID";

            const error = new Error("Test error");
            findByIdStub.throws(error);

            // Act
            try {
                await usersService.deleteTempUser(testID);
            } catch (e) {
                caughtError = e;
            }

            // Arrange
            expect(findByIdStub.calledOnce).to.be.true;
            expect(caughtError).to.deep.equal(error);
        });
    });

    describe("signIn Tests", () => {
        it("should return user details with an access token if the username and password are correct", async () => {
            // Arrange
            const testUsername = "testUsername";
            const testPassword = "testPassword";

            const testUser = { _id: "testID", username: testUsername };
            findOneStub.returns(testUser);

            compareSyncStub.returns(true);

            signStub.returns("accessToken");

            // Act
            const result = await usersService.signIn(
                testUsername,
                testPassword
            );

            // Assert
            expect(result).to.deep.equal({
                id: testUser._id,
                username: testUsername,
                accessToken: "accessToken",
            });
        });
        it("should throw a 400 error if the user cannot be found", async () => {
            // Arrange
            const testUsername = "testUsername";
            const testPassword = "testPassword";

            findOneStub.returns(null);

            // Act
            try {
                await usersService.signIn(testUsername, testPassword);
            } catch (e) {
                caughtError = e;
            }

            // Arrange
            expect(findOneStub.calledOnce).to.be.true;
            expect(caughtError).to.deep.equal({
                status: 400,
                message: "Invalid username/password combination",
            });
        });
        it("should throw a 400 error if the password does not match", async () => {
            // Arrange
            const testUsername = "testUsername";
            const testPassword = "testPassword";

            const testUser = { _id: "testID", username: testUsername };
            findOneStub.returns(testUser);

            compareSyncStub.returns(false);

            // Act
            try {
                await usersService.signIn(testUsername, testPassword);
            } catch (e) {
                caughtError = e;
            }

            // Arrange
            expect(findOneStub.calledOnce).to.be.true;
            expect(caughtError).to.deep.equal({
                status: 400,
                message: "Invalid username/password combination",
            });
        });
    });

    describe("getUserByID Tests", () => {
        it("should get the correct user when given a id", async () => {
            // Arrange
            const testID = "testID";

            const testUser = {
                _id: testID,
                username: "testUsername",
                logged_in: true,
            };

            findOneStub.returns(testUser);

            const expectedUser = {
                id: testUser._id,
                username: testUser.username,
                loggedIn: testUser.logged_in,
            };

            // Act
            const result = await usersService.getUserByID(testID);

            // Assert
            expect(findOneStub.calledOnce).to.be.true;
            expect(result).to.deep.equal(expectedUser);
        });
        it("should throw a 404 error if a user is not found", async () => {
            // Arrange
            const testID = "testID";

            findOneStub.returns(null);

            const error = {
                status: 404,
                message: "User not found",
            };
            // Act
            try {
                await usersService.getUserByID(testID);
            } catch (e) {
                caughtError = e;
            }

            // Arrange
            expect(findOneStub.calledOnce).to.be.true;
            expect(caughtError).to.deep.equal(error);
        });
        it("should throw an error if the database search errors", async () => {
            // Arrange
            const testID = "testID";

            const error = new Error("Test error");
            findOneStub.throws(error);

            // Act
            try {
                await usersService.getUserByID(testID);
            } catch (e) {
                caughtError = e;
            }

            // Arrange
            expect(findOneStub.calledOnce).to.be.true;
            expect(caughtError).to.deep.equal(error);
        });
    });
});
