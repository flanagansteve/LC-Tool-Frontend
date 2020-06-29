import React, {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faCheck} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import {Field} from "formik";

const disabledBackgroundColor = `#c3c1c3`;
const disabledColor = `black`;

const Option = styled.div`
  padding: 10px;
  overflow-wrap: break-word;
  color: white;
  user-select: none;
  display: flex;
  ${props => props.highlighted && `background-color: #1772fb;`}
  &:hover {
    background-color: #1772fb;
  }
`;

const StyledFormInput = styled(Field)`
  margin-top: 10px;
  padding: 10px 0 5px;
  min-width: 100%;
  font-size: 16px;
  border: none;
  border-bottom: ${props => props.disabled ? `0px` : `1px solid #cdcdcd`};
  background-color: ${props => props.disabled ? disabledBackgroundColor : `#fff`};
  color: ${props => props.disabled ? disabledColor : `#000`};
`;

export const Dropdown = ({ items, onChange, selectedIndex }) => {
  const [menu, setMenu] = useState(false);

  return (
      <OutsideAlerter style={{position: "relative", flex: 1, flexDirection: "column"}} onOutsideClick={() => setMenu(false)}>
        <div>
          <div style={{display: "flex"}} onClick={() => setMenu(!menu)}>
            <div style={{borderRight: "1px solid #cdcdcd", padding: "10px", flex: 1, wordBreak: "break-word"}}>{items[selectedIndex]}</div>
            <div style={{width: "20px", alignSelf: "center", paddingLeft: "5px"}}>
              <FontAwesomeIcon
                  icon={faChevronDown}
                  size="lg"
                  color="#000"
              />
            </div>
          </div>
          {menu && <div style={{position: "absolute", width: "100%", backgroundColor: "black", maxHeight: "300px", overflowY: "scroll", zIndex: 1}}>
            {items.map(item => <Option key={item} onClick={() => {
              setMenu(false);
              onChange && onChange(item);
            }}><FontAwesomeIcon icon={faCheck} color={"#fff"} style={{width: "20px", visibility: items[selectedIndex] === item ? "visible" : "hidden"}}/>
            <div style={{flex: 1}}>{item}</div></Option>)}
          </div>}
        </div>
      </OutsideAlerter>
  )
};

export const SearchableSelect = ({ items, onSelect, questionKey, handleChange }) => {
  const [menu, setMenu] = useState(false);
  const [highlightedItemIndex, setHighlightedItemIndex] = useState(-1);

  useEffect(() => {
    setHighlightedItemIndex(-1);
  }, [items]);

  const onKeyDown = event => {
    if (event.keyCode === 40 && highlightedItemIndex + 1 < items.length) {
      event.preventDefault();
      setHighlightedItemIndex(highlightedItemIndex + 1);
    } else if (event.keyCode === 38 && highlightedItemIndex - 1 >= 0) {
      event.preventDefault();
      setHighlightedItemIndex(highlightedItemIndex - 1);
    } else if (event.keyCode === 13 && highlightedItemIndex > -1) {
      event.preventDefault();
      setMenu(false);
      onSelect(items[highlightedItemIndex]);
    }
  };

  const onChange = event => {
    setMenu(true);
    handleChange(event);
  };

  const onClick = item => {
    setMenu(false);
    onSelect && onSelect(item);
  };

  return (
      <OutsideAlerter style={{position: "relative", flex: 1, flexDirection: "column"}} onOutsideClick={() => setMenu(false)}>
        <div style={{display: "flex"}} onClick={() => setMenu(!menu)}>
          <StyledFormInput autoComplete={"off"} onChange={onChange} type={"text"} name={questionKey} onKeyDown={onKeyDown}/>
        </div>
        {menu && <div style={{
          position: "absolute",
          width: "100%",
          backgroundColor: "black",
          maxHeight: "300px",
          overflowY: "scroll",
          zIndex: 1}}>
          {items !== null ? items.map((item, itemIndex) =>
              <Option highlighted={highlightedItemIndex === itemIndex}
                      key={item.id} onMouseDown={() => onClick(item)}>
                <div style={{flex: 1}}>{item.name}</div></Option>) : <div></div>}
        </div>}
      </OutsideAlerter>
  )
};

export const SearchableSelectHTS = ({ items, onSelect, questionKey, handleChange }) => {
  const [menu, setMenu] = useState(false);
  const [highlightedItemIndex, setHighlightedItemIndex] = useState(-1);

  useEffect(() => {
    setHighlightedItemIndex(-1);
  }, [items]);

  const onKeyDown = event => {
    if (event.keyCode === 40 && highlightedItemIndex + 1 < items.length) {
      event.preventDefault();
      setHighlightedItemIndex(highlightedItemIndex + 1);
    } else if (event.keyCode === 38 && highlightedItemIndex - 1 >= 0) {
      event.preventDefault();
      setHighlightedItemIndex(highlightedItemIndex - 1);
    } else if (event.keyCode === 13 && highlightedItemIndex > -1) {
      event.preventDefault();
      setMenu(false);
      onSelect(items[highlightedItemIndex]);
    }
  };

  const onChange = event => {
    setMenu(true);
    handleChange(event);
  };

  const onClick = (hts, description) => {
    setMenu(false);
    onSelect && onSelect(hts, description);
  };

  return (
      <OutsideAlerter style={{position: "relative", flex: 1, flexDirection: "column"}} onOutsideClick={() => setMenu(false)}>
        <div style={{display: "flex"}} onClick={() => setMenu(!menu)}>
          <StyledFormInput autoComplete={"off"} onChange={onChange} type={"text"} name={questionKey} onKeyDown={onKeyDown}/>
        </div>
        {menu && <div style={{
          position: "absolute",
          width: "100%",
          backgroundColor: "white",
          maxHeight: "300px",
          overflowY: "scroll",
          zIndex: 1}}>
          {items !== null ? items.map((item, itemIndex) =>
              <Option highlighted={highlightedItemIndex === itemIndex}
                      key={item.id} onMouseDown={() => onClick(item.htsno, item.description)}>
                <div style={{flex: 1, color: "black"}}>{item.description}</div></Option>) : <div></div>}
        </div>}
      </OutsideAlerter>
  )
};

/**
 * Hook that alerts clicks outside of the passed ref
 */
const useOutsideAlerter = (ref, onOutsideClick) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutsideClick();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
};

/**
 * Component that alerts if you click outside of it
 */
export const OutsideAlerter = (props) => {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, props.onOutsideClick);

  return <div ref={wrapperRef} style={props.style}>{props.children}</div>;
};
