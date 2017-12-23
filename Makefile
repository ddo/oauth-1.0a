
test: node_modules
	npm test

coverage: coverage/lcov.info
	node_modules/.bin/istanbul report text

coveralls: coverage/lcov.info
	cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && rm -rf ./coverage

.PHONY: test coverage coveralls

coverage/lcov.info: node_modules package.json oauth-1.0a.js test/*.js test/**/*.js test/mocha.opts
	node_modules/.bin/istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly

node_modules: package.json
	npm install
	touch node_modules
