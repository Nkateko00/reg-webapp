module.exports = function registrationRoutes(reg) {

    async function home(req, res) {
        try{
        var allRegistrations = await reg.allRegistration()
        res.render('index', {
            regNumb: allRegistrations
        });
    }
    catch(err){
        next(err)
    }

    }
    async function addReg(req, res) {
        var numb = req.body.regData
        var upperCase = numb.toUpperCase()
       
        if (upperCase !== "") {
            
            if (/C[AYJ] \d{3,6}$/.test(upperCase) || /C[AYJ] \d{3}-\d{3}$/.test(upperCase))
            
            {

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
        var allRegistrations = await reg.allRegistration()
        res.render('index', {
            regNumb: allRegistrations
        });
    }
        
    async function filterAll(req, res) {
        var filter = req.query.filter
        //from handlebars selection 

    try{
     
        const filtering = await reg.filterTowns(filter)
        res.render('index', {
            regNumb: filtering
           
        })
        ;}
    catch(err){
            next(err);
        }
    }
    async function clear(req, res) {
        req.flash('success','data has been reset');
        await reg.clear()
        res.render('index',{
        })
       

    }

    return {
        home,
        addReg,
        filterAll,
        clear
    }
}
