var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: './lib/app.js',
    output: {
        path: './lib',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {test: /\.js$/, loader: 'jsx-loader?harmony' },
            {test: /\.less$/, loader: 'style-loader!css-loader!less-loader' }
        ]
    }
}