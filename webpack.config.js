const webpack = require('webpack');
const resolve = require('path').resolve;
const config = {
	devtool: 'eval-source-map',
	entry: {
		app: './Website/app/index.jsx',
	},
	output: {
		path: resolve('./Website/public'),
		filename: 'bundle.js',
		publicPath: resolve('./Website/public')
	},
	resolve: {
		extensions: ['.js', '.jsx', '.css']
	},
	module: {
		rules: [{
			test: /\.jsx?/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: [
						'@babel/preset-react',
						'@babel/preset-env'
					],
					plugins: [
						["@babel/plugin-proposal-class-properties", { loose: true }],
						["transform-imports", {
							"@material-ui/core": {
								"transform": "@material-ui/core/${member}",
								"preventFullImport": true
							},
							"@material-ui/lab": {
								"transform": "@material-ui/lab/${member}",
								"preventFullImport": true
							},
							"@material-ui/styles": {
								"transform": "@material-ui/styles/${member}",
								"preventFullImport": true
							},
							"@material-ui/icons": {
								"transform": "@material-ui/icons/${member}",
								"preventFullImport": false
							},
						}]
					]
				}
			}
		},
		{
			test: /\.(png|woff|woff2|eot|ttf|svg)$/,
			use: [{
				loader: 'url-loader',
				options: {
					limit: 10000
				}
			}]
		},
		{
			test: /\.css$/,
			use: [
				{ loader: "style-loader" },
				{ loader: "css-loader" }
			]
		}
	]},
	plugins: [
		new webpack.NamedModulesPlugin()
	]
};
module.exports = config;