module.exports = function registrationRoutes(reg) {

    async function home(req, res) {
        
            var allRegistrations = await reg.allRegistrations()
            res.render('home', {
                regNumb: allRegistrations
            });

    }
    async function addReg(req, res) {
        var numb = req.body.regData
        var upperCase = numb.toUpperCase()
        
            if (upperCase !== "") {
                if (/C[AYJ] \d{3,6}$/.test(upperCase) || /C[AYJ] \d{3}-\d{3}$/.test(upperCase)) {
                    if (await reg.regCheck(upperCase) === 0) {
                        await reg.addRegistration(upperCase)
                        req.flash('success', 'SUCCESS!')
                    }else {
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

            var all = await reg.allRegistrations()
            res.render('home', {
                regNumb: all
            })
    }
    async function filterAll(req, res) {
        var filter = req.query.filter
        //from handlebars selection section
    
            const filtering = await reg.filterTowns(filter)
            res.render('home', {
                regNumb: filtering
            })
    }
    async function clear(req, res) {
            await reg.clear()
            res.render('home')
    }


    return {
        home,
        addReg,
        filterAll,
        clear
    }
}