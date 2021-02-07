
const path = require('path');

module.exports = {
    entry: {
        main: './public/js/main.js'
    },
    output: {
        path: __dirname,
        filename: './public/dist/[name].js'
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
};