const path = require('path')
const fs = require('fs');

deleteImages = (res,array) => {
    console.log(array, 1111111111111)
    for(let i = 0; i < array.length;i++){
        const imgUrl = `${path.resolve()}/uploads/products/${array[i]}`
        fs.unlink(imgUrl, (err) => {
            if (err) { res.status(500).json({ message: "couldn't find file" }) }
        })
    }
}

module.exports = deleteImages;