version = 0.1.17

install:
	@npm install --registry=https://registry.npm.taobao.org --disturl=https://npm.taobao.org/dist
	@./node_modules/.bin/bower install
clean:
	@rm -rf dist/**
test:
	@echo "test not write"
dist: clean install
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
demo: install
	./node_modules/.bin/anywhere -p 3000
.PHONY: dist
