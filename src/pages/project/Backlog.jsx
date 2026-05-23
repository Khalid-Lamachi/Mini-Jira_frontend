<<<<<<< Updated upstream
import React, { useState } from 'react';
import s from '../../styles/Profile.module.css';

import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/TopBar';


import FilterBar from '../../components/backlog/FilterBar';
import SprintBlock from '../../components/backlog/SprintBlock';
import { initialSprints, initialTasks } from '../../data/projectsMockData';

import { taskService } from '../../services/taskService';

import '../../styles/Backlog.css';
=======
import React, { useState } from "react";
import ProjectLayout from "../../components/layout/ProjectLayout";
import FilterBar from "../../components/backlog/FilterBar";
import SprintBlock from "../../components/backlog/SprintBlock";
import { initialSprints, initialTasks } from "../../data/projectsMockData";
import { taskService } from "../../services/taskService";

import "../../styles/Backlog.css";
>>>>>>> Stashed changes

export default function Backlog() {
  const [activeTab, setActiveTab] = useState("backlog");

<<<<<<< Updated upstream
    //  STATES DE LA DATA
    const [sprints] = useState(initialSprints);


    const [tasks, setTasks] = useState(initialTasks);
=======
  //  STATES DE LA DATA
  const [sprints] = useState(initialSprints);
  const [tasks, setTasks] = useState(initialTasks);
>>>>>>> Stashed changes

  // LOGIQUE METIER (Simule Backend via Service)
  const handleAddTask = async (sprintId, title) => {
    try {
      const newTask = await taskService.createTask(sprintId, title);
      setTasks(prevTasks => [...prevTasks, newTask]);
    } catch (error) {
      console.error("Erreur lors de la création de la tâche", error);
    }
  };

  const handleTagChange = async (taskId, newTag, tagIndex) => {
    try {
      await taskService.updateTaskTag(taskId, newTag, tagIndex);
      setTasks(prevTasks => prevTasks.map(t => {
        if (t.id === taskId) {
          const newTags = [...(t.tags || [])];
          newTags[tagIndex] = newTag;
          return { ...t, tags: newTags };
        }
        return t;
      }));
    } catch (error) {
      console.error("Erreur lors de la modification du tag", error);
    }
  };

  // STATES DES FILTRES ET TRI
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Toutes");
  const [sortConfig, setSortConfig] = useState(null);

<<<<<<< Updated upstream
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
=======
  //   Filtrage:
  // recalculer la liste des tâches à chaque fois qu'on tape dans la recherche ou qu'on clique sur un chip
  const filteredTasks = tasks.filter((task) => {
    // Vérifier la recherche textuelle
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.id.toLowerCase().includes(search.toLowerCase());
>>>>>>> Stashed changes

    // Vérifier les chips (Feature, Bug, Tech)
    let matchesType = true;
    if (activeFilter !== "Toutes") {
      // On regarde si au moins un des tags de la tâche correspond au filtre actif
      matchesType =
        task.tags &&
        task.tags.some(
          (tag) => tag.toLowerCase() === activeFilter.toLowerCase(),
        );
    }

    // La tâche est conservée seulement si elle passe les deux filtres
    return matchesSearch && matchesType;
  });

  return (
    <ProjectLayout activeTab={activeTab} onTabChange={setActiveTab} projectName="Mini-Jira">
      {/* BARRE DE FILTRES */}
      <FilterBar
        search={search}
        onSearch={setSearch}
        activeFilter={activeFilter}
        onFilter={setActiveFilter}
        sortConfig={sortConfig}
        onSortChange={setSortConfig}
      />

      {/* EN-TÊTE ET ACTIONS DES SPRINTS */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <button className="btn-xs blue" style={{ padding: '6px 12px', fontSize: '12px' }}>
              + Créer un sprint
          </button>
      </div>

          {/* LISTE DES SPRINTS */}
          <div
            style={{ flex: 1, overflowY: "auto", paddingRight: "8px" }}
            className="scroll"
          >
            {sprints.map((sprint) => {
              const sprintTasks = filteredTasks.filter(
                (t) => t.sprintId === sprint.id,
              );

<<<<<<< Updated upstream
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
=======
              return (
                <SprintBlock
                  key={sprint.id}
                  sprint={sprint}
                  sprintTasks={sprintTasks}
                  onAddTask={handleAddTask}
                  onTagChange={handleTagChange}
                />
              );
            })}
          </div>
    </ProjectLayout>
  );
}
>>>>>>> Stashed changes
