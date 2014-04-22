test:
	clear && mocha --recursive ./test/ --reporter spec --slow 1

.PHONY: test