import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronRight, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const BasicView = styled.div`
  border: 1px solid #dfdfdf;
  background-color: #fff;
  border-radius: 0 0 20px 20px;
  margin-bottom: 30px;
`

const PanelTitle = styled.h2`
  background-color: ${(props) => props.highlight ? `rgb(27, 108, 255)` : `rgb(199, 222, 255)`};
  border-bottom: 1px solid #dfdfdf;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  ${(props) => props.clickable && `
    cursor: pointer;
  `}
  ${(props) => props.highlight && `
    font-weight: 500;
    color: #fff;
  `}
`

const PanelBody = styled.div`
  padding: 15px 20px;
  line-height: 1.25;
`

const PanelTitleAlt = styled.div`
  color: rgb(27, 108, 255);
  margin-right: 5px;
`

const Panel = ({ title, children, highlight, expand, setExpand, editing, setEditing, canEdit, ...props }) => {
  const expandEnabled = [true, false].includes(expand);
  return (
    <BasicView {...props}>
      <PanelTitle highlight={highlight} clickable={expandEnabled}>
        {title}
        <div style={{ display: 'flex', alignItems: 'center' }}>
        {canEdit && (editing
          ? (
            <>
            <PanelTitleAlt>Editing</PanelTitleAlt>
            <span
              style={{fontStyle: 'italic', fontSize: '14px', color: '#555'}}
              onClick={() => setEditing(false)}
              >Cancel</span>
            </>
          )
          : <FontAwesomeIcon
            icon={faPencilAlt}
            onClick={() => setEditing(true)}
            style={{
              color: 'rgb(27, 108, 255)',
            }}
            />
        )}
        {expandEnabled &&
          <FontAwesomeIcon
            icon={expand ? faChevronDown : faChevronRight}
            onClick={() => setExpand(e => !e)}
            style={{
              color: 'rgb(27, 108, 255)',
              padding: '0 10px'
            }}
            />
        }
        </div>
      </PanelTitle>
      <PanelBody>{children}</PanelBody>
    </BasicView>
  )
}

export default Panel;