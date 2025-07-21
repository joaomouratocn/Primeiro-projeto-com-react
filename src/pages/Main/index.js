import { useState } from "react";
import { Container, Form, SubmitButton } from "./styled";
import { FaGithub, FaPlus } from "react-icons/fa";
import api from "../../services/api";

function Main() {
  const [newRepo, setNewRepo] = useState("");
  const [respositories, setRepositories] = useState([]);

  async function handlerOnSubmit(e) {
    e.preventDefault();

    const response = await api.get(`repos/${newRepo}`);

    const repoName = { name: response.data.full_name };

    setRepositories([...respositories, repoName]);

    console.log(respositories);
  }

  function handlerInputChange(e) {
    setNewRepo(e.target.value);
  }

  return (
    <Container>
      <h1>
        <FaGithub size={25} />
        Meus repositórios
      </h1>

      <Form onSubmit={(e) => handlerOnSubmit(e)}>
        <input
          type="text"
          value={newRepo}
          onChange={(e) => handlerInputChange(e)}
          placeholder="Adicionar Repositórios"
        />

        <SubmitButton>
          <FaPlus color="#FFF" size={14} />
        </SubmitButton>
      </Form>
    </Container>
  );
}

export default Main;
