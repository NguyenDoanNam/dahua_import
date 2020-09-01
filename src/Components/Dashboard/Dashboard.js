import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import SheetJSFT from "../Misc/UploadTypes";
import XLSX from "xlsx";
import CustomizedTables from "../Tables/CustomizedTables";
import MdbTable from "../Tables/MDBTable";

class Dashboard extends Component {
  state = {
    uploadRawFiles: [],
    uploadConvertFiles: [],
    functionName: "",
    dataTables: null,
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
              let data = XLSX.utils.sheet_to_json(ws, {
                header: 1,
                defval: "",
              });

              let dataJson = XLSX.utils.sheet_to_json(ws);

              contentFile.push({
                sheetName: wsname,
                columns: data[0],
                contentSheet: data.slice(1),
                contentSheetJson: dataJson,
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
    }
  };

  handleView = () => {
    const uploadData = this.state.uploadConvertFiles;
    let dataTables = [];

    if (uploadData != null && !uploadData.isEmpty && uploadData.length > 0) {
      for (let i = 0; i < uploadData.length; i++) {
        if (uploadData[i].contentFile != null) {
          for (let j = 0; j < uploadData[i].contentFile.length; j++) {
            let dataTable = {
              key: "File" + i + "Sheet" + j,
              tableName:
                uploadData[i].fileName +
                " - " +
                uploadData[i].contentFile[j].sheetName,
              tableRows: uploadData[i].contentFile[j].contentSheet,
              tableColumns: uploadData[i].contentFile[j].columns,
              tableRowsJson: uploadData[i].contentFile[j].contentSheetJson,
              dataTableJSON: {
                columns: [
                  {
                    label: "STT",
                    field: "STT",
                    sort: "asc",
                    width: 100,
                  },
                  {
                    label: "Hang Nhap",
                    field: "Hang Nhap",
                    sort: "asc",
                    width: 100,
                  },
                  {
                    label: "Hang Ra",
                    field: "Hang Ra",
                    sort: "asc",
                    width: 100,
                  },
                  {
                    label: "Hang Con",
                    field: "Hang Con",
                    sort: "asc",
                    width: 100,
                  },
                ],
                rows: uploadData[i].contentFile[j].contentSheetJson,
              },
            };
            dataTables.push(dataTable);
          }
        }
      }
      this.setState({ dataTables: dataTables });
      console.log(dataTables);
    }
  };

  displayInputTable = () => {
    let dataTables = this.state.dataTables;

    return dataTables.map((dataTable, i) => (
      <div key={i}>
        <CustomizedTables key={dataTable.key} dataTable={dataTable} />
        <br />
        <MdbTable dataTable={dataTable.dataTableJSON} />
      </div>
    ));
  };

  handleProcess = () => {};

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
        <div>
          {this.state.dataTables != null ? this.displayInputTable() : ""}
        </div>
      </div>
    );
  }
}

export default Dashboard;
