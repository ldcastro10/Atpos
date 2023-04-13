import Banda from "./banda";
import { FormattedMessage } from 'react-intl';
import Detail from "./detail"
import { Box, Flex, Text, Input, Button, Tag } from "@chakra-ui/react"

const { useEffect, useState } = require("react");

function Bandas() {
  const [bandas, setBandas] = useState([]);
  const [años, setAños] = useState(0);
  const [bandaAntigua, setBandaAntigua] = useState("banda");
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (!navigator.onLine) {
      if (localStorage.getItem("bandas") === null) {
        setBandas("Loading...")
      } else {
        setBandas(localStorage.getItem("bandas"));
      }
    } else {
      const URL =
        "https://gist.githubusercontent.com/josejbocanegra/806a4dcd1af61b4cc498d24c52e84320/raw/8711b7af9091d2831ed043563cad2a61311b0a5f/music-bands.json";
      fetch(URL)
        .then((data) => data.json())
        .then((data) => {
          let elviejo = 2022
          let elviejoNombre = "Ninguna"
          data.forEach(element => {
            if (elviejo > Number(element.foundation_year)) {
              elviejo = Number(element.foundation_year)
              elviejoNombre = element.name
            }
          });
          setBandaAntigua(elviejoNombre)
          setAños(elviejo)
          setBandas(data);
          setSelected(data[0])
          localStorage.setItem("bandas", data);
        });
    }
  }, []);

  const handleCheck = (banda) => {
    setSelected(banda)
  }

  return (
    <div>
      <Flex justifyContent={"center"}>
        <section>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">
                  <FormattedMessage id="Nombre" />
                </th>
                <th scope="col">
                  <FormattedMessage id="Pais" />
                </th>
                <th scope="col">
                  <FormattedMessage id="Genero" />
                </th>
                <th scope="col">
                  <FormattedMessage id="Fundacion" />
                </th>
              </tr>
            </thead>
            <tbody>
              {bandas.map((e, i) => (
                <Banda key={i} handleCheck={handleCheck} banda={e} />
              ))}
            </tbody>
            <p>
              <FormattedMessage id="TextoLargo" />
              {bandaAntigua}
              <FormattedMessage id="TextoLargo2" />
              {años}
              <FormattedMessage id="TextoLargo3" />
            </p>
          </table>
        </section>
        <section>
          <Box p={4}></Box>
        </section>
        <section>
          <Detail selected={selected}></Detail>
        </section>
      </Flex>
    </div>
  );
}

export default Bandas;