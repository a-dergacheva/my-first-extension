import * as vscode from 'vscode';
import * as fs from 'fs';

export class TodoProvider implements vscode.TreeDataProvider<TodoItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<TodoItem | undefined | void> = new vscode.EventEmitter<TodoItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<TodoItem | undefined | void> = this._onDidChangeTreeData.event;
    constructor(private keyword: string) {}
    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element: TodoItem): vscode.TreeItem {
        return element;
    }
    async getChildren(): Promise<TodoItem[]> {
        const todos: TodoItem[] = [];
        const files = await vscode.workspace.findFiles('**/*.*', '**/node_modules/**');
        for (const file of files) {
            const content = fs.readFileSync(file.fsPath, 'utf-8');
            const lines = content.split('\n');
            lines.forEach((lineText, lineNumber) => {
                if (lineText.includes(this.keyword)) {
                    todos.push(new TodoItem(lineText.trim(), file, lineNumber));
                }
            });
        }
        return todos;
    }
}

export class TodoItem extends vscode.TreeItem {
    constructor(public readonly label: string, public readonly file: vscode.Uri, public readonly line: number) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.description = file.fsPath.split('/').pop();
    }
}