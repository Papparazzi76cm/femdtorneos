import React, { useState, useEffect } from 'react';
import { CalendarEvent, Team } from '../types';
import { eventService } from '../services/eventService';

interface EventEditorProps {
    eventToEdit: CalendarEvent | null;
    onSave: () => void;
    onCancel: () => void;
    allTeams: Team[];
}

const EventEditor: React.FC<EventEditorProps> = ({ eventToEdit, onSave, onCancel, allTeams }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState('');
    const [type, setType] = useState<CalendarEvent['type']>('Tournament');
    const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);


    useEffect(() => {
        if (eventToEdit) {
            setTitle(eventToEdit.title);
            setDescription(eventToEdit.description);
            setType(eventToEdit.type);
            setSelectedTeamIds(eventToEdit.team_ids || []);
            const start = new Date(eventToEdit.start);
            const end = new Date(eventToEdit.end);
            setStartDate(start.toISOString().split('T')[0]);
            setStartTime(start.toTimeString().substring(0, 5));
            setEndDate(end.toISOString().split('T')[0]);
            setEndTime(end.toTimeString().substring(0, 5));
        } else {
            resetForm();
        }
    }, [eventToEdit]);

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setStartDate('');
        setStartTime('');
        setEndDate('');
        setEndTime('');
        setType('Tournament');
        setSelectedTeamIds([]);
    };
    
    const handleTeamSelection = (teamId: number) => {
        setSelectedTeamIds(prev =>
            prev.includes(teamId)
                ? prev.filter(id => id !== teamId)
                : [...prev, teamId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !startDate || !startTime || !endDate || !endTime) {
            alert('Por favor, rellena todos los campos obligatorios.');
            return;
        }

        const eventData = {
            title,
            description,
            type,
            start: new Date(`${startDate}T${startTime}`).toISOString(),
            end: new Date(`${endDate}T${endTime}`).toISOString(),
            team_ids: selectedTeamIds
        };

        if (eventToEdit) {
            await eventService.updateEvent({ ...eventData, id: eventToEdit.id });
        } else {
            await eventService.addEvent(eventData);
        }
        resetForm();
        onSave();
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{eventToEdit ? 'Editar Evento' : 'Crear Nuevo Evento'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Título del Evento</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Tipo de Evento</label>
                        <select value={type} onChange={e => setType(e.target.value as CalendarEvent['type'])} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2">
                            <option value="Tournament">Torneo</option>
                            <option value="Friendly">Amistoso</option>
                            <option value="Training Camp">Campus de Entrenamiento</option>
                            <option value="Scouting Event">Evento de Ojeadores</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Fecha y Hora de Inicio</label>
                        <div className="flex gap-2">
                             <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2" required />
                             <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Fecha y Hora de Fin</label>
                        <div className="flex gap-2">
                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2" required />
                            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2" required />
                        </div>
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Descripción</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Equipos Participantes</label>
                    <div className="max-h-32 overflow-y-auto bg-white dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600">
                        {allTeams.length > 0 ? allTeams.map(team => (
                            <div key={team.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`team-${team.id}`}
                                    checked={selectedTeamIds.includes(team.id)}
                                    onChange={() => handleTeamSelection(team.id)}
                                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                />
                                <label htmlFor={`team-${team.id}`} className="ml-2 text-gray-800 dark:text-white">{team.name}</label>
                            </div>
                        )) : <p className="text-gray-500 dark:text-gray-400">No hay equipos. Añade equipos en la sección 'Gestión de Equipos'.</p>}
                    </div>
                </div>
                <div className="flex justify-end space-x-2">
                    {eventToEdit && <button type="button" onClick={onCancel} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">Cancelar</button>}
                    <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg">{eventToEdit ? 'Guardar Cambios' : 'Crear Evento'}</button>
                </div>
            </form>
        </div>
    );
}

export default EventEditor;