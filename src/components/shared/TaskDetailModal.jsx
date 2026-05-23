import React, { useState } from 'react';
import WaveInput from '../ui/WaveInput';
import ActionBtn from '../ui/ActionBtn';
import StatusDropdown from '../ui/StatusDropdown';
import StoryPointsRadio from '../ui/StoryPointsRadio';
import './TaskDetailModal.css';

const STATUS_OPTIONS = [
  { value: 'todo', label: 'À Faire', colorClass: 'dot-todo' },
  { value: 'progress', label: 'En Cours', colorClass: 'dot-progress' },
  { value: 'review', label: 'En Revue', colorClass: 'dot-review' },
  { value: 'done', label: 'Terminé', colorClass: 'dot-done' }
];

const POINTS_OPTIONS = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 5, label: '5' },
  { value: 8, label: '8' }
];

const TaskDetailModal = ({ task, onClose, onSave }) => {
  // On initialise l'état avec les données de la tâche cliquée
  const [editedTask, setEditedTask] = useState(task);

  // Pour gérer l'animation de fermeture
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    // On attend la fin de l'animation CSS (200ms) avant de détruire le composant
    setTimeout(() => onClose(), 200); 
  };

  if (!task) return null;

  return (
    <div className={`modal-overlay ${isClosing ? 'fade-out' : 'fade-in'}`} onClick={handleClose}>
      
      {/* Arrête la propagation du clic pour ne pas fermer quand on clique DANS la modale */}
      <div className={`modal-content ${isClosing ? 'slide-down' : 'slide-up'}`} onClick={e => e.stopPropagation()}>
        
        <div className="modal-header">
          <span className="task-id-badge">{editedTask.id}</span>
          <button className="close-btn" onClick={handleClose} type="button">
            {/* Simple X text icon since material icons might not be loaded */}
            <span style={{ fontSize: '20px', fontWeight: 'bold' }}>&times;</span>
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div style={{ flex: 1, marginRight: '24px' }}>
              <WaveInput 
                label="Titre du ticket" 
                value={editedTask.title} 
                onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '160px' }}>
              <div>
                <label className="standard-label">Statut</label>
                <StatusDropdown 
                  options={STATUS_OPTIONS}
                  value={editedTask.status}
                  onChange={(val) => setEditedTask({...editedTask, status: val})}
                />
              </div>

              <div>
                <label className="standard-label">Points d'effort</label>
                <StoryPointsRadio 
                  name="points"
                  options={POINTS_OPTIONS}
                  selectedValue={editedTask.points}
                  onChange={(val) => setEditedTask({...editedTask, points: val})}
                />
              </div>
            </div>
          </div>
          
          {/* Zone pour la description */}
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="standard-label">Description</label>
            <textarea 
              className="standard-textarea"
              placeholder="Ajoutez une description détaillée..."
              value={editedTask.description || ''}
              onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
            />
          </div>
        </div>

        <div className="modal-footer">
          <ActionBtn variant="secondary" onClick={handleClose}>Annuler</ActionBtn>
          <ActionBtn variant="primary" onClick={() => onSave(editedTask)}>Enregistrer</ActionBtn>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
