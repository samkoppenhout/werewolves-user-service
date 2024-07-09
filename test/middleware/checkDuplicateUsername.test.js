import { expect } from "chai";
import sinon from "sinon";

import Users from "../../src/models/Users.model.js";
import checkDuplicateUsername from "../../src/middleware/checkDuplicateUsername.js";

describe("checkDuplicateUsername tests", async () => {
    let findOneStub;
    let req;
    let res;
    let next;
    let nextCalled;

    beforeEach(() => {
        findOneStub = sinon.stub(Users, "findOne");
        req = {
            headers: {},
            body: { _id: "testID" },
            params: {},
        };
        res = {
            json: sinon.stub(),
            status: sinon.stub().returnsThis(),
            sendStatus: sinon.stub(),
        };
        nextCalled = false;
        next = () => {
            nextCalled = true;
        };
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should call next if there is no room owned by that user", async () => {
        // Arrange
        findOneStub.resolves(null);

        // Act
        await checkDuplicateUsername(req, res, next);

        // Assert
        expect(nextCalled).to.be.true;
        expect(res.status.called).to.be.false;
        expect(res.json.called).to.be.false;
    });
    it("should return 400 if the user is already a room owned by that player", async () => {
        // Arrange
        findOneStub.resolves({});

        // Act
        await checkDuplicateUsername(req, res, next);

        // Assert
        expect(nextCalled).to.be.false;
        expect(res.status.calledOnceWith(400)).to.be.true;
        expect(
            res.json.calledOnceWith({
                message: `Could not create user: Username already in use!`,
            })
        ).to.be.true;
    });
    it("should throw an error if the find request returns an error", async () => {
        // Arrange
        const error = new Error("Database error");
        findOneStub.rejects(error);

        // Act
        await checkDuplicateUsername(req, res, next);

        // Assert
        expect(nextCalled).to.be.false;
        expect(res.status.calledOnceWith(500)).to.be.true;
        expect(res.json.calledOnceWith({ message: error.message })).to.be.true;
    });
});
