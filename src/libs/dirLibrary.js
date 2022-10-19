const fs = require('fs-extra');

const deleteImage = (dirname) => {
    fs.unlink(dirname, (err) => {
        if (err) {
          console.error('No se ha podido eliminar la imágen del servidor.');
          return
        };
      
        console.log('Imágen eliminada del servidor.');
    })
};

module.exports = deleteImage;