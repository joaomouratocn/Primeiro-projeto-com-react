import { useCallback, useEffect, useState } from "react";
import { Container, Form, SubmitButton, List, DeleteButton } from "./styled";
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from "react-icons/fa";
import api from "../../services/api";
import { Link } from "react-router-dom";

function Main() {
  const [newRepo, setNewRepo] = useState("");
  const [repository, setRepository] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const savedRepos = localStorage.getItem('repos')

    if (savedRepos) {
      setRepository(JSON.parse(savedRepos))
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('repos', JSON.stringify(repository))
  }, [repository]);

  const handlerOnSubmit = useCallback((e) => {
    e.preventDefault();

    async function submit() {
      setLoading(true)
      setAlert(null)
      try {
        if (newRepo === '') { throw new Error("Favor indicar um repositório!") }

        const hasRepo = repository.find(repo => repo.name == newRepo)

        if (hasRepo) { throw new Error("Já existe este repositório na sua lista") }

        //const response = await api.get(`repos/${newRepo}`);

        const data = { name: newRepo };

        setRepository([...repository, data]);
        setNewRepo("");
      }
      catch (error) {
        setAlert(true);
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    submit();
  }, [newRepo, repository])

  function handlerInputChange(e) {
    setNewRepo(e.target.value);
    setAlert(null)
  }

  const handleDelete = useCallback((repo) => {
    const find = repository.filter(r => r.name !== repo.name)
    setRepository(find);
  }, [repository])

  return (
    <Container>
      <h1>
        <FaGithub size={25} />
        Meus repositórios
      </h1>

      <Form onSubmit={handlerOnSubmit} error={alert}>
        <input
          type="text"
          value={newRepo}
          onChange={(e) => handlerInputChange(e)}
          placeholder="Adicionar Repositórios"
        />

        <SubmitButton loading={loading ? 1 : 0}>
          {
            loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )
          }
        </SubmitButton>
      </Form>

      <List>
        {repository.map(repo => (
          <li key={repo.name}>
            <span>
              <DeleteButton onClick={() => handleDelete(repo)}>
                <FaTrash size={14} />
              </DeleteButton>
              {repo.name}
            </span>
            <Link to={`/repository/${encodeURIComponent(repo.name)}`}><FaBars size={20} /></Link>
          </li>
        ))}
      </List>
    </Container>
  );
}

export default Main;
