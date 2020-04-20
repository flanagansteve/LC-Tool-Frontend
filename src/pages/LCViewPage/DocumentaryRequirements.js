import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight } from "@fortawesome/free-solid-svg-icons";

import { makeAPIRequest, postFile } from '../../utils/api';
import Panel from './Panel';
import Button from '../../components/ui/Button';

const DocumentaryEntryFlex = styled.div`
  display: flex;
  align-items: center;
  > :nth-child(1) {
    min-width: 60%;
  }
  > :nth-child(2) {
    min-width: 20%;
  }
  > :nth-child(3) {
    min-width: 20%;
  }
  ${props => props.clickable && `cursor: pointer;`}
`

const DocumentaryEntryWrapper = styled.div`
  border-bottom: 1px solid #cdcdcd;
`

const DocReqTitle = styled.div`
  font-weight: 500;
  font-size: 24px;
  margin-bottom: 20px;
  margin-top: 5px;
  display: flex;
  align-items: center;
`

const DocReqDate = styled.div`
  font-size: 14px;

`

const DocReqStatus = styled.div`
  font-size: 14px;
  font-weight: 500;
`

const ExpandedDocumentaryEntry = styled.div`
  padding-bottom: 10px;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.5;
`

const FileUpload = styled.label`
  padding: 5px 10px;
  border: 1px solid #dcdcdc;
  max-width: 70%;
  cursor: pointer;
`

const DocumentaryEntryEvaluation = styled.div`
  display: flex;
  margin-top: 10px;

  > :not(:last-child) {
    margin-right: 10px;
  }
`

const SmallHeader = styled.div`
  font-size: 12px;
  min-width: 150px;
  margin-right: 50px;
`

const DocumentaryRequirement = ({ documentaryRequirement: docReq, lcid, userType, status, live, refreshLc, ...props }) => {
  const { docName: title, dueDate, linkToSubmittedDoc, id, requiredValues, rejected } = docReq;
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState('');

  const uploadFile = (file) => {
    if (!file) {
      console.error('No file found.');
      return;
    }
    postFile(`/lc/${lcid}/doc_req/${id}/`, file)
      .then(() => refreshLc());
  }

  const approve = () => {
    makeAPIRequest(`/lc/${lcid}/doc_req/${id}/evaluate/`, 'POST', {
      approve: true, complaints: comments,
    }).then(() => refreshLc());
  }

  const reject = () => {
    makeAPIRequest(`/lc/${lcid}/doc_req/${id}/evaluate/`, 'POST', {
      approve: false, complaints: comments,
    }).then(() => refreshLc());
  }

  return (
    <DocumentaryEntryWrapper>
    <DocumentaryEntryFlex clickable onClick={() => setExpanded(e => !e)} {...props}>
      <DocReqTitle style={{ margin: "15px 0" }}>
        {title}
          <FontAwesomeIcon
            icon={expanded ? faChevronDown : faChevronRight}
            style={{color: 'rgb(27, 108, 255)', marginLeft: '10px'}}
            />
      </DocReqTitle>
      <DocReqDate>{dueDate}</DocReqDate>
      <DocReqStatus>{status}</DocReqStatus>
    </DocumentaryEntryFlex>
    {expanded && <ExpandedDocumentaryEntry>
    <DocumentaryEntryFlex>
    <div>
      Required Values: {requiredValues}
    </div>
    <div>
      {linkToSubmittedDoc && <div>
        File: <a href={linkToSubmittedDoc}>order.pdf</a>
      </div>}
      {live && status !== "Approved" && (!linkToSubmittedDoc || rejected) && (
        <>
        <div style={{display: 'flex', flexDirection: 'column'}}>
        <FileUpload>
            Upload File
            <input type="file" onChange={e => uploadFile(e.target.files[0])} style={{display: 'none'}}/>
        </FileUpload>
        </div>
        </>
      )}
    </div>
    </DocumentaryEntryFlex>
    {live && userType === 'issuer' && status !== "Approved" && !rejected && linkToSubmittedDoc &&
      <DocumentaryEntryEvaluation>
        <Button onClick={approve}>Approve</Button>
        <Button onClick={reject}>Reject</Button>
        <div>
          <SmallHeader>Comments</SmallHeader>
          <input type="text" value={comments} onChange={(e) => setComments(e.target.value)}/>
        </div>
      </DocumentaryEntryEvaluation>
    }
    </ExpandedDocumentaryEntry>}
    </DocumentaryEntryWrapper>
  )
}

const DocumentaryRequirements = ({ lc, userType, live, refreshLc }) => {
  const docReqs = lc.documentaryrequirementSet;
  return (
    <Panel title="Documentary Requirements">
      <DocumentaryEntryFlex>
        <SmallHeader style={{margin: "0"}}>Document Title</SmallHeader>
        <SmallHeader style={{margin: "0"}}>Recieve By</SmallHeader>
        <SmallHeader style={{margin: "0"}}>Status</SmallHeader>
      </DocumentaryEntryFlex>
      {docReqs ? docReqs.map(d =>
        <DocumentaryRequirement
          documentaryRequirement={d}
          status={d.satisfied ? "Approved" : d.rejected ? "Rejected" : d.linkToSubmittedDoc ? "Pending" : "Incomplete"}
          lcid={lc.id}
          live={live}
          userType={userType}
          refreshLc={refreshLc}
          key={d.docName}/>
        ) : (
          <div style={{ marginTop: "10px", fontStyle: "italic", fontWeight: "300"}}>
            There are no documentary requirements for this LC.
          </div>
        )
      }

    </Panel>
  );
}

export default DocumentaryRequirements;