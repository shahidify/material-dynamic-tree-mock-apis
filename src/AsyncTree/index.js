import React, { useState, useCallback } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import FolderIcon from "@material-ui/icons/Folder";
import SettingsIcon from "@material-ui/icons/Settings";
import DescriptionIcon from "@material-ui/icons/Description";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  makeStyles,
  ThemeProvider,
  createMuiTheme
} from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import pink from "@material-ui/core/colors/pink";
import superagent from "superagent";
import Tree from "material-ui-tree";
import getNodeDataByPath from "material-ui-tree/lib/util";

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: {
      light: "#ff79b0",
      main: pink.A200,
      dark: "#c60055",
      contrastText: "#fff"
    }
  }
});

const useStyles = makeStyles({
  container: {
    margin: 20
  },
  icon: {
    fontSize: 20
  },
  node: {
    display: "flex",
    alignContent: "center"
  }
});

const AsyncTree = () => {
  const classes = useStyles();
  const [treeState, setTreeState] = useState({
    alignRight: false,
    data: {
      path: "material-ui-tree",
      type: "tree",
      sha: "b3d36479a033ed6296c34fdf689d5cdbcf7a0136",
      url:
        "https://api.github.com/repos/shallinta/material-ui-tree/git/trees/next"
    }
  });

  const renderLabel = useCallback(
    (data, unfoldStatus) => {
      const { path, type } = data;
      let variant = "body1";
      let iconComp = null;
      if (type === "tree") {
        iconComp = unfoldStatus ? <FolderOpenIcon /> : <FolderIcon />;
      }
      if (type === "blob") {
        variant = "body2";
        if (path.startsWith(".") || path.includes("config")) {
          iconComp = <SettingsIcon />;
        } else if (path.endsWith(".js")) {
          iconComp = <DescriptionIcon />;
        } else {
          iconComp = <InsertDriveFileIcon />;
        }
      }
      return (
        iconComp && (
          <Typography variant={variant} className={classes.node}>
            {React.cloneElement(iconComp, { className: classes.icon })}
            {path}
          </Typography>
        )
      );
    },
    [classes]
  );

  const requestChildrenData = useCallback(
    (data, path, toggleFoldStatus) => {
      const { url, type } = data;
      if (type === "tree") {
        superagent.get(url).then(({ body: res }) => {
          if (res && res.tree) {
            const treeData = Object.assign({}, treeState.data);
            getNodeDataByPath(treeData, path, "tree").tree = res.tree;
            setTreeState({
              ...treeState,
              data: treeData
            });
            toggleFoldStatus();
          } else {
            toggleFoldStatus();
          }
        });
      } else {
        toggleFoldStatus();
      }
    },
    [treeState, setTreeState]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Tree
        className={classes.container}
        title="Material UI Tree"
        data={treeState.data}
        labelKey="path"
        valueKey="sha"
        childrenKey="tree"
        foldIcon={<ArrowDropDownIcon />}
        unfoldIcon={<ArrowDropUpIcon />}
        loadMoreIcon={<MoreHorizIcon />}
        renderLabel={renderLabel}
        renderLoadMoreText={(page, pageSize, total) =>
          `Loaded: ${
            (page + 1) * pageSize
          } / Total: ${total}. Click here to load more...`
        }
        pageSize={10}
        actionsAlignRight={treeState.alignRight}
        requestChildrenData={requestChildrenData}
      />
    </ThemeProvider>
  );
};

export default AsyncTree;
// ReactDOM.render(<App />, document.querySelector("#root"));
