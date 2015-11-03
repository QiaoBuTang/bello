version = v0.2

clean:
	@rm -rf dist/**
test:
	@echo "test"
	echo "aa"
dist: clean
	./node_modules/.bin/lessc ./less/qlib.less ./dist/css/qlib.css
	cp -r ./font ./img ./dist/
tag: dist
	git commit -am "release ${version}"
	git tag ${version}
.PHONY: dist
