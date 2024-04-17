const mongoose = require('mongoose')

const dbConnection = async () => {
    return await mongoose.connect(
        'mongodb+srv://frank1:coderpass@codertest.nxksjus.mongodb.net/?retryWrites=true&w=majority&appName=CoderTest'),{
            dbName: 'ecommerce'
        }
}
module.exports = dbConnection