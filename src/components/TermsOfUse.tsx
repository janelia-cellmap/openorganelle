import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Document, Page } from "react-pdf";

export default function TermsOfUse() {
  const [page, setPage] = useState(1);
  const [numPages, setNumPages] = useState(0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <>
      <Typography variant="h3" gutterBottom style={{ textAlign: "center" }}>
        Terms of Use
      </Typography>

      <div className="pagecontrols" style={{width: "350px", margin: "auto", textAlign: "center"}}>
        <Button variant="outlined" disabled={page - 1 < 1} onClick={() => setPage(page - 1 >= 1 ? page - 1 : page)}>
          &laquo; previous
        </Button>
        <span style={{margin: "0 2em"}}>
          Page {page} of {numPages}
        </span>
        <Button variant="outlined" disabled={page + 1 > numPages} onClick={() => setPage(page + 1 <= numPages ? page + 1 : page)}>
          next &raquo;
        </Button>
      </div>


      <Paper style={{margin: "auto"}}>
        <Document
          file="/openorganelle_terms_of_use.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page pageNumber={page} width={1000} />
        </Document>
      </Paper>
    </>
  );
}
