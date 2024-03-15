const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {    
    mode: 'development',
    entry: './src/index.ts',
    output: {
        filename: 'scripts/index.js',
        path: path.resolve(__dirname, './dist')
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ['babel-loader']
            },
            {
                test: /\.s?css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: './'
                        }
                    },
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    autoprefixer()
                                ]
                            }
                        }
                    },
                    'sass-loader'
                ]
            }
        ],
        noParse: [
            require.resolve('typescript/lib/typescript.js')
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Monaco editor with volar support',
            template: './src/index.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'styles/styles.css'
        })
    ],
    devServer: {
        compress: true,
        port: 3000,
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
        },
    }
};
