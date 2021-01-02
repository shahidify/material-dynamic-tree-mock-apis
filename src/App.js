import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import { Formik } from "formik";
import { FormControlLabel, Checkbox } from "@material-ui/core";
import FolderIcon from "@material-ui/icons/FolderOpenTwoTone";
import FileCopyIcon from "@material-ui/icons/FileCopy";

const initialValues = {};

const data = {
  id: "root",
  uuid: "1000",
  name: "First Level Folder",
  type: "folder",
  hasChildren: true,
  children: [
    {
      id: "level-1",
      uuid: "1100",
      name: "Second Level Folder",
      type: "folder",
      hasChildren: true,
      children: [
        {
          id: "level-1-1",
          uuid: "1110",
          name: "Third Level Folder",
          type: "folder",
          hasChildren: true,
          children: [
            {
              id: "file-level-1-1",
              uuid: "1111",
              name: "file-1",
              type: "file",
              hasChildren: false
            },
            {
              id: "file-level-1-2",
              uuid: "1112",
              name: "file-2",
              type: "file",
              hasChildren: false
            },
            {
              id: "file-level-1-3",
              uuid: "1113",
              name: "file-3",
              type: "file",
              hasChildren: false
            }
          ]
        }
      ]
    },
    {
      id: "level-2",
      uuid: "1200",
      name: "Folder 2",
      type: "folder",
      hasChildren: true,
      children: [
        {
          id: "level-2-1",
          uuid: "1210",
          name: "Folder 2-1",
          type: "folder",
          hasChildren: true,
          children: [
            {
              id: "file-level-2-1",
              uuid: "1211",
              name: "file-2-1",
              type: "file",
              hasChildren: false
            }
          ]
        }
      ]
    }
  ]
};

const useStyles = makeStyles({
  root: {
    height: 110,
    flexGrow: 1,
    maxWidth: 400
  }
});

const RecursiveTreeView = () => {
  const classes = useStyles();
  const [folder, setFolder] = useState("");
  const [files, setFiles] = useState([]);

  const renderTree = (nodes, onSelect) =>
    nodes.type === "file" ? (
      <>
        <FormControlLabel
          key={nodes.id}
          control={
            <Checkbox
              name="file"
              onChange={(e) => onSelect(nodes.name, e.target.checked)}
            />
          }
          label={
            <>
              <FileCopyIcon /> {nodes.name}
            </>
          }
        />
        <br />
      </>
    ) : (
      <TreeItem
        key={nodes.id}
        nodeId={nodes.id}
        label={
          <div>
            {nodes.type === "folder" && (
              <>
                <ClosedFolder /> {nodes.name}
              </>
            )}
          </div>
        }
        onLabelClick={() => {
          // check for children
          // Get data from API
          onSelect(nodes.type, nodes.name);
          switch (nodes.type) {
            case "folder":
              setFolder(nodes.name);
              break;
            case "file":
              let newFiles = files;
              newFiles.push(nodes.name);
              setFiles(newFiles);
              break;
            default:
              break;
          }
        }}
        onIconClick={() => onSelect(nodes.type, nodes.name)}
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node) => renderTree(node, onSelect))
          : null}
      </TreeItem>
    );

  initialValues["folder"] = data.name;

  const handleToggle = (e, nodeIds) => {
    console.log("Expand", e.target);
    console.log("NodeIds", nodeIds);
  };

  return (
    <Formik className={classes.root} initialValues={initialValues}>
      {(props) => (
        <>
          <Tree
            data={data}
            setFieldValue={props.setFieldValue}
            renderTree={renderTree}
            handleToggle={handleToggle}
          />
          <pre>{JSON.stringify(props.values, null, 2)}</pre>
        </>
      )}
    </Formik>
  );
};

export default RecursiveTreeView;

const Tree = (props) => {
  const { handleToggle } = props;
  return (
    <>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpanded={["root"]}
        defaultExpandIcon={<ChevronRightIcon />}
        multiSelect
        onNodeToggle={handleToggle}
      >
        {props.renderTree(props.data, props.setFieldValue)}
      </TreeView>
      <pre style={{ marginTop: "50px", border: "1px solid #999" }}>
        {JSON.stringify(props.values, null, 2)}
      </pre>
    </>
  );
};

const ClosedFolder = () => {
  return <FolderIcon style={{ color: "#ffc800" }} />;
};
