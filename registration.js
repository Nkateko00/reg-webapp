module.exports = function (pool) {

    async function addRegistration(regNumber) {

if (regNumber !== "") {

    if (/C[AYJ] \d{3,6}$/.test(regNumber) || /C[AYJ] \d{3}-\d{3}$/.test(regNumber)) {

        //spliting registration into letters (CY) & numbers 212
        const reg = regNumber.substring(0, 2)
        const theRegistration = await pool.query(`select id from places where reg = $1`, [reg])
        //inner value of rows in db
        const newRegistration = theRegistration.rows[0].id

        let checking 
        if (newRegistration > 0) {
            checking = await pool.query(`select * from registration where reg_number = $1`, [regNumber])
        } else {
            
            return false
        }

        if (checking.rowCount === 0) {
            await pool.query(`insert into registration (reg_number, places_id) values ($1, $2)`, [regNumber, newRegistration])
        } else {
            return false
        }

    }
    else {
        return false
    }
}
}

async function filterTowns(town) {

if (town === 'all') {
    const filter = await pool.query(`select reg_number from registration`)
    return filter.rows
}
else {
    const restOfTheTowns = await pool.query(`select * from registration where places_id = $1`, [town])
    return restOfTheTowns.rows
}

}

async function allRegistration() {
const regNum = await pool.query('select reg_number from registration');
return regNum.rows;
}

async function clear() {
const clear = await pool.query('delete from registration');
return clear.rows
}
async function regCheck(regNumber) {

const checking = await pool.query(`select * from registration where reg_number = $1`, [regNumber])
return checking.rowCount
}



return {
addRegistration,
allRegistration,
clear,
filterTowns,
regCheck
}
}