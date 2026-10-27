import * as vscode from 'vscode';
import { TodoProvider, TodoItem } from './todoProvider';

export function activate(context: vscode.ExtensionContext) {
	const todoProvider = new TodoProvider('//TODO:');
	const fixmeProvider = new TodoProvider('//FIXME:');
	vscode.window.registerTreeDataProvider('todo_list', todoProvider);
	vscode.window.registerTreeDataProvider('fixme_list', fixmeProvider);
	vscode.workspace.onDidSaveTextDocument(() => {
		todoProvider.refresh();
		fixmeProvider.refresh();
	});
	let completeCommand = vscode.commands.registerCommand('todo_complete', async (item: TodoItem) => {
		const edit = new vscode.WorkspaceEdit();
		const rangeToDelete = new vscode.Range(item.line, 0, item.line + 1, 0);
		edit.delete(item.file, rangeToDelete);
		await vscode.workspace.applyEdit(edit);
		await vscode.workspace.saveAll();
	});
	context.subscriptions.push(completeCommand);
}

export function deactivate() {}