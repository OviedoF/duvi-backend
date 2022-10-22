const path = require('path');
const Duvi = require(path.join(__dirname, '..', 'models', 'duvi.model'));
const deleteImage = require(path.join(__dirname, '..', 'libs', 'dirLibrary'));
const checkDuplicate = {};

checkDuplicate.checkDuplicateDuvi = (check, message) => {
    return async (req, res, next) => {
        const isDuplicate = await Duvi.findOne({
            [check]: req.body[check]
        });
    
        if(isDuplicate) {
            req.files.forEach(el => {
                const {filename} = el;
                const pathImage = path.join(__dirname, '..', 'public', 'images', filename);
                deleteImage(pathImage);

            })

            return res.status(400).json({
                message,
                duplicate: check
            })
        };
    
        next();
    };
};

module.exports = checkDuplicate;