module.exports = {
    entry: './public/mainApp.js',
    output: {
        path: __dirname + '/public/dist',
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
                test: /\.js?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015']
                    }
                }
                }, 
                {
                test: /\.scss$/,
                loader: 'style!css!less'
                },
                {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
                },
                {
                test: /\.(woff|woff2|ttf|svg|eot)$/, 
                loader: 'url-loader'
                },
                // Bootstrap 3 
                { 
                test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/, 
                loader: 'imports-loader?jQuery=jquery' 
                },
                {
                test: /\.(html)$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: [':data-src']
                    }
                },
                },
                { 
                    test: /[\/]angular\.js$/, 
                    loader: "exports?angular" 
                }
            ]
    } 
}