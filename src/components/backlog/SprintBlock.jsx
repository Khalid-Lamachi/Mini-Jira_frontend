import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import StoryRow from './StoryRow';

export default function SprintBlock({ sprint, sprintTasks, onAddTask, onTagChange, sortConfig }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isCreatingTask, setIsCreatingTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const handleCreateTask = (e) => {
        if (e.key === 'Enter' && newTaskTitle.trim()) {
            if (onAddTask) {
                onAddTask(sprint.id, newTaskTitle.trim());
            }
            setIsCreatingTask(false);
            setNewTaskTitle('');
        } else if (e.key === 'Escape') {
            setIsCreatingTask(false);
            setNewTaskTitle('');
        }
    };

    // status badge
    let badgeClass = 'b-planned';
    let statusLabel = 'Planifié';
    if (sprint.status === 'active') {
        badgeClass = 'b-active';
        statusLabel = 'Actif';
    } else if (sprint.status === 'done') {
        badgeClass = 'b-done';
        statusLabel = 'Terminé';
    }

    // LOGIQUE DES POINTS ET DE LA CAPACITÉ
    // 1. Somme des Story Points affectes a ce sprint
    const totalPoints = sprintTasks.reduce((sum, task) => sum + (task.points || 0), 0);

    // 2. Sommer les Story Points des tâches terminées uniquement
    const donePoints = sprintTasks
        .filter(task => task.status === 'done')
        .reduce((sum, task) => sum + (task.points || 0), 0);

    // 3. Remplir en pourcentage pour la jauge CSS
    const progressPercent = totalPoints === 0 ? 0 : Math.round((donePoints / totalPoints) * 100);

    return (
        <div className="sprint-block">

            {/* EN-TÊTE DU BLOC SPRINT */}
            <div className="sprint-head">
        <span
            className="chevron"
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)', display: 'inline-block' }}
        >
          ▼
        </span>

                <span className="sprint-title">{sprint.name}</span>

                {/* Format de date désiré : 11 mai -> 17 mai 2026 */}
                {sprint.startDate && sprint.endDate ? (
                    <span className="sprint-dates">{sprint.startDate} -> {sprint.endDate}</span>
                ) : (
                    sprint.id !== 'backlog' && <button className="btn-xs" style={{ marginLeft: 8 }}>Ajouter des dates</button>
                )}

                {/* Masquer le badge if conteneur de Backlog général */}
                {sprint.id !== 'backlog' && <span className={`badge ${badgeClass}`}>{statusLabel}</span>}

                {/* Affichage de la capacité au format souhaité (ex: 8/18 pts) */}
                <div className="sprint-stats">
                    <span className="stat"><span>{donePoints}</span>/{totalPoints} pts</span>
                    <div className="pbar-wrap">
                        <div className="pbar-bg">
                            <div className="pbar-fill" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="sprint-actions">
                    {sprint.status === 'planned' && (
                        <button className="btn-xs blue">Démarrer le sprint</button>
                    )}
                    {sprint.status === 'active' && (
                        <button className="btn-xs">Terminer le sprint</button>
                    )}
                    <div style={{ position: 'relative' }}>
                        <button className="btn-xs" onClick={() => setMenuOpen(!menuOpen)}>•••</button>
                        {menuOpen && (
                            <div className="sprint-menu" style={{
                                position: 'absolute', right: 0, top: '100%', marginTop: '4px',
                                background: 'var(--color-background-primary)', border: '1px solid var(--color-border-tertiary)',
                                borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', zIndex: 10,
                                display: 'flex', flexDirection: 'column', width: '120px'
                            }}>
                                <span style={{ padding: '8px 12px', fontSize: '12px', cursor: 'pointer' }} onClick={() => setMenuOpen(false)}>Modifier le sprint</span>
                                <span style={{ padding: '8px 12px', fontSize: '12px', cursor: 'pointer', color: 'var(--color-danger-red)' }} onClick={() => setMenuOpen(false)}>Supprimer le sprint</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* LISTE DES TICKETS INTERNES */}
            {isExpanded && (
                <Droppable droppableId={sprint.id} isDropDisabled={!!sortConfig}>
                    {(provided, snapshot) => (
                        <div 
                            className="sprint-content"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{
                                backgroundColor: snapshot.isDraggingOver ? 'var(--color-primary-blue-light)' : 'transparent',
                                transition: 'background-color 0.2s ease',
                                minHeight: '10px'
                            }}
                        >
                            {sprintTasks.length > 0 ? (
                                sprintTasks.map((task, index) => (
                                    <StoryRow 
                                        key={task.id} 
                                        task={task} 
                                        index={index}
                                        isDragDisabled={!!sortConfig}
                                        onTagChange={(newTag, tagIndex) => onTagChange && onTagChange(task.id, newTag, tagIndex)}
                                    />
                                ))
                            ) : (
                                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-tertiary)', fontSize: '12px' }}>
                                    Aucun ticket planifié dans ce bloc.
                                </div>
                            )}
                            
                            {provided.placeholder}

                            {isCreatingTask ? (
                        <div style={{ padding: '8px 14px', borderTop: '1px solid var(--color-border-tertiary)' }}>
                            <input 
                                autoFocus
                                type="text" 
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                onKeyDown={handleCreateTask}
                                placeholder="Que faut-il faire ? (Appuyez sur Entrée pour créer)"
                                style={{ width: '100%', padding: '6px 10px', fontSize: '13px', borderRadius: '4px', border: '1px solid var(--color-primary-blue)', outline: 'none' }}
                                onBlur={() => {
                                    if (!newTaskTitle.trim()) {
                                        setIsCreatingTask(false);
                                    }
                                }}
                            />
                        </div>
                    ) : (
                        <div className="add-story" onClick={() => setIsCreatingTask(true)}>
                            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>+</span> Créer un ticket
                        </div>
                    )}
                        </div>
                    )}
                </Droppable>
            )}

        </div>
    );
}