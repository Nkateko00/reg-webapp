module.exports = function registrationRoutes(reg) {

    async function home(req, res) {
        var allRegistrations = await reg.allRegistration()
        res.render('index', {
            regNumb: allRegistrations
        });

    }
    async function addReg(req, res) {
        var numb = req.body.regData
        var upperCase = numb.toUpperCase()
        var allRegistrations = await reg.allRegistration()

     

        if (upperCase !== "") {
            
            if (/C[AYJ] \d{3,6}$/.test(upperCase) || /C[AYJ] \d{3}-\d{3}$/.test(upperCase)) {
                if (await reg.regCheck(upperCase) === 0) {
                    await reg.addRegistration(upperCase)
                    req.flash('success', 'Succesful!')

                }
                else {
                    req.flash('error', 'registration already exists,enter a new one!')
                }
            }
            else {
                req.flash('error', 'Please enter a valid registration!')
            }
        }
        else {
            req.flash('error', 'Please enter a registration!')
        }

        res.render('index', {
            regNumb: allRegistrations
        });
    }
    async function filterAll(req, res) {
        var filter = req.query.filter
        //from handlebars selection 

        const filtering = await reg.filterTowns(filter)
        res.render('index', {
            regNumb: filtering
        })
    }
    async function clear(req, res) {
        await reg.clear()
        res.render('index')
    }


    return {
        home,
        addReg,
        filterAll,
        clear
    }
}