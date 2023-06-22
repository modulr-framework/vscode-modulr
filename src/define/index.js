
const vscode = require('vscode');
const Helper = require('../helper');
const template = require('./template');

module.exports = () => {

    //vscode.window.showInformationMessage('Hello World from vscode-modulr!');

    // Get the active text editor
	const editor = vscode.window.activeTextEditor;

    if (editor) {

        const filepath = editor.document.fileName;

        const pathInfo = Helper.getPathInfo(filepath);

        editor.edit((active) => {
			const pos = new vscode.Position(0, 0);

            let proceed = (pathInfo &&
                pathInfo.conf &&
                pathInfo.moduleName &&
                pathInfo.modulrInstance
            ) ? true : false

            if (proceed) {
                // active.insert(pos, JSON.stringify(pathInfo, null, 2));
                active.insert(pos, template(pathInfo));
            } else {
                vscode.window.showInformationMessage('Cannot define file!');
            }

		});

    }


}