import styled from "styled-components";

const StatusMessage = styled.div`
  ${props => props.status && `
    padding: 10px;
  `}
  ${props => !props.status && `
    visibility: hidden;
  `}
  border-radius: 5px;
  max-width: 400px;
  overflow: scroll;
  margin: 40px auto auto;
  background-color: ${props => props.status === `error` ? `#dc3545` : props.status === `info` ? `#7dd8ff` : `#4bb759`};
  color: #fff;
  line-height: 1.25;
`;

export default StatusMessage;
