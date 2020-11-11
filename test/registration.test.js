let assert = require('assert')
let Reg = require('../registration')


const pg = require("pg");
const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://teko:123@localhost:5432/registration';
const pool = new Pool({
    connectionString
});

const reg = Reg(pool)

describe("Registration function", function () {


    beforeEach(async function () {
        await pool.query(`delete from registration`)
       
    });


    it("should add a registration to database", async function () {
        const reg = Reg(pool)

        var registration = 'CA 1234'

        await reg.addRegistration(registration)
        assert.deepEqual([{ reg_number: 'CA 1234' }], await reg.allRegistration());
    });

    it("should add more than one registrations to  database", async function () {
        const reg = Reg(pool)

        const registration = 'CJ 123456';
        const registration2 = "CY 2345";
        const registration3 = "CA 876-568";

        await reg.addRegistration(registration)
        await reg.addRegistration(registration2)
        await reg.addRegistration(registration3)
        const allRegistration = await reg.allRegistration()

        assert.deepEqual([{ reg_numb: "CJ 123456" }], [{ reg_number: 'CJ 123456' }], [{ reg_number: 'CY 2345' }], [{ reg_number: 'CA 876-568' }],
         allRegistration);
    });

    it("should be able to filter all Cape Town registrations ", async function () {
        const reg = Reg(pool)
        await reg.addRegistration("CJ 12345")
        await reg.addRegistration("CA 12345")

        assert.deepEqual([{ reg_number: "CA 1234" }],[{ reg_number: "CA 1234" }],[{ reg_number: "CA 12345" }],
         await reg.filterTowns('1'));
    });

    it("should be able to filter all Bellville registrations ", async function () {
        const reg = Reg(pool)


        await reg.addRegistration("CJ 12345")
        await reg.addRegistration("CY 12345")

        assert.deepEqual([{ reg_numb: "CY 2345" }],[{ reg_numb: "CY 2345" }], [{ reg_numb: "CY 12345" }],
         await reg.filterTowns('3'));
    });

    it("should be able to filter all Paarl registrations ", async function () {


        await reg.addRegistration("CJ 12345")
        await reg.addRegistration("CA 12345")

        assert.deepEqual([{ reg_numb: "CJ 123456" }],[{ reg_numb: "CJ 123456" }],[{ reg_numb: "CJ 12345" }],
         await reg.filterTowns('2'));
    });


    it("should return all the reg numbers", async function () {
        const reg = Reg(pool)

        const registration = "CA 1234";
        const registration2 = "CJ 12345";
        const registration3 = "CY 123456";

        await reg.addRegistration(registration)
        await reg.addRegistration(registration2)
        await reg.addRegistration(registration3)


        assert.deepEqual([{ reg_number: "CJ 12345" }], [{ reg_number: "CJ 12345" }], [{ reg_number: "CY 123456" }], 
        await reg.allRegistration());
    });


    it("should reset the dataBase", async function () {
        const reg = Reg(pool)

        await reg.addRegistration('CA 12345');
        await reg.addaddRegistrationReg('CJ 1234');
        const allReg = await reg.allRegistration();

        assert.deepEqual([], await reg.clear());
    });

    after( async function () {
        pool.end();
    })
});``