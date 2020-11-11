let assert = require('assert')
let Reg = require('../registration')


const pg = require("pg");
const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://teko:teko123@localhost:5432/registration';
const pool = new Pool({
    connectionString
});

const reg = Reg(pool)

describe("Registration function", function () {


    beforeEach(async function () {
        await pool.query(`delete from registration`)
       
    });


    it("should add a registration to database", async function () {
        const reg = Reg(pool);

        var registration ="CA 1234";

        await reg.addRegistration(registration)
        const allRegistration = await reg.allRegistration()
        assert.deepEqual([{ reg_number: 'CA 1234' }],[{ reg_number: 'CA 1234' }], allRegistration);
    });

    it("should add more than one registration to  database", async function () {
        const reg = Reg(pool)

        const registration = 'CJ 123456';
        const registration2 = "CY 1234";
        const registration3 = "CA 213-321";

        await reg.addRegistration(registration)
        await reg.addRegistration(registration2)
        await reg.addRegistration(registration3)
        const allRegistration = await reg.allRegistration()

        assert.deepEqual([{ reg_number: "CJ 123456" }], [{ reg_number: 'CJ 123456' }], [{ reg_number: 'CY 1234' }],
         [{ reg_number: 'CA 213-568' }],  allRegistration);
      
    });

    it("should filter all Cape Town registrations ", async function () {
        const reg = Reg(pool)
        await reg.addRegistration("CJ 123456")
        await reg.addRegistration("CA 12345")

        assert.deepEqual([{ reg_number: "CA 1234" }],[{ reg_number: "CA 1234" }],[{ reg_number: "CA 12345" }],
         await reg.filterTowns('1'));
    });

    it("should  filter all Bellville registrations ", async function () {
        const reg = Reg(pool)


        await reg.addRegistration("CJ 12345")
        await reg.addRegistration("CY 12345")

        assert.deepEqual([{ reg_number: "CY 12345" }],[{ reg_number: "CY 12345" }], [{ reg_number: "CY 12345" }],
         await reg.filterTowns('3'));
    });

    it("should  filter all Paarl registrations ", async function () {


        await reg.addRegistration("CJ 123456")
        await reg.addRegistration("CA 12345")

        assert.deepEqual([{ reg_number: "CJ 123456" }],[{ reg_number: "CJ 123456" }],[{ reg_number: "CJ 12345" }],
         await reg.filterTowns('2'));
    });

    it("should reset the dataBase", async function () {
        const reg = Reg(pool)

        await reg.addRegistration('CA 12345');
        await reg.addRegistration('CY 123456');
        const allReg = await reg.allRegistration();

        assert.deepEqual([], await reg.clear());
    });


    it("should return all the registration numbers", async function () {
        const reg = Reg(pool)

        const registration = "CA 12345";
        const registration2 = "CJ 123456";
        const registration3 = "CY 123456";

        await reg.addRegistration(registration)
        await reg.addRegistration(registration2)
        await reg.addRegistration(registration3)


        assert.deepEqual([{ reg_number: "CJ 123456" }], [{ reg_number: "CJ 123456" }], [{ reg_number: "CY 123456" }], 
        await reg.allRegistration());
    });


   

    after( async function () {
        pool.end();
    })
});``