version = 0.0.10

clean:
	@rm -rf dist/**
test:
	@echo "test not write"
dist: clean
	./node_modules/.bin/lessc ./less/bello.less ./dist/css/bello.css
	./node_modules/.bin/lessc ./less/component.less ./dist/css/component.css
	cp -r ./font ./img ./js ./dist/
tag: dist
	git commit -am "release ${version}"
	git tag ${version}
	git push origin master
	git push origin ${version}
.PHONY: dist
