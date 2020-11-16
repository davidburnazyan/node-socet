const fs = require('fs');
const appDir = require('path').dirname(require.main.filename);

const validation = (req, res, next) => {
    const { error } = req.schema.validate({...req.body});
    if(error === undefined) {
        next()
    }else {
        if(req.file !== undefined){
            /** If was uploaded file now we going to delete file*/
            let folder = 'users';
            if(req.path === '/sign-up'){
                folder = 'users';
            }
            const path = `${appDir}/uploads/${folder}/${req.file.filename}`;
            fs.unlink(path, (err) => {
                if (err) { res.status(500).json({ message: "couldn't find file" }) }
            })
            /** \\\ */
        }
        const { message } = error.details[0];
        res.status(500).json({ message })
    }
}

module.exports = {
    validation
}