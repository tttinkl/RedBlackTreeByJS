const RED = true;
const BLACK = false;
const LL = 1;
const LR = 2;
const RL = 3;
const RR = 4;
const LEFT = "left";
const RIGHT = "right";

class myRedBlackTree {
  constructor() {
    this.root = null;
  }
  
  insert(value, root = this.root) {
    if (root === null) {
      this.root = new TreeNode(value,BLACK);
      return;
    }
    if (value > root.value) {
      if (root.right) {
        this.insert(value, root.right);
      } else {
        var node = new TreeNode(value, RED)
        root.right = node;
        node.parent = root;
        if (root.color === RED) {
          this._propagation(node);
        }
      }
    } else if (value <= root.value) {
      if (root.left) {
        this.insert(value, root.left);
      } else {
        var node = new TreeNode(value, RED);
        root.left = node;
        node.parent = root;
        if (root.color === RED) {
          this._propagation(node);
        }
      }
    }
  } 

  find(value, root = this.root) {
    if (!root) {
      return null;
    }
    if (value > root.value) {
      return this.find(value, root.right);
    } else if (value < root.value) {
      return this.find(value, root.left);
    } else return root;
  }

  delete(value, node = this.root) {
    if (node === null) {
      return;
    }
    if (value < node.value) {
      //搜索目标节点
      this.delete(value,node.left);
    } else if (value > node.value) {
      //搜索目标节点
      this.delete(value, node.right);
    } else {
      //找到目标节点
      if (node.left && node.right) {

        //有两个字节点，转换成只有一个子节点或无子节点的问题
        var min = this._findMin(node.right);
        node.value = min.value; 
        this.delete(min.value,node.right);


      } else if (node.right || node.left) {
          //只有一个子节点
          var NODEDERECTION,
              parent = node.parent,
              son;
          if (!parent) {
            //node为根节点
            this.root = node.right;
            node.right.parent = null;
            return;
          }
          if (parent.left === node) {
            NODEDERECTION = LEFT;
          } else {
            NODEDERECTION = RIGHT;
          }
          if (node.left) {
            son = node.left
          } else {
            son = node.right;
          }

          son.color = BLACK;
          parent[NODEDERECTION] = son;
          son.parent = parent;


      } else {
        //无子节点情况
        if (node.color === RED) {
          //node是红色
          if (node.parent.left === node) {
            node.parent.left = null;
          } else if (node.parent.right === node) {
            node.parent.right = null;
          }

        } else if (node.color === BLACK) {
          //node是黑色
          var bro;
          var BRODIRECTION;
          var NODEDERECTION;
          var parent = node.parent;
          if (!parent) {
            //node为根节点
            this.root = null;
            return;
          }
          var grandp = parent.parent;
          if (parent.left === node) {
            bro = parent.right;
            BRODIRECTION = RIGHT;
            NODEDERECTION = LEFT;
          } else if (parent.right === node) {
            bro = parent.left;
            BRODIRECTION = LEFT;
            NODEDERECTION = RIGHT;
          }
          if (!bro) {
            parent.color = BLACK;
            parent[NODEDERECTION] = null;
            return;
          }
          if (bro.color === RED) {
            //兄弟节点为红色
            if (BRODIRECTION === RIGHT) {
              this._leftRotate(bro);
              if (grandp) {
                if (grandp.left === parent) {
                  grandp.left = bro;
                } else {
                  grandp.right = bro;
                }
              } else {
                this.root = bro;

              }
              bro.color = BLACK;
              node.parent.color = RED;
              node.parent[NODEDERECTION] = null;
            } else if (BRODIRECTION === LEFT) {
              this._rightRotate(bro);
              if (grandp) {
                if (grandp.left === parent) {
                  grandp.left = bro;
                } else {
                  grandp.right = bro;
                }
              } else {
                this.root = bro;
              }              
              bro.color = BLACK;
              node.parent.color = RED;
              node.parent[NODEDERECTION] = null;            
            }
          } else if (bro.color === BLACK) {
            //兄弟节点为黑色
           if (bro[NODEDERECTION] && bro[NODEDERECTION].color === RED && (!bro[this._ottherside(NODEDERECTION)] || bro[this._ottherside(NODEDERECTION)].color === BLACK)) {
            //侄子红节点同边顺
            //////////////////////////////
            var brosun = bro[NODEDERECTION];

            if (BRODIRECTION === RIGHT){ 
              this._rightRotate(brosun);
              this._leftRotate(brosun);
            } else {
              this._leftRotate(brosun);
              this._rightRotate(brosun);
            }
            if (grandp) {
              if (grandp.left === parent) {
                grandp.left = brosun;
              } else {
                grandp.right = brosun;
              }
            } else {
              this.root = brosun;
            }
            brosun.color = parent.color;
            parent.color = BLACK;
            parent[NODEDERECTION] = null;
            //done  
           } else if (bro[this._ottherside(NODEDERECTION)] && bro[this._ottherside(NODEDERECTION)].color === RED && (!bro[NODEDERECTION] || bro[NODEDERECTION].color === BLACK)) {
            //侄子红节点八字
            ///////////////////////
            if (BRODIRECTION === RIGHT) {
              this._leftRotate(bro);
            } else {
              this._rightRotate(bro);
            }
            if (grandp) {
              if (grandp.left === parent) {
                grandp.left = bro;
              } else {
                grandp.right = bro;
              }
            } else {
              this.root = bro;
            }            
            bro.color = parent.color;
            bro.right.color = BLACK;
            parent.color = BLACK;
            parent[NODEDERECTION] = null;
            //done
           } else if ((!bro.right || bro.right.color === BLACK) && (!bro.left || bro.left.color === BLACK)){
            //两个侄子都为黑色
            bro.color = RED;
            parent.color = BLACK;
            if (BRODIRECTION === RIGHT) {
              this._leftRotate(bro);
            } else {
              this._rightRotate(bro);
            }
            parent[NODEDERECTION] = null;
           } else {
            //两个侄子都为红色
            var brosun = bro[NODEDERECTION];
            if (BRODIRECTION === RIGHT){
              this._rightRotate(brosun);
              this._leftRotate(brosun);
            } else {
              this._leftRotate(brosun);
              this._rightRotate(brosun);
            }
            parent.color = BLACK;
            if (grandp) {
              if (grandp.left === parent) {
                grandp.left = brosun;
              } else {
                grandp.right = brosun;
              }
            } else {
              this.root = brosun;
            }  
            parent[NODEDERECTION] = null;          
           }

          }
        }
      }
    }
  }
  _findMin(root) {
    if (root.left) {
      return this._findMin(root.left);
    } else return root;
  }
  _findMax(root) {
    if (root.right) {
      return this._findMax(root.right);
    } else return root;
  }
  _ottherside(d) {
    if (d === LEFT) return RIGHT;
    if (d === RIGHT) return LEFT;
  }
  _propagation(node) {
    var rotate;
    if (node.parent === null) {
      //为根节点
      node.color = BLACK;
      return;
    } else if(node.parent.color === BLACK) {
      return;
    }
    var grandp = node.parent.parent;
    var parent = node.parent;

    if (grandp.left === parent) {
      var uncle = grandp.right;
    } else {
      var uncle = grandp.left;
    }
    if (uncle === null || uncle.color === BLACK) {
      ///叔节点为black
      var status = this._getStatus(node);
      ///旋转parent
      if (status === LL) {
        this._rightRotate(parent);
        parent.color = BLACK;
        grandp.color = RED;
      } else if (status === RR) {
        this._leftRotate(parent);
        parent.color = BLACK;
        grandp.color = RED;        
      } else if (status === LR) {
        this._leftRotate(node);
        this._rightRotate(node);
        node.color = BLACK;
        grandp.color = RED;
      } else if (status === RL) {
        this._rightRotate(node);
        this._leftRotate(node);
        node.color = BLACK;
        grandp.color = RED;
      }
      if (parent.parent === null) {
        //旋转后成为根节点的话
        parent.color = BLACK;
      }
    } else {
      ///叔节点为red
      node.parent.color = BLACK;
      grandp.color = RED;
      uncle.color = BLACK;
      this._propagation(grandp);
    }
  }

  _rightRotate(node) {
    var parent = node.parent;
    var bro = parent.right;
    var grandp = parent.parent;
    //连接根的上层节点
    if (grandp) {
      if (grandp.left === parent) {
        grandp.left = node;
        node.parent = grandp;
      } else if(grandp.right === parent) {
        grandp.right = node;
        node.parent = grandp;
      }
    } else {
      this.root = node;
      node.parent = null;

    }
    var tmp = node.right;
    node.right = parent;
    parent.parent = node;
    parent.left = tmp;
    if (tmp) {
      tmp.parent = parent;
    }
  }

  _leftRotate(node) {
    var parent = node.parent;
    var bro = parent.left;
    var grandp = parent.parent;
    //连接根的上层节点
    if (grandp) {
      if (grandp.left === parent) {
        grandp.left = node;
        node.parent = grandp;
      } else if(grandp.right === parent) {
        grandp.right = node;
        node.parent = grandp;
      }
    } else {
      this.root = node;
      node.parent = null;     
    }
    var tmp = node.left;
    node.left = parent;
    parent.parent = node;
    parent.right = tmp;
    if (tmp) {
      tmp.parent = parent;
    }
  }

  _getStatus(node) {
    if (node.parent.left === node && node.parent.parent.left === node.parent) {
      return LL;
    } else if (node.parent.right === node && node.parent.left === node.parent) {
      return LR;
    } else if (node.parent.right === node && node.parent.parent.right === node.parent) {
      return RR;
    } else if (node.parent.left === node && node.parent.parent.right === node.parent) {
      return RL;
    }
  }
} 

class TreeNode {
  constructor(value,color) {
    this.value = value;
    this.color = color;
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}