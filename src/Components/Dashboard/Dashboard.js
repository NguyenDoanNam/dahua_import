import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import SheetJSFT from "../Misc/UploadTypes";
import XLSX from "xlsx";
import MakeColumns from "../Misc/MakeColumns";

class Dashboard extends Component {
  state = {
    uploadRawFiles: [],
    uploadConvertFiles: [],
    functionName: "",
  };

  handleChange = (event) => {
    const files = event.target.files;
    console.info(files);
    let uploadRawFiles = [];
    if (files) {
      for (let i = 0; i < files.length; i++) {
        if (files[i]) {
          let file = {
            name: files[i].name,
            content: files[i],
          };
          uploadRawFiles.push(file);
        }
      }
      this.setState({ uploadRawFiles: uploadRawFiles, functionName: "upload" });
    }
  };

  handleView = () => {
    const uploadRawFiles = this.state.uploadRawFiles;

    if (uploadRawFiles && uploadRawFiles.length > 0) {
      let uploadConvertFiles = [];
      for (let i = 0; i < uploadRawFiles.length; i++) {
        let uploadRawFile = uploadRawFiles[i];
        let contentFile = [];
        let reader = new FileReader();
        let rABS = !!reader.readAsBinaryString;

        reader.onload = (e) => {
          /* Parse data */
          let bstr = e.target.result;
          let wb = XLSX.read(bstr, {
            type: rABS ? "binary" : "array",
            bookVBA: true,
          });
          /* Get first worksheet */

          for (let j = 0; j < wb.SheetNames.length; j++) {
            let wsname = wb.SheetNames[j];
            let ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            let data = XLSX.utils.sheet_to_json(ws);

            contentFile.push({
              sheetName: wsname,
              contentSheet: data,
              columns: MakeColumns(ws["!ref"]),
            });
          }

          uploadConvertFiles.push({
            fileName: uploadRawFile.name,
            contentFile: contentFile,
          });
          this.setState({
            uploadConvertFiles: uploadConvertFiles,
          });
        };

        if (rABS) {
          reader.readAsBinaryString(uploadRawFile.content);
        } else {
          reader.readAsArrayBuffer(uploadRawFile.content);
        }
      }
    }
  };

  displayInputTable = () => {
    const uploadData = this.state.uploadConvertFiles;
    console.log("in ra uploadData");
    console.info(uploadData);
    console.info(uploadData[0]);

    return <div>{uploadData && uploadData.map((file) => file.fileName)}</div>;
  };

  handleProcess = () => {
    console.info(this.state.uploadConvertFiles);
  };

  render() {
    return (
      <div>
        <div>Upload file excel</div>
        <input
          accept={SheetJSFT}
          id="contained-button-file"
          multiple
          type="file"
          onChange={this.handleChange}
          hidden={true}
        />
        <div>
          <label htmlFor="contained-button-file">
            <Button variant="contained" color="primary" component="span">
              Upload
            </Button>
          </label>
        </div>
        <div>
          <Button
            variant="contained"
            color="primary"
            component="span"
            onClick={this.handleView}
          >
            View
          </Button>
        </div>
        <div>
          <Button
            variant="contained"
            color="primary"
            component="span"
            onClick={this.handleProcess}
          >
            Process
          </Button>
        </div>
        <div>{this.displayInputTable()}</div>
      </div>
    );
  }
}

export default Dashboard;
