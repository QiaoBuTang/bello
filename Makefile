version = 0.2.46

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
	./node_modules/.bin/lessc ./less/chat.less ./dist/css/chat.css
	mkdir ./dist/js && cat ./js/*.js > ./dist/js/component.js && cat ./component/chat-iframe.module.jsx > ./dist/js/chat-iframe.module.jsx
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
