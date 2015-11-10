version = 0.0.8

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
	git push origin master
	git push origin ${version}
.PHONY: dist
