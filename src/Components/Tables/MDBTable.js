import React from 'react';
import { MDBDataTable } from "mdbreact";

const MdbTable = ({ dataTable }) => {
    return (
        <div>
            <MDBDataTable striped bordered hover data={dataTable} />
        </div>
    );
};

export default MdbTable;