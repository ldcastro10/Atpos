import React from "react";
import { Button } from "react-bootstrap";


const Banda = (props) => {
  return (
    <tr>
      <th scope="row">{props.banda.id}</th>
      <td>
        <Button onClick={() => props.handleCheck(props.banda)}>{props.banda.name}</Button>
      </td>
      <td>{props.banda.country}</td>
      <td>{props.banda.genre}</td>
      <td>{props.banda.foundation_year}</td>
    </tr>
  );
};

export default Banda;
