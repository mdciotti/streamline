module.exports = {
	entry: './main.js',
	output: {
		path: './build',
		filename: 'bundle.js'
	},
	devtool: 'source-map',
	extensions: ['js'],
	module: {
		loaders: [
			{ test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/, query: { presets: ['es2015'] } }
		]
	},
	resolve: {
		modulesDirectories: ['node_modules', 'bower_components']
	}
};
