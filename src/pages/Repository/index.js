import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useParams } from "react-router-dom";
import { Container, Owner, Loading, BackButton, IssuesList, PageActions, FilterList } from "./styles";
import { FaArrowLeft } from 'react-icons/fa'

function Repository() {
    const { repository } = useParams();
    const [selectRepository, setRepository] = useState({})
    const [issues, setIssues] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [filterIndex, setFilterIndex] = useState(0)
    const [filters] = useState([
        { state: 'all', label: 'Todas', active: true },
        { state: 'open', label: 'Abertos', active: false },
        { state: 'closed', label: 'Fechados', active: false },
    ]);

    useEffect(() => {
        async function load() {
            const repoName = decodeURIComponent(repository);

            const [repoData, issuesData] = await Promise.all([
                api.get(`/repos/${repoName}`),
                api.get(`/repos/${repoName}/issues`, {
                    params:
                    {
                        state: filters.find(f => f.active).state,
                        per_page: 7
                    }
                }),
            ]);

            setRepository(repoData.data)
            setIssues(issuesData.data)
            setLoading(false)
        }

        load();
    }, [repository, filters]);

    useEffect(() => {
        async function loadIssue() {
            const repo = decodeURIComponent(repository);
            const response = await api.get(`/repos/${repo}/issues`,
                { params: { state: filters[filterIndex].state, page: page, per_page: 5 } })

            setIssues(response.data)
        }

        loadIssue();
    }, [repository, page, filters, filterIndex])

    function handlePage(action) {
        setPage(action === 'back' ? page - 1 : page + 1)
    }

    if (loading) {
        return (
            <Loading>
                <h1>Carregando....</h1>
            </Loading>
        )
    }

    function handleFilter(index) {
        setFilterIndex(index);
    }

    return (
        <Container>
            <BackButton to='/'>
                <FaArrowLeft color='#000' size={35} />
            </BackButton>
            <Owner>
                <img src={selectRepository.owner.avatar_url} alt={selectRepository.owner.login} />
                <h1>{selectRepository.name}</h1>
                <p>{selectRepository.description}</p>
            </Owner>
            <FilterList active={filterIndex}>
                {filters.map((filter, index) => (
                    <button
                        type='button'
                        key={filter.label}
                        onClick={() => handleFilter(index)}>
                        {filter.label}
                    </button>
                ))}
            </FilterList>
            <IssuesList>
                {issues.map(issue => (
                    <li key={String(issue.id)}>
                        <img src={issue.user.avatar_url} alt={issue.user.login} />
                        <div>
                            <strong>
                                <a href={issue.html_url}>{issue.title}</a>

                                {issue.labels.map(label => (
                                    <span key={String(label.id)}>{label.name}</span>
                                ))}
                            </strong>
                            <p>{issue.user.login}</p>
                        </div>
                    </li>
                ))}
            </IssuesList>
            <PageActions>
                <button
                    type='button'
                    onClick={() => handlePage('back')}
                    disabled={page < 2}
                >
                    Voltar
                </button>
                <button type='button' onClick={() => handlePage('next')}>
                    Proxima
                </button>
            </PageActions>
        </Container>
    )
}

export default Repository;