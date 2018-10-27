//require our dependencies
const path = require('path')
const webpack = require('webpack')

module.exports = () => {

    let config = {
        //the base directory (absolute path) for resolving the entry option
        context: __dirname,

        // we don't specify the extension now, because we will later in the `resolve` section
        entry: {
            'opaque':'./game/main.js',
            'opaque.min':'./game/main.js'
        },
        devtool: "source-map",
        output: {
            //where we want our compiled bundle to be stored
            path: path.resolve('./'),
            filename: "[name].js",
            library: 'opaque',
            libraryTarget: 'umd',
            umdNamedDefine: true
        },

        module: {
            rules: [
                {
                    //a regexp that tells webpack use the following loaders on all
                    //.js files
                    test: /\.js$/,

                    // we don't want babel to transpile all the files in node_modules
                    exclude: /node_modules/,

                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env']
                            }
                        }
                    ]
                }
            ]
        },

        resolve: {
            //extensions that should be used to resolve modules
            extensions: ['.js']
        }
    }

    return config
}

