let assert = require('assert')
let Reg = require('../registration')


const pg = require("pg");
const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://teko:teko123@localhost:5432/registration_test';
const pool = new Pool({
    connectionString
});

const reg = Reg(pool);

describe("Registration function", function () {


    beforeEach(async function () {
        await pool.query(`delete from registration`)
       
    });


    it("should not add duplicates onto database", async function () {
    

        await reg.addRegistration("CA 1234")
        await reg.addRegistration("CA 1234")
        await reg.addRegistration("CA 1234")

        const allRegistration = await reg.allRegistration()
        // console.log(allRegistration);

        assert.deepEqual([{ reg_number: 'CA 1234' }], allRegistration);
    });

    it("should add more than one registration to  database", async function () {


        await reg.addRegistration("CJ 21779")
        await reg.addRegistration("CA 56262")
        
        assert.deepEqual( [{ reg_number: 'CJ 21779' },{ reg_number: 'CA 56262'}] 
        ,  await reg.allRegistration()
        );
      
    });
 
    it("should filter all Cape Town registrations ", async function () {
        await reg.addRegistration("CJ 123456")
        await reg.addRegistration("CA 12345")


        assert.deepEqual([{ reg_number: "CA 1234" }],[{ reg_number: "CA 1234" }],[{ reg_number: "CA 12345" }],
         await reg.filterTowns('2'));
    });

    it("should  filter all Bellville registrations ", async function () {

    
        await reg.addRegistration("CY 12365")
        await reg.addRegistration("CA 12345")
        // console.log(await reg.filterTowns('1') + "dsddsdsdsdsds")

        assert.deepEqual([{  reg_number: "CY 12365"}], await reg.filterTowns('1'));
       
      
    });

    it("should  filter all Paarl registrations ", async function () {


        await reg.addRegistration("CJ 123456")
        await reg.addRegistration("CA 12345")

        assert.deepEqual([{ reg_number: "CJ 123456" }],
         await reg.filterTowns('3'));
    });
    it("should filter for All the Towns", async function (){


        await reg.addRegistration("CA 123456");
        await reg.addRegistration("CY 1233");
        await reg.addRegistration("CJ 132456");
        await reg.addRegistration("CA 12345");

        // console.log(await reg.filterTowns(3) + "eqeeqeqwewewqeqeqeqeq");     
        assert.deepEqual([{reg_number : "CA 123456"}, {reg_number: "CY 1233"},
        {reg_number: "CJ 132456"},{reg_number: "CA 12345"}], await reg.filterTowns('all'))

        

    })
    it("should reset the dataBase", async function () {

        await reg.addRegistration('CA 12345');
        await reg.addRegistration('CY 123456');
        const allReg = await reg.allRegistration();

        assert.deepEqual([], await reg.clear());
    });


    it("should return all the registration numbers", async function () {


        await reg.addRegistration("CA 12345")
        await reg.addRegistration("CJ 123456")
        await reg.addRegistration("CY 123456")


        assert.deepEqual([{ reg_number: "CJ 123456" }], [{ reg_number: "CJ 123456" }], [{ reg_number: "CY 123456" }], 
        await reg.allRegistration());
    });
   

    after( async function () {
        pool.end();
    })
});

