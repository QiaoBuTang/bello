version = 0.0.17

clean:
	@rm -rf dist/**
test:
	@echo "test not write"
dist: clean
	./node_modules/.bin/lessc ./less/bello.less ./dist/css/bello.css
	./node_modules/.bin/lessc ./less/bello.mobile.less ./dist/css/bello.mobile.css
	./node_modules/.bin/lessc ./less/component.less ./dist/css/component.css
	mkdir ./dist/js && cat ./js/*.js > ./dist/js/component.js
	cp -r ./font ./img ./dist/
tag: dist
	git add .
	git commit -m "release ${version}"
	git tag ${version}
	git push origin master
	git push origin ${version}
.PHONY: dist
