const fs = require('fs');

function leerArchivo(path){
    const data = fs.readFileSync(path);
     const deportes = JSON.parse(data). deportes;
     return deportes;

}

function escribirArchivo(path,info){
    const data = JSON.stringify({'deportes':info});
    fs.writeFileSync(path,data);
}

module.exports = {
    leerArchivo,
    escribirArchivo
}
// console.log('arguments',arguments)

// console.log('exports',exports)

// console.log('module',module)

// console.log('require',require)

// console.log('__filename__',__filename)


// console.log('__dirname',__dirname)