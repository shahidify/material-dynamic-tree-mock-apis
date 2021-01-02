import React, { useState, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";

const useStyles = makeStyles({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400
  }
});

const data = [
  {
    id: "100-A1",
    name: "A1",
    isLeaf: false,
    children: [
      {
        id: "110-A1.1",
        name: "A1.1",
        isLeaf: false,
        children: [
          { id: "111-A1.1.1", name: "A1.1.1", isLeaf: false, children: [] },
          { id: "112-A1.1.2", name: "A1.1.2", isLeaf: true },
          { id: "113-A1.1.3", name: "A1.1.3", isLeaf: false, children: [] }
        ]
      },
      {
        id: "120-A1.2",
        name: "A1.2",
        isLeaf: false,
        children: [
          { id: "121-A1.2.1", name: "A1.2.1", isLeaf: false, children: [] },
          { id: "122-A1.2.2", name: "A1.2.2", isLeaf: true, children: [] },
          { id: "123-A1.2.3", name: "A1.2.3", isLeaf: true, children: [] }
        ]
      }
    ]
  },
  {
    id: "200-A2",
    name: "A2",
    isLeaf: false,
    children: [
      {
        id: "210-A2.1",
        name: "A2.1",
        children: [
          { id: "211-A2.1.1", name: "A2.1.1", isLeaf: false, children: [] },
          { id: "212-A2.1.2", name: "A2.1.2", isLeaf: true },
          { id: "213-A2.1.3", name: "A2.1.3", isLeaf: true }
        ]
      }
    ]
  },
  {
    id: "300-A3",
    name: "A3",
    isLeaf: false,
    children: []
  }
];

function updateTreeData(list, key, children) {
  return list.map((node) => {
    // TODO:
    // Identify which node is expanded and add children on it
    if (node.id === key[0]) {
      return { ...node, children };
    } else if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children)
      };
    }
    return node;
  });
}

export default function TreeNavigator() {
  const classes = useStyles();
  const [treeData, setTreeData] = useState(data);
  const [expanded, setExpanded] = useState([]);

  // const handleToggle = (event, nodeIds) => {
  //   setExpanded(nodeIds);
  // };
  function shouldCallApi(list, key, flag) {
    // check if an api call is needed
    for (const node of list) {
      // list.map((node) => {
      if (node.id === key[0]) {
        console.log("node id and key[0] are equal");
        console.log("check if node has children");
        debugger;
        if (node.children && node.children.length > 0) {
          flag = false;
          break;
          return flag;
        }
        return;
      } else if (node.children) {
        console.log("go deep to match node");
        shouldCallApi(node.children, key, true);
      }
    }
    return flag;
  }

  function onLoadData(e, key, ...props) {
    console.log(key, props, e);
    debugger;

    const flag = shouldCallApi(treeData, key, true);
    console.log("shouldCallApi -- ", flag);
    if (!flag) {
      return;
    } else {
      return fetch("/api/treedata")
        .then((res) => res.json())
        .then((json) => {
          const newTreeData = updateTreeData(treeData, key, json.data);
          setTreeData(newTreeData);
        });
    }

    // return new Promise((resolve) => {
    //   // debugger;
    //   if (props.children) {
    //     resolve();
    //     return;
    //   }
    //   setTimeout(() => {
    //     // Call API for new Data instead of setTimeout
    //     debugger;

    //     const newTreeData = updateTreeData(treeData, key, [
    //       {
    //         name: "1-Child Node",
    //         key: `${key}-10`,
    //         id: `${key}-10`
    //       },
    //       {
    //         name: "2-Child Node",
    //         key: `${key}-11`,
    //         id: `${key}-11`
    //       }
    //     ]);
    //     setTreeData(newTreeData);
    //     resolve();
    //   }, 500);
    // });
  }

  const getHandleLabelClick = useCallback(
    (nodeId) => (event) => {
      console.log(event);
      console.log("LabelClick - ", nodeId, event);
      //event.preventDefault();
    },
    []
  );

  const renderTree = useCallback(
    (items) =>
      items.map((item) => (
        <TreeItem
          key={item.id}
          nodeId={item.id.toString()}
          onLabelClick={getHandleLabelClick}
          label={<div>{<>{item.name}</>}</div>}
        >
          {item.children != null
            ? renderTree(item.children)
            : item.isLeaf
            ? null
            : " "}
        </TreeItem>
      )),
    []
  );

  return (
    <TreeView
      className={classes.root}
      // defaultExpanded={["1"]}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      onNodeToggle={onLoadData}
    >
      {renderTree(treeData)}
    </TreeView>
  );
}
