module.exports = {
	options: {
		files: [
			"package.json",
			"bower.json"
		],
		updateConfigs: [
			"package"
		],
		commit: true,
		commitMessage: "Release v%VERSION%",
		commitFiles: [
			"-a"
		],
		createTag: true,
		tagName: "v%VERSION%",
		tagMessage: "Version %VERSION%",
		push: true,
		pushTo: "origin",
		gitDescribeOptions: "--tags --always --abbrev=1 --dirty=-d"
	}
};
