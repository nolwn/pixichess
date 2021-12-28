import * as path from "path";
import * as webpack from "webpack";
// in case you run into any typescript error when configuring `devServer`
// import "webpack-dev-server";

const config: webpack.Configuration = {
	entry: "./src/index.ts",
	mode: "production",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	output: {
		filename: "bundle.js",
		path: path.resolve(__dirname, "dist"),
	},
	externals: [
		// Don't bundle pixi.js, assume it'll be included in the HTML via a script
		// tag, and made available in the global variable PIXI.
		{ "pixi.js": "PIXI" },
	],
};

export default config;
