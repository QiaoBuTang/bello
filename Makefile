version = v0.2

clean:
	@rm -rf dist/**
test:
	@echo "test not write"
dist: clean
	./node_modules/.bin/lessc ./less/bello.less ./dist/css/bello.css
	cp -r ./font ./img ./dist/
tag: dist
	git commit -am "release ${version}"
	git tag ${version}
.PHONY: dist
