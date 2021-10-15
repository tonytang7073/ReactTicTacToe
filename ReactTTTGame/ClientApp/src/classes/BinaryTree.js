import BinaryNode from "./BinaryNode";

class BinaryTree {
    constructor() {
        this.root = null;
        this.current = null;
    }

    

    isEmpty() {
        return this.root == null ? true : false;
    }

    isAtEnd() {
        return (this.current != null && this.current.yesNode == null && this.current.noNode == null) ? true : false;
    }

    getCurrentData() {
        return this.current.data;
    }

    moveCurrentYes() {
        this.current = this.current.yesNode;
    }

    moveCurrentNo() {
        this.current = this.current.noNode;
    }

    setCurrentToStart() {
        this.current = this.root;
    }

    Insert(data, move) {
        this.root = this.InsertItem(null, data, move);
    }

    ///recursive insert node.
    InsertItem(newRoot, data, move) {
        if (newRoot == null) {
            newRoot = new BinaryNode(data);
            return newRoot;
        }
        else if (move === "Y" || move === "y") {
            newRoot.yesNode = this.InsertItem(newRoot.yesNode, data, move);
        }
        else {
            newRoot.noNode = this.InsertItem(newRoot.noNode, data, move);
        }
        return newRoot;

    }

    print() {
        this.PrintTree(this.root);
    }
    ///recursively print the tree
    PrintTree(root) {
        if (root != null) {
            console.log(root.data);
            this.PrintTree(root.yesNode);
            this.PrintTree(root.noNode);
        }
    }

}

export default BinaryTree;