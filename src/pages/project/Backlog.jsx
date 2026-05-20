import React, { useState } from 'react';
import s from '../../styles/Profile.module.css';

import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/TopBar';


import FilterBar from '../../components/backlog/FilterBar';
import SprintBlock from '../../components/backlog/SprintBlock';
import { initialSprints, initialTasks } from '../../data/projectsMockData';

import { taskService } from '../../services/taskService';

import '../../styles/Backlog.css';

export default function Backlog() {
    //  STATES DE LA NAVIGATION
    const [activeNav, setActiveNav] = useState("projets");
    const [collapsed, setCollapsed] = useState(false);

    //  STATES DE LA DATA
    const [sprints] = useState(initialSprints);


    const [tasks, setTasks] = useState(initialTasks);

    // STATES DES FILTRES
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('Toutes');

    //   Filtrage:
    // recalculer la liste des tâches à chaque fois qu'on tape dans la recherche ou qu'on clique sur un chip
    const filteredTasks = tasks.filter(task => {
        // Vérifier la recherche textuelle
        const matchesSearch =
            task.title.toLowerCase().includes(search.toLowerCase()) ||
            task.id.toLowerCase().includes(search.toLowerCase());

        // Vérifier les chips (Feature, Bug, Tech)
        let matchesType = true;
        if (activeFilter !== 'Toutes') {
            // On regarde si au moins un des tags de la tâche correspond au filtre actif
            matchesType = task.tags && task.tags.some(tag => tag.toLowerCase() === activeFilter.toLowerCase());
        }

        // La tâche est conservée seulement si elle passe les deux filtres
        return matchesSearch && matchesType;
    });

    const handleAddStory = async (sprintId) => {
        const title = window.prompt("Entrez le titre du nouveau ticket :");
        if (!title || title.trim() === "") return;

        try {
            // 1. On délègue le travail au Service ! (On attend la réponse du "serveur")
            const newTask = await taskService.createTask(title, sprintId);

            // 2. Une fois que le serveur a répondu OK, on met à jour l'interface React
            setTasks([...tasks, newTask]);

        } catch (error) {
            console.error("Erreur lors de la création du ticket :", error);
            alert("Impossible de créer le ticket. Veuillez réessayer.");
        }
    };

    return (
        <div className="app-shell">

            {/* --- SIDEBAR --- */}
            <Sidebar
                activeNav={activeNav}
                onNavChange={setActiveNav}
                collapsed={collapsed}
                onToggle={() => setCollapsed(!collapsed)}
            />

            {/* --- ZONE PRINCIPALE --- */}
            <div className={`${s.mainArea} ${collapsed ? s.sidebarCollapsed : ""}`}>

                {/* TOPBAR */}
                <TopBar />

                {/* CONTENU DU BACKLOG */}
                <div className={s.pageContent} style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 56px)' }}>

                    <h1 style={{ fontSize: '20px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                        Backlog
                    </h1>

                    {/* BARRE DE FILTRES */}
                    <FilterBar
                        search={search}
                        onSearch={setSearch}
                        activeFilter={activeFilter}
                        onFilter={setActiveFilter}
                    />

                    {/* LISTE DES SPRINTS */}
                    <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }} className="scroll">

                        {sprints.map(sprint => {
                            const sprintTasks = filteredTasks.filter(t => t.sprintId === sprint.id);

                            return (
                                <SprintBlock
                                    key={sprint.id}
                                    sprint={sprint}
                                    sprintTasks={sprintTasks}
                                    onAddStory={handleAddStory}
                                />
                            );
                        })}

                    </div>
                </div>
            </div>
        </div>
    );
}