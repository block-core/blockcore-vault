"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayComponent = void 0;
const core_1 = require("@angular/core");
const tree_1 = require("@angular/material/tree");
const tree_2 = require("@angular/cdk/tree");
const example_data_1 = require("./example-data");
let GatewayComponent = class GatewayComponent {
    constructor(appState) {
        this.appState = appState;
        this.treeFlattener = new tree_1.MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
        this.treeControl = new tree_2.FlatTreeControl(this.getLevel, this.isExpandable);
        this.dataSource = new tree_1.MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
        this.dataSource.data = example_data_1.files;
        this.appState.title = 'Data';
    }
    /** Transform the data to something the tree can read. */
    transformer(node, level) {
        return {
            name: node.name,
            type: node.type,
            level: level,
            expandable: !!node.children
        };
    }
    /** Get the level of the node */
    getLevel(node) {
        return node.level;
    }
    /** Get whether the node is expanded or not. */
    isExpandable(node) {
        return node.expandable;
    }
    /** Get whether the node has children or not. */
    hasChild(index, node) {
        return node.expandable;
    }
    /** Get the children for the node. */
    getChildren(node) {
        return node.children;
    }
};
GatewayComponent = __decorate([
    core_1.Component({
        selector: 'app-gateway',
        templateUrl: './gateway.component.html',
        styleUrls: ['./gateway.component.css']
    })
], GatewayComponent);
exports.GatewayComponent = GatewayComponent;
