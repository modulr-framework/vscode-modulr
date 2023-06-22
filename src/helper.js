const CLIHelper = require('cli-helper').constructor;


class Helper extends CLIHelper {

    constructor() {
        super();
    }

    getTemplate(name) {
        let tplPath = `${__dirname}/templates/${name}.jst`;
        let ret = null;

        if (this.isFileExists(tplPath)) {
            ret = this.readFile(tplPath);
        }
        return ret;
    }

    getPathInfo(source) {
        const self = this;

        let path = (() => {

            const filename = (() => {
                let sp = source.split('/');
                return sp[sp.length - 1];
            })();

            const dirPath = source.replace(`/${filename}`, '');

            // search for .modulrc
            const conf = ((dir) => {
                let currDir = dir;
                let done = false;
                let ret = null;

                while (!done) {
                    let cpath = `${currDir}/.modulrc`;
                    if (!self.isFileExists(cpath)) {
                        // one level down
                        let sp = currDir.split('/');
                        sp.pop();
                        if (sp.length === 0) {
                            done = true;
                        } else {
                            currDir = sp.join('/');
                        }
                    } else {
                        ret = cpath;
                        done = true;
                    }
                }
                return ret;
            })(dirPath);

            return {
                source,
                filename,
                dirPath,
                conf
            };

        })();

        console.log('path >>>>', path);

        let moduleName = null,
            modulrInstance = null,
            conf = null;

        if (path.conf) {

            // get the modulrc config information
            conf = ((confPath) => {
                let info = JSON.parse(self.readFile(confPath));
                return info;
            })(path.conf);

            path.baseAppPath = (() => {
                return conf.appPath || path.conf.replace('/.modulrc', '/app');
            })();

            path.modulePath = (() => {
                let val = null;
                // check if the base app path is a path of the module
                if (path.dirPath.includes(path.baseAppPath)) {
                    let moduleName = path.filename.replace(/\.js$/i, '');
                    val = path.dirPath.replace(path.baseAppPath, '');
                    val = [(val.length > 0) ? (val + '/') : '', moduleName].join('');
                    val = val.replace(/^\//, '');
                }
                return val;
            })();

            moduleName = `${conf.uid}:${path.modulePath}`;
            modulrInstance = conf.scopeName || 'Modulr';

        }

        return {
            conf,
            path,
            moduleName,
            modulrInstance
        };

    }


}

module.exports = new Helper;
