import React, {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faCheck} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const Option = styled.div`
  padding: 10px;
  overflow-wrap: break-word;
  color: white;
  user-select: none;
  display: flex;
  &:hover {
    background-color: #1772fb;
  }
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
