clean:
	@rm -rf dist/**
test:
	@echo "test"
dist: clean
	./node_modules/.bin/lessc ./less/qlib.less ./dist/css/qlib.css

.PHONY: dist
